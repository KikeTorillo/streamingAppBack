// Importación de dependencias
const ffmpegStatic = require('ffmpeg-static'); // Proporciona un binario estático de FFmpeg
const ffmpeg = require('fluent-ffmpeg'); // Interfaz para Node.js que facilita el uso de FFmpeg
const fs = require('fs'); // Módulo de Node.js para interactuar con el sistema de archivos
const path = require('path'); // Módulo de Node.js para manejar rutas de archivos
const { upload: uploadToMinIO } = require('./aws'); // Importa la función de subida a MinIO

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
 * Función principal de transcodificación:
 * - Procesa un archivo de video, lo transcodifica en varias calidades y lo sube a MinIO.
 * - Acepta un callback `onProgress` para notificar el progreso al frontend.
 */
const transcode = (filePath, onProgress) => {
  return new Promise((resolve, reject) => {
    const fileName = path.parse(filePath).name; // Obtiene el nombre del archivo sin extensión
    makeDir('vod'); // Crea el directorio "vod" si no existe

    /**
     * Análisis del video original para obtener metadatos:
     * - Usamos `ffmpeg.ffprobe` para extraer información sobre el archivo de video,
     *   como su duración, resolución, codec de video/audio, etc.
     */
    ffmpeg.ffprobe(filePath, (err, data) => {
      if (err) {
        console.error(`Error al analizar el video: ${err.message}`);
        return reject(err); // Rechaza la promesa si hay un error
      }

      // Busca el stream de video en los metadatos
      const videoStream = data.streams.find((item) => item.codec_type === 'video');
      if (!videoStream) {
        console.error('No se encontró un stream de video en el archivo.');
        return reject(new Error('No se encontró un stream de video en el archivo.')); // Rechaza la promesa
      }

      /**
       * Determina la máxima calidad basada en la altura del video original:
       * - Si el video tiene una altura menor a 1080p, se ajusta la calidad máxima
       *   para evitar procesar resoluciones innecesarias.
       */
      let maxQuality = 3; // Por defecto, 1080p
      if (videoStream.height < 1080 && videoStream.height >= 720) {
        maxQuality = 2; // 720p
      } else if (videoStream.height < 720 && videoStream.height >= 480) {
        maxQuality = 1; // 480p
      } else if (videoStream.height < 480) {
        maxQuality = 1; // 480p
      }

      let filesProcessed = 0; // Contador para rastrear cuántos archivos han sido procesados

      /**
       * Transcodifica el video en las calidades seleccionadas:
       * - Iteramos sobre las calidades definidas en el array `qualities`.
       * - Para cada calidad, generamos un archivo transcodificado y lo subimos a MinIO.
       */
      qualities.slice(0, maxQuality).forEach((q, index) => {
        const outputFile = `vod/${fileName}_${q.h}p.mp4`; // Ruta del archivo de salida
        const remotePath = `videos/vod/${fileName}_${q.h}p.mp4`; // Ruta en MinIO

        /**
         * Proceso de transcodificación con FFmpeg:
         * - Usamos `ffmpeg` para transcodificar el video.
         * - Los eventos `on('start')`, `on('progress')`, `on('error')`, y `on('end')`
         *   nos permiten monitorear el progreso y manejar errores.
         */
        ffmpeg(filePath)
          .output(outputFile)
          .outputOptions(outputOptions[index]) // Opciones de FFmpeg para esta calidad
          .on('progress', (progress) => {
            console.log(
              `Procesando ${outputFile} --> ${parseFloat(progress.percent).toFixed(2)}%`
            );
            /**
             * Calcula el progreso general:
             * - Combina el progreso de todas las calidades en un solo valor.
             */
            const overallProgress = ((filesProcessed + progress.percent / 100) / maxQuality) * 100;
            onProgress(Math.round(overallProgress)); // Notifica el progreso al frontend
          })
          .on('end', () => {
            console.log(`${outputFile} procesado correctamente`);

            /**
             * Subir el archivo a MinIO:
             * - Una vez que el archivo ha sido transcodificado, lo subimos a MinIO.
             * - Incrementamos el contador `filesProcessed` para rastrear cuántos archivos
             *   han sido procesados.
             */
            uploadToMinIO(outputFile, (error) => {
              if (error) {
                console.error(`Error al subir el archivo a MinIO: ${remotePath}`, error);
                return reject(error); // Rechaza la promesa si hay un error durante la subida
              }

              console.log(`Archivo subido a MinIO: ${remotePath}`);
              filesProcessed++;

              /**
               * Verifica si todos los archivos han sido procesados:
               * - Si todos los archivos han sido procesados y subidos, resolvemos la promesa.
               * - Esto asegura que el `await` en el servicio espere hasta que todo haya terminado.
               */
              if (filesProcessed === maxQuality) {
                deleteVodDirectory(); // Borra el directorio `vod`
                resolve(); // Resuelve la promesa cuando todo ha terminado
              }
            });
          })
          .on('error', (err) => {
            console.error(`Error al procesar el archivo: ${outputFile}`, err);
            reject(err); // Rechaza la promesa si hay un error durante la transcodificación
          })
          .run();
      });
    });
  });
};

module.exports = { transcode };