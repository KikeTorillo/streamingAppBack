const ffmpegStatic = require('ffmpeg-static'); // Importa el binario estático de FFmpeg para usarlo en Node.js.
const ffmpeg = require('fluent-ffmpeg'); // Importa la biblioteca fluent-ffmpeg para interactuar con FFmpeg.
const fs = require('fs'); // Módulo de Node.js para interactuar con el sistema de archivos.
const { uploadFileIfNotExists } = require('../utils/aws');
const { createTempDir, deleteTempDir } = require('../utils/fileHelpers');
const {
  calculateResolutions,
  determineMaxQuality,
} = require('../utils/transcodeSettings');
const { generateOutputOptions } = require('../utils/ffmpegOptions');
const { processSubtitles } = require('../utils/subtitleProcessor');
const { config } = require('../config/config');
// Configura la ruta del binario de FFmpeg usando el módulo `ffmpeg-static`.
ffmpeg.setFfmpegPath(ffmpegStatic);

/**
 * Promisifica ffprobe para usar async/await en lugar de callbacks.
 * @param {string} filePath - Ruta del video.
 * @returns {Promise<Object>} - Datos de ffprobe.
 */
const ffprobeAsync = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
};

/**
 * Detecta todas las pistas de audio compatibles con el contenedor MP4.
 * Se incluyen los codecs más usados: aac, mp3, opus y ac3.
 */
const detectCompatibleAudioStreams = async (filePath) => {
  const data = await ffprobeAsync(filePath);
  return data.streams.filter(
    (stream) =>
      stream.codec_type === 'audio' &&
      ['aac', 'mp3', 'opus', 'ac3'].includes(stream.codec_name)
  );
};

/**
 * Función principal de transcodificación:
 * - Transcodifica un video en varias calidades y lo sube a MinIO.
 * - Se selecciona el stream de video principal (excluyendo MJPEG).
 * - Soporta múltiples pistas de audio y subtítulos.
 * - Extrae las pistas de subtítulos (no forzadas) a archivos WebVTT externos y los sube a MinIO.
 * - Informa el progreso mediante un callback `onProgress`.
 */
const transcode = async (filePath, fileHash, onProgress) => {
  const fileName = fileHash;
  // Arrays y objetos para manejar la nomenclatura de los archivos de subtítulos
  const availableSubtitles = [];
  let availableResolutions = [];
  const localDir = `${config.tempProcessingDir}/${fileName}`;
  try {
    await createTempDir(localDir);

    // Usamos ffprobeAsync en lugar de ffmpeg.ffprobe con callbacks
    let data;
    try {
      data = await ffprobeAsync(filePath);
    } catch (err) {
      console.error(`Error al analizar el video: ${err.message}`);
      throw err;
    }

    const validCodecs = [
      'h264',
      'hevc',
      'vp9',
      'av1', // Códecs de video modernos
      'mpeg4',
      'theora', // Códecs de video antiguos
    ];

    const primaryVideoStream = data.streams.find(
      (item) =>
        item.codec_type === 'video' && validCodecs.includes(item.codec_name)
    );

    if (!primaryVideoStream) {
      console.error(
        'No se encontró un stream de video principal (no MJPEG) en el archivo.'
      );
      throw new Error(
        'No se encontró un stream de video principal en el archivo.'
      );
    }

    const primaryVideoIndex = primaryVideoStream.index;
    const originalWidth = primaryVideoStream.width;
    const originalHeight = primaryVideoStream.height;
    const duration = primaryVideoStream.duration;

    // Detecta las pistas de audio compatibles.
    const audioStreams = await detectCompatibleAudioStreams(filePath);
    if (audioStreams.length === 0) {
      console.warn(
        'No se encontraron pistas de audio compatibles. El video no tendrá audio.'
      );
    }

    // Detecta las pistas de subtítulos.
    const subtitleStreams = data.streams.filter(
      (stream) => stream.codec_type === 'subtitle'
    );
    if (subtitleStreams.length > 0) {
      console.log('Pistas de subtítulos encontradas:', subtitleStreams.length);
    } else {
      console.warn('No se encontraron pistas de subtítulos.');
    }

    // Calcula las resoluciones y determina la máxima calidad usando el módulo extraído.
    let qualities = calculateResolutions(originalWidth, originalHeight);
    const maxQuality = determineMaxQuality(originalHeight);

    // Para la máxima calidad se preserva la resolución original.
    qualities[maxQuality - 1] = {
      w: originalWidth,
      h: originalHeight,
      vbr: qualities[maxQuality - 1].vbr,
      abr: qualities[maxQuality - 1].abr,
    };

    // Se arma un array solo con las alturas disponibles para las resoluciones
    availableResolutions = qualities.slice(0, maxQuality).map((q) => q.h);

    console.log(`Generando ${maxQuality} calidades para el video.`);

    // Procesa cada calidad generada (ahora todas se re-encodean)
    for (let [index, q] of qualities.slice(0, maxQuality).entries()) {
      const outputFile = `${localDir}/_${q.h}p.mp4`;
      const remotePath = `${config.videoDir}/${fileName}/_${q.h}p.mp4`;

      // Usar generateOutputOptions para obtener las opciones de salida
      const opts = generateOutputOptions(
        q,
        index,
        maxQuality,
        primaryVideoIndex,
        audioStreams,
        subtitleStreams
      );

      await new Promise((resolveTranscode, rejectTranscode) => {
        ffmpeg(filePath)
          .output(outputFile)
          .outputOptions(opts)
          .on('start', (commandLine) => {
            console.log(`Comando FFmpeg ejecutado: ${commandLine}`);
          })
          .on('progress', (progress) => {
            // Calcula el progreso global teniendo en cuenta todas las calidades
            const overallProgress =
              ((index + progress.percent / 100) / maxQuality) * 100;
            onProgress(Math.round(overallProgress));
          })
          .on('end', () => {
            console.log(`${outputFile} procesado correctamente`);
            resolveTranscode();
          })
          .on('error', (err) => {
            console.error(`Error al procesar el archivo: ${outputFile}`, err);
            rejectTranscode(err);
          })
          .run();
      });
      try {
        await uploadFileIfNotExists(outputFile, remotePath);
      } catch (err) {
        throw new Error(`Falló subida de ${remotePath}: ${err.message}`);
      }
    }

    // --- Extracción y subida de pistas de subtítulos ---
    // Procesa los subtítulos usando el módulo subtitleProcessor
    if (subtitleStreams.length > 0) {
      const processedSubtitles = await processSubtitles(
        filePath,
        subtitleStreams,
        localDir,
        fileName
      );
      availableSubtitles.push(...processedSubtitles);
    } else {
      console.warn('No se encontraron pistas de subtítulos para extraer.');
    }

    const dataReturn = {
      availableResolutions,
      availableSubtitles,
      duration,
    };
    return dataReturn;
  } catch (error) {
    throw new Error('Error en el proceso de transcodificación: '+ error);
  } finally {
    deleteTempDir(localDir);
  }
};

module.exports = { transcode };
