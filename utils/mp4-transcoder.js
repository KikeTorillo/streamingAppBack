const ffmpegStatic = require('ffmpeg-static'); // Proporciona un binario estático de FFmpeg
const ffmpeg = require('fluent-ffmpeg'); // Interfaz para Node.js que facilita el uso de FFmpeg
const fs = require('fs'); // Módulo de Node.js para interactuar con el sistema de archivos
const path = require('path'); // Módulo de Node.js para manejar rutas de archivos
const crypto = require('crypto'); // Módulo para calcular hashes
const { upload: uploadToMinIO, checkIfFileExistsInMinIO } = require('./aws'); // Importa las funciones de subida y verificación en MinIO

// Configuración de la ruta de FFmpeg
ffmpeg.setFfmpegPath(ffmpegStatic);

// Definición de calidades de transcodificación
const qualities = [
  { w: 842, h: 480, vbr: 1400, abr: 128 }, // 480p
  { w: 1280, h: 720, vbr: 2800, abr: 160 }, // 720p
  { w: 1920, h: 1080, vbr: 5000, abr: 192 }, // 1080p
];

/**
 * Generación de opciones de FFmpeg para cada calidad:
 * - Estas opciones definen cómo se procesará el video y audio para cada resolución.
 */
const outputOptions = qualities.map((q) => {
  return [
    `-c:v h264`, // Códec de video H.264
    '-profile:v main', // Perfil de video "main"
    '-c:a aac', // Códec de audio AAC
    '-ac 2', // 2 canales de audio (estéreo)
    '-map 0:v', // Mapea el primer stream de video
    '-map 0:a?', // Mapea el primer stream de audio (opcional)
    '-sn', // Desactiva los subtítulos
    `-vf scale=${q.w}:${q.h}`, // Escala el video a la resolución deseada
    '-pix_fmt yuv420p', // Formato de píxeles YUV 4:2:0 (compatible con la mayoría de reproductores)
    `-b:a ${q.abr}k`, // Bitrate de audio
    `-maxrate ${q.vbr}k`, // Bitrate máximo de video
    `-bufsize ${q.vbr}k`, // Tamaño del buffer de video
    `-crf 24`, // Factor de calidad constante (CRF): valores más bajos = mejor calidad
  ];
});

/**
 * Función para crear directorios si no existen:
 * - Verifica si el directorio existe y lo crea si no.
 */
const makeDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true }); // Crea directorios anidados si es necesario
  }
};

/**
 * Función para borrar el directorio `vod`:
 * - Elimina el directorio `vod` y su contenido después de que todos los archivos hayan sido procesados.
 */
const deleteVodDirectory = () => {
  const dir = 'vod';
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true }); // Borra el directorio y su contenido
    console.log(`Directorio "${dir}" eliminado correctamente.`);
  } else {
    console.log(`El directorio "${dir}" no existe.`);
  }
};

/**
 * Calcula el hash SHA256 de un archivo.
 * @param {string} filePath - Ruta del archivo.
 * @returns {Promise<string>} - Hash del archivo.
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
 * Función principal de transcodificación:
 * - Procesa un archivo de video, lo transcodifica en varias calidades y lo sube a MinIO.
 * - Acepta un callback `onProgress` para notificar el progreso al frontend.
 */
const transcode = async (filePath, onProgress) => {
  return new Promise(async (resolve, reject) => {
    const fileName = path.parse(filePath).name; // Obtiene el nombre del archivo sin extensión
    const localDir = `vod/${fileName}`; // Directorio local para el archivo
    makeDir(localDir); // Crea la subcarpeta si no existe

    // Analiza el video original para obtener metadatos
    ffmpeg.ffprobe(filePath, async (err, data) => {
      if (err) {
        console.error(`Error al analizar el video: ${err.message}`);
        return reject(err);
      }

      const videoStream = data.streams.find(
        (item) => item.codec_type === 'video'
      );
      if (!videoStream) {
        console.error('No se encontró un stream de video en el archivo.');
        return reject(
          new Error('No se encontró un stream de video en el archivo.')
        );
      }

      let maxQuality = 3;
      if (videoStream.height < 1080 && videoStream.height >= 720) {
        maxQuality = 2;
      } else if (videoStream.height < 720 && videoStream.height >= 480) {
        maxQuality = 1;
      } else if (videoStream.height < 480) {
        maxQuality = 1;
      }

      let filesProcessed = 0;

      for (const [index, q] of qualities.slice(0, maxQuality).entries()) {
        const outputFile = `${localDir}/${fileName}_${q.h}p.mp4`;
        const remotePath = `vod/${fileName}/${fileName}_${q.h}p.mp4`;

        // Transcodifica el video
        await new Promise((resolveTranscode, rejectTranscode) => {
          ffmpeg(filePath)
            .output(outputFile)
            .outputOptions(outputOptions[index])
            .on('progress', (progress) => {
              const overallProgress =
                ((filesProcessed + progress.percent / 100) / maxQuality) * 100;
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

        // Verifica si el archivo ya existe en MinIO
        const fileExists = await checkIfFileExistsInMinIO(remotePath);
        if (fileExists) {
          console.log(
            `El archivo ${outputFile} ya existe en MinIO. Saltando...`
          );
          filesProcessed++;
          if (filesProcessed === maxQuality) {
            deleteVodDirectory();
            resolve();
          }
          continue;
        }

        // Calcula el hash del archivo transcodificado
        const fileHash = await calculateFileHash(outputFile);

        // Subir el archivo a MinIO
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
            filesProcessed++;
            if (filesProcessed === maxQuality) {
              deleteVodDirectory();
              resolve();
            }
            resolveUpload();
          });
        });
      }
    });
  });
};

module.exports = { transcode };
