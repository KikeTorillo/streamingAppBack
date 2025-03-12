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
 * Cada calidad tiene una altura (`h`), un bitrate de video (`vbr`) y un bitrate de audio (`abr`).
 */
const baseQualities = [
  { h: 480, vbr: 1400, abr: 128 }, // 480p
  { h: 720, vbr: 2800, abr: 160 }, // 720p
  { h: 1080, vbr: 5000, abr: 192 }, // 1080p
  { h: 1440, vbr: 8000, abr: 256 }, // 2K (1440p)
  { h: 2160, vbr: 12000, abr: 320 }, // 4K (2160p)
];

/**
 * Calcula nuevas resoluciones basadas en la proporción de aspecto original.
 * Ajusta el ancho (`w`) para mantener la proporción del video.
 */
const calculateResolutions = (originalWidth, originalHeight) => {
  const aspectRatio = originalWidth / originalHeight;
  return baseQualities.map((q) => {
    const newHeight = q.h;
    let newWidth = Math.round(newHeight * aspectRatio);
    if (newWidth % 2 !== 0) {
      newWidth += 1;
    }
    return { w: newWidth, h: newHeight, vbr: q.vbr, abr: q.abr };
  });
};

/**
 * Detecta todas las pistas de audio compatibles con el contenedor MP4.
 * Se incluyen los codecs más usados: aac, mp3, opus y ac3.
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
          ['aac', 'mp3', 'opus', 'ac3'].indexOf(stream.codec_name) !== -1
      );
      resolve(audioStreams);
    });
  });
};

/**
 * Genera las opciones de salida de FFmpeg para cada calidad.
 * En este ejemplo, se arma un array de opciones sin utilizar spread operators inline.
 */
const generateOutputOptions = (
  qualities,
  audioStreams,
  subtitleStreams,
  primaryVideoIndex
) => {
  return qualities.map((q) => {
    let opts = [];
    opts.push('-c:v', 'h264');
    opts.push('-profile:v', 'main');
    opts.push('-map', `0:v:${primaryVideoIndex}`);
    if (audioStreams.length > 0) {
      opts.push('-map', '0:a');
    }
    if (subtitleStreams.length > 0) {
      opts.push('-map', '0:s');
    } else {
      opts.push('-sn');
    }
    opts.push('-vf', `scale=${q.w}:${q.h}`);
    opts.push('-pix_fmt', 'yuv420p');
    opts.push('-maxrate', `${q.vbr}k`);
    opts.push('-bufsize', `${q.vbr}k`);
    opts.push('-crf', '24');
    if (audioStreams.length > 0) {
      opts.push('-c:a', 'aac', '-ac', '2', '-b:a', `${q.abr}k`);
    }
    if (subtitleStreams.length > 0) {
      opts.push('-c:s', 'mov_text');
    }
    return opts;
  });
};

/**
 * Crea un directorio si no existe.
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
 * Elimina el directorio 'vod'.
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
 * Extrae una pista de subtítulos en formato WebVTT.
 * Se extrae la pista indicada (según su índice en el contenedor) y se guarda en un archivo.
 */
const extractSubtitleTrack = (filePath, subtitleOrder, outputSubPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .output(outputSubPath)
      .outputOptions(['-map', `0:s:${subtitleOrder}?`, '-c:s', 'webvtt'])
      .on('start', (commandLine) => {
        console.log(
          `Extrayendo subtítulos (track ${subtitleOrder}) con comando: ${commandLine}`
        );
      })
      .on('end', () => {
        console.log(
          `Subtítulos (track ${subtitleOrder}) extraídos correctamente: ${outputSubPath}`
        );
        resolve();
      })
      .on('error', (err) => {
        console.error(
          `Error al extraer subtítulos (track ${subtitleOrder}): ${err.message}`
        );
        reject(err);
      })
      .run();
  });
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
  return new Promise(async (resolve, reject) => {
    const fileName = fileHash;
    const localDir = `vod/${fileName}`;
    makeDir(localDir);

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
        console.error(
          'No se encontró un stream de video principal (no MJPEG) en el archivo.'
        );
        return reject(
          new Error(
            'No se encontró un stream de video principal en el archivo.'
          )
        );
      }
      const primaryVideoIndex = primaryVideoStream.index;
      const originalWidth = primaryVideoStream.width;
      const originalHeight = primaryVideoStream.height;

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
        console.log(
          'Pistas de subtítulos encontradas:',
          subtitleStreams.length
        );
      } else {
        console.warn('No se encontraron pistas de subtítulos.');
      }

      // Calcula las resoluciones para cada calidad basada en la proporción del video original.
      let qualities = calculateResolutions(originalWidth, originalHeight);
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

      // Para la máxima calidad se preserva la resolución original.
      qualities[maxQuality - 1] = {
        w: originalWidth,
        h: originalHeight,
        vbr: qualities[maxQuality - 1].vbr,
        abr: qualities[maxQuality - 1].abr,
      };

      // Genera las opciones de salida para cada calidad.
      const outputOptions = generateOutputOptions(
        qualities,
        audioStreams,
        subtitleStreams,
        primaryVideoIndex
      );

      console.log(`Generando ${maxQuality} calidades para el video.`);

      // Procesa cada calidad generada (ahora todas se re-encodean)
      for (let [index, q] of qualities.slice(0, maxQuality).entries()) {
        const outputFile = `${localDir}/_${q.h}p.mp4`;
        const remotePath = `vod/${fileName}/_${q.h}p.mp4`;

        // Configuramos las opciones de salida
        let opts = [];
        opts.push('-c:v', 'h264');
        // Usamos el perfil "high" para la máxima calidad y "main" para las demás
        opts.push('-profile:v', index === maxQuality - 1 ? 'high' : 'main');
        opts.push('-map', `0:v:${primaryVideoIndex}`);
        if (audioStreams.length > 0) {
          opts.push('-map', '0:a');
        }
        if (subtitleStreams.length > 0) {
          opts.push('-map', '0:s');
        } else {
          opts.push('-sn');
        }
        // Para la calidad, aplicamos el escalado según las dimensiones calculadas
        opts.push('-vf', `scale=${q.w}:${q.h}`);
        opts.push('-pix_fmt', 'yuv420p');
        // Para la máxima calidad usamos un CRF menor (más calidad), y para el resto, CRF 24
        opts.push('-crf', index === maxQuality - 1 ? '18' : '24');
        opts.push('-maxrate', `${q.vbr}k`);
        opts.push('-bufsize', `${q.vbr}k`);
        if (audioStreams.length > 0) {
          opts.push('-c:a', 'aac', '-ac', '2', '-b:a', `${q.abr}k`);
        }
        if (subtitleStreams.length > 0) {
          opts.push('-c:s', 'mov_text');
        }

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

        // Verifica si el archivo ya existe en MinIO y, de no existir, lo sube.
        const fileExists = await checkIfFileExistsInMinIO(remotePath);
        if (fileExists) {
          console.log(
            `El archivo ${outputFile} ya existe en MinIO. Saltando...`
          );
        } else {
          const transcodedFileHash = await calculateFileHash(outputFile);
          await new Promise((resolveUpload, rejectUpload) => {
            uploadToMinIO(outputFile, remotePath, (error) => {
              if (error) {
                console.error(
                  `Error al subir el archivo a MinIO: ${remotePath}`,
                  error
                );
                return rejectUpload(error);
              }
              console.log(`Archivo subido a MinIO: ${remotePath}`);
              resolveUpload();
            });
          });
        }
      }

      // --- Extracción y subida de pistas de subtítulos ---
      if (subtitleStreams.length > 0) {
        console.log(
          'Extrayendo pistas de subtítulos:',
          subtitleStreams.length
        );
        // Se crean dos contadores separados: uno para pistas forzadas y otro para las no forzadas.
        let normalLangCount = {};
        let forcedLangCount = {};
        for (let stream of subtitleStreams) {
          // Se obtiene el idioma del stream, o 'und' (indefinido) si no se especifica.
          const language = (stream.tags && stream.tags.language) || 'und';
          // Se verifica si el stream de subtítulos está marcado como forzado.
          const isForced = stream.disposition && stream.disposition.forced === 1;
          let fileNameSubtitle;
          if (isForced) {
            // Se incrementa el contador para pistas forzadas de ese idioma.
            forcedLangCount[language] = (forcedLangCount[language] || 0) + 1;
            // Si hay más de una pista forzada en el mismo idioma se añade un sufijo numérico.
            fileNameSubtitle =
              forcedLangCount[language] > 1
                ? `forced-${language}_${forcedLangCount[language]}.vtt`
                : `forced-${language}.vtt`;
          } else {
            // Se incrementa el contador para pistas no forzadas de ese idioma.
            normalLangCount[language] = (normalLangCount[language] || 0) + 1;
            // Se construye el nombre del archivo según si es la primera o hay varias pistas.
            fileNameSubtitle =
              normalLangCount[language] > 1
                ? `${language}_${normalLangCount[language]}.vtt`
                : `${language}.vtt`;
          }
          // Ruta local donde se guardará el archivo de subtítulos extraído.
          const outputSubtitle = `${localDir}/${fileNameSubtitle}`;
          try {
            // Se extrae la pista de subtítulos utilizando su índice en el contenedor.
            await extractSubtitleTrack(filePath, stream.index, outputSubtitle);
            // Se define la ruta remota para el archivo en MinIO.
            const remoteSubtitlePath = `vod/${fileName}/${fileNameSubtitle}`;
            const subsExist = await checkIfFileExistsInMinIO(
              remoteSubtitlePath
            );
            if (subsExist) {
              console.log(
                `El archivo ${outputSubtitle} ya existe en MinIO. Saltando...`
              );
            } else {
              const subHash = await calculateFileHash(outputSubtitle);
              await new Promise((resolveUpload, rejectUpload) => {
                uploadToMinIO(outputSubtitle, remoteSubtitlePath, (error) => {
                  if (error) {
                    console.error(
                      `Error al subir el archivo a MinIO: ${remoteSubtitlePath}`,
                      error
                    );
                    return rejectUpload(error);
                  }
                  console.log(`Archivo subido a MinIO: ${remoteSubtitlePath}`);
                  resolveUpload();
                });
              });
            }
          } catch (err) {
            console.error(
              `Error durante la extracción y subida de subtítulos (pista ${stream.index}):`,
              err
            );
            throw err;
          }
        }
      } else {
        console.warn(
          'No se encontraron pistas de subtítulos para extraer.'
        );
      }

      // Una vez procesados todos los archivos, elimina el directorio temporal.
      deleteVodDirectory();
      resolve();
    });
  });
};

module.exports = { transcode };
