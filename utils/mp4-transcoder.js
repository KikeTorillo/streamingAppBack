const ffmpegStatic = require('ffmpeg-static'); // Importa el binario estático de FFmpeg para usarlo en Node.js.
const ffmpeg = require('fluent-ffmpeg'); // Importa la biblioteca fluent-ffmpeg para interactuar con FFmpeg.
const fs = require('fs'); // Módulo de Node.js para interactuar con el sistema de archivos.
const path = require('path'); // Módulo de Node.js para manejar rutas de archivos.
const crypto = require('crypto'); // Módulo de Node.js para calcular hashes (SHA256).
const { uploadToMinIO, checkIfFileExistsInMinIO } = require('./aws'); // Funciones para subir y verificar archivos en MinIO.

// Configura la ruta del binario de FFmpeg usando el módulo `ffmpeg-static`.
ffmpeg.setFfmpegPath(ffmpegStatic);

/**
 * Definición de calidades base para transcodificación:
 * - Cada calidad tiene una altura (`h`), un bitrate de video (`vbr`) y un bitrate de audio (`abr`).
 */
const baseQualities = [
  { h: 480, vbr: 1400, abr: 128 }, // 480p
  { h: 720, vbr: 2800, abr: 160 }, // 720p
  { h: 1080, vbr: 5000, abr: 192 }, // 1080p
  { h: 1440, vbr: 8000, abr: 256 }, // 2K (1440p)
  { h: 2160, vbr: 12000, abr: 320 }, // 4K (2160p)
];

/**
 * Función para calcular nuevas resoluciones basadas en la proporción de aspecto original:
 * - Ajusta el ancho (`w`) para mantener la proporción de aspecto del video original.
 */
const calculateResolutions = (originalWidth, originalHeight) => {
  const aspectRatio = originalWidth / originalHeight; // Calcula la proporción de aspecto.
  return baseQualities.map((q) => {
    const newHeight = q.h; // Altura deseada para esta calidad.
    let newWidth = Math.round(newHeight * aspectRatio); // Calcula el nuevo ancho basado en la proporción.
    newWidth = newWidth % 2 === 0 ? newWidth : newWidth + 1; // Asegura que el ancho sea múltiplo de 2.
    return { w: newWidth, h: newHeight, vbr: q.vbr, abr: q.abr };
  });
};

/**
 * Detecta todas las pistas de audio compatibles con el contenedor MP4.
 * Se han incluido los codecs más usados: aac, mp3, opus y ac3.
 */
const detectCompatibleAudioStreams = async (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, data) => {
      if (err) {
        console.error(`Error al analizar el video: ${err.message}`);
        return reject(err);
      }
      const audioStreams = data.streams.filter(
        (stream) =>
          stream.codec_type === 'audio' &&
          ['aac', 'mp3', 'opus', 'ac3'].includes(stream.codec_name) // Incluye AC3.
      );
      resolve(audioStreams);
    });
  });
};

/**
 * Función para generar las opciones de salida de FFmpeg para cada calidad:
 * - Se mapea únicamente el stream de video principal (no MJPEG) usando su índice.
 * - Se aplican opciones de audio de forma global (si existen pistas de audio).
 * - Se incluyen las pistas de subtítulos (si existen), convirtiéndolas a 'mov_text' para compatibilidad con MP4.
 */
const generateOutputOptions = (qualities, audioStreams, subtitleStreams, primaryVideoIndex) => {
  return qualities.map((q) => {
    // Mapea todas las pistas de audio si existen.
    const audioMapping = audioStreams.length > 0 ? ['-map', '0:a'] : [];
    // Mapea todas las pistas de subtítulos si existen.
    const subtitleMapping = subtitleStreams.length > 0 ? ['-map', '0:s'] : [];
    return [
      '-c:v', 'h264',                   // Códec de video H.264.
      '-profile:v', 'main',              // Perfil "main" para compatibilidad.
      '-map', `0:v:${primaryVideoIndex}`, // Mapea el stream de video principal.
      ...audioMapping,                   // Mapea todas las pistas de audio (si existen).
      ...subtitleMapping,                // Mapea todas las pistas de subtítulos (si existen).
      // Si no hay subtítulos, se desactivan con '-sn'.
      ...(subtitleStreams.length === 0 ? ['-sn'] : []),
      '-vf', `scale=${q.w}:${q.h}`,       // Escala el video a la resolución deseada.
      '-pix_fmt', 'yuv420p',              // Formato de píxeles.
      '-maxrate', `${q.vbr}k`,            // Bitrate máximo de video.
      '-bufsize', `${q.vbr}k`,            // Tamaño del buffer de video.
      '-crf', '24',                      // Factor de calidad constante.
      // Opciones de audio global (si hay audio)
      ...(audioStreams.length > 0 ? ['-c:a', 'aac', '-ac', '2', '-b:a', `${q.abr}k`] : []),
      // Convertir subtítulos a 'mov_text' para que sean compatibles con MP4.
      ...(subtitleStreams.length > 0 ? ['-c:s', 'mov_text'] : [])
    ];
  });
};

/**
 * Función para crear directorios si no existen.
 */
const makeDir = (dir) => {
  if (!fs.existsSync(dir)) {
    console.log(`Creando directorio: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  } else {
    console.log(`El directorio ya existe: ${dir}`);
  }
};

/**
 * Función para borrar el directorio `vod`.
 */
const deleteVodDirectory = () => {
  const dir = 'vod';
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`Directorio "${dir}" eliminado correctamente.`);
  } else {
    console.log(`El directorio "${dir}" no existe.`);
  }
};

/**
 * Calcula el hash SHA256 de un archivo.
 */
const calculateFileHash = (filePath) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', (err) => reject(err));
  });
};

/**
 * Función para extraer una pista de subtítulos en formato WebVTT.
 * - Se extrae la pista indicada (según su orden en el contenedor) y se guarda en un archivo.
 */
const extractSubtitleTrack = (filePath, subtitleOrder, outputSubPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .output(outputSubPath)
      .outputOptions([
        '-map', `0:s:${subtitleOrder}`, // Mapea la pista de subtítulos según su orden.
        '-c:s', 'webvtt'               // Convierte la pista a formato WebVTT.
      ])
      .on('start', (commandLine) => {
        console.log(`Extrayendo subtítulos (track ${subtitleOrder}) con comando: ${commandLine}`);
      })
      .on('end', () => {
        console.log(`Subtítulos (track ${subtitleOrder}) extraídos correctamente: ${outputSubPath}`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`Error al extraer subtítulos (track ${subtitleOrder}): ${err.message}`);
        reject(err);
      })
      .run();
  });
};

/**
 * Función principal de transcodificación:
 * - Transcodifica un archivo de video en varias calidades y lo sube a MinIO.
 * - Se omiten los streams MJPEG y se utiliza solo el stream de video principal.
 * - Soporta múltiples pistas de audio y subtítulos usando opciones globales.
 * - Extrae todas las pistas de subtítulos a archivos WebVTT externos (si existen).
 * - Acepta un callback `onProgress` para notificar el progreso.
 */
const transcode = async (filePath, fileHash, onProgress) => {
  return new Promise(async (resolve, reject) => {
    const fileName = fileHash;
    const localDir = `vod/${fileName}`;
    makeDir(localDir);

    // Analiza el video para obtener metadatos.
    ffmpeg.ffprobe(filePath, async (err, data) => {
      if (err) {
        console.error(`Error al analizar el video: ${err.message}`);
        return reject(err);
      }

      // Selecciona el stream de video principal que no sea MJPEG.
      const primaryVideoStream = data.streams.find(
        (item) => item.codec_type === 'video' && item.codec_name !== 'mjpeg'
      );
      if (!primaryVideoStream) {
        console.error('No se encontró un stream de video principal (no MJPEG) en el archivo.');
        return reject(new Error('No se encontró un stream de video principal en el archivo.'));
      }
      const primaryVideoIndex = primaryVideoStream.index;
      const originalWidth = primaryVideoStream.width;
      const originalHeight = primaryVideoStream.height;

      // Detecta las pistas de audio compatibles.
      const audioStreams = await detectCompatibleAudioStreams(filePath);
      if (audioStreams.length === 0) {
        console.warn('No se encontraron pistas de audio compatibles. El video no tendrá audio.');
      }

      // Detecta las pistas de subtítulos del video.
      const subtitleStreams = data.streams.filter(
        (stream) => stream.codec_type === 'subtitle'
      );
      if (subtitleStreams.length > 0) {
        console.log('Pistas de subtítulos encontradas:', subtitleStreams.length);
      } else {
        console.warn('No se encontraron pistas de subtítulos.');
      }

      // Calcula las resoluciones para cada calidad basada en la proporción del video original.
      let qualities = calculateResolutions(originalWidth, originalHeight);

      // Define cuántas calidades generar según la altura original.
      let maxQuality;
      if (originalHeight >= 2160) {
        maxQuality = 5;
      } else if (originalHeight >= 1440) {
        maxQuality = 4;
      } else if (originalHeight >= 1080) {
        maxQuality = 3;
      } else if (originalHeight >= 720) {
        maxQuality = 2;
      } else {
        maxQuality = 1;
      }

      // Ajusta la última calidad para que preserve la resolución original.
      qualities[maxQuality - 1] = {
        w: originalWidth,
        h: originalHeight,
        vbr: qualities[maxQuality - 1].vbr,
        abr: qualities[maxQuality - 1].abr
      };

      // Genera las opciones de salida utilizando las calidades modificadas,
      // incluyendo audio y subtítulos (convertidos a mov_text).
      const outputOptions = generateOutputOptions(qualities, audioStreams, subtitleStreams, primaryVideoIndex);

      console.log(`Generando ${maxQuality} calidades para el video.`);

      // Procesa cada calidad.
      for (const [index, q] of qualities.slice(0, maxQuality).entries()) {
        const outputFile = `${localDir}/_${q.h}p.mp4`;
        const remotePath = `vod/${fileName}/_${q.h}p.mp4`;

        await new Promise((resolveTranscode, rejectTranscode) => {
          ffmpeg(filePath)
            .output(outputFile)
            .outputOptions(outputOptions[index])
            .on('start', (commandLine) => {
              console.log(`Comando FFmpeg ejecutado: ${commandLine}`);
            })
            .on('progress', (progress) => {
              const overallProgress = ((index + progress.percent / 100) / maxQuality) * 100;
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

        // Verifica si el archivo ya existe en MinIO.
        const fileExists = await checkIfFileExistsInMinIO(remotePath);
        if (fileExists) {
          console.log(`El archivo ${outputFile} ya existe en MinIO. Saltando...`);
        } else {
          // Calcula el hash del archivo transcodificado.
          const transcodedFileHash = await calculateFileHash(outputFile);

          // Sube el archivo a MinIO.
          await new Promise((resolveUpload, rejectUpload) => {
            uploadToMinIO(outputFile, remotePath, (error) => {
              if (error) {
                console.error(`Error al subir el archivo a MinIO: ${remotePath}`, error);
                return rejectUpload(error);
              }
              console.log(`Archivo subido a MinIO: ${remotePath}`);
              resolveUpload();
            });
          });
        }
      }

      // Si existen pistas de subtítulos, se extraen todas a archivos WebVTT y se suben a MinIO.
      if (subtitleStreams.length > 0) {
        for (let i = 0; i < subtitleStreams.length; i++) {
          const outputSubtitle = `${localDir}/subtitles_track${i}.vtt`;
          try {
            await extractSubtitleTrack(filePath, i, outputSubtitle);
            const remoteSubtitlePath = `vod/${fileName}/subtitles_track${i}.vtt`;
            const subsExist = await checkIfFileExistsInMinIO(remoteSubtitlePath);
            if (subsExist) {
              console.log(`El archivo ${outputSubtitle} ya existe en MinIO. Saltando...`);
            } else {
              const subHash = await calculateFileHash(outputSubtitle);
              await new Promise((resolveUpload, rejectUpload) => {
                uploadToMinIO(outputSubtitle, remoteSubtitlePath, (error) => {
                  if (error) {
                    console.error(`Error al subir el archivo a MinIO: ${remoteSubtitlePath}`, error);
                    return rejectUpload(error);
                  }
                  console.log(`Archivo subido a MinIO: ${remoteSubtitlePath}`);
                  resolveUpload();
                });
              });
            }
          } catch (err) {
            console.error(`Error durante la extracción y subida de subtítulos (track ${i}):`, err);
          }
        }
      }

      // Una vez procesados todos los archivos, se elimina el directorio temporal y se resuelve la promesa.
      deleteVodDirectory();
      resolve();
    });
  });
};

module.exports = { transcode };
