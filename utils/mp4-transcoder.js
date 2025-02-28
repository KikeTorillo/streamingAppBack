const ffmpegStatic = require('ffmpeg-static'); // Importa el binario estático de FFmpeg para usarlo en Node.js.
const ffmpeg = require('fluent-ffmpeg'); // Importa la biblioteca fluent-ffmpeg para interactuar con FFmpeg.
const fs = require('fs'); // Módulo de Node.js para interactuar con el sistema de archivos.
const path = require('path'); // Módulo de Node.js para manejar rutas de archivos.
const crypto = require('crypto'); // Módulo de Node.js para calcular hashes (SHA256).
const { upload: uploadToMinIO, checkIfFileExistsInMinIO } = require('./aws'); // Importa funciones personalizadas para subir y verificar archivos en MinIO.

// Configura la ruta del binario de FFmpeg usando el módulo `ffmpeg-static`.
ffmpeg.setFfmpegPath(ffmpegStatic);

/**
 * Definición de calidades base para transcodificación:
 * - Cada calidad tiene un alto (`h`), un bitrate de video (`vbr`) y un bitrate de audio (`abr`).
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
 * Función para detectar todas las pistas de audio en el archivo de entrada:
 * - Usa `ffprobe` para analizar el archivo y extraer información sobre las pistas de audio.
 */
const detectAudioStreams = async (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, data) => {
      if (err) {
        console.error(`Error al analizar el video: ${err.message}`);
        return reject(err);
      }
      const audioStreams = data.streams.filter((stream) => stream.codec_type === 'audio');
      resolve(audioStreams);
    });
  });
};

/**
 * Generación de opciones de FFmpeg para cada calidad:
 * - Estas opciones definen cómo se procesará el video y audio para cada resolución.
 * - Incluye soporte para múltiples pistas de audio.
 */
const generateOutputOptions = (qualities, audioStreams) => {
  return qualities.map((q) => {
    // Genera un array plano con todos los `-map` necesarios para las pistas de audio.
    const audioMapping = audioStreams.flatMap((_, index) => ['-map', `0:a:${index}`]);
    return [
      `-c:v`, `h264`, // Códec de video H.264 (compatible con la mayoría de reproductores).
      '-profile:v', 'main', // Perfil de video "main" (equilibrio entre compatibilidad y calidad).
      '-c:a', 'aac', // Códec de audio AAC (compatible con la mayoría de reproductores).
      '-ac', '2', // 2 canales de audio (estéreo).
      '-map', '0:v', // Mapea el primer stream de video del archivo de entrada.
      ...audioMapping, // Mapea todas las pistas de audio disponibles.
      '-sn', // Desactiva los subtítulos en la salida.
      `-vf`, `scale=${q.w}:${q.h}`, // Escala el video a la resolución deseada (ancho x alto).
      '-pix_fmt', 'yuv420p', // Formato de píxeles YUV 4:2:0 (compatible con la mayoría de reproductores).
      `-b:a`, `${q.abr}k`, // Bitrate de audio (en kbps).
      `-maxrate`, `${q.vbr}k`, // Bitrate máximo de video (en kbps).
      `-bufsize`, `${q.vbr}k`, // Tamaño del buffer de video (en kbps).
      `-crf`, `24`, // Factor de calidad constante (CRF): valores más bajos = mejor calidad.
    ];
  });
};

/**
 * Función para crear directorios si no existen:
 * - Verifica si el directorio existe y lo crea si no.
 */
const makeDir = (dir) => {
  if (!fs.existsSync(dir)) {
    console.log(`Creando directorio: ${dir}`); // Log para depuración.
    fs.mkdirSync(dir, { recursive: true }); // Crea directorios anidados si es necesario.
  } else {
    console.log(`El directorio ya existe: ${dir}`); // Log para depuración.
  }
};

/**
 * Función para borrar el directorio `vod`:
 * - Elimina el directorio `vod` y su contenido después de que todos los archivos hayan sido procesados.
 */
const deleteVodDirectory = () => {
  const dir = 'vod'; // Ruta del directorio temporal.
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true }); // Borra el directorio y su contenido.
    console.log(`Directorio "${dir}" eliminado correctamente.`); // Log para depuración.
  } else {
    console.log(`El directorio "${dir}" no existe.`); // Log para depuración.
  }
};

/**
 * Calcula el hash SHA256 de un archivo:
 * - Usa el módulo `crypto` para generar un hash único del archivo.
 */
const calculateFileHash = (filePath) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256'); // Crea un objeto hash SHA256.
    const stream = fs.createReadStream(filePath); // Lee el archivo en modo stream.
    stream.on('data', (chunk) => hash.update(chunk)); // Actualiza el hash con cada fragmento del archivo.
    stream.on('end', () => resolve(hash.digest('hex'))); // Finaliza el hash y lo retorna como una cadena hexadecimal.
    stream.on('error', (err) => reject(err)); // Maneja errores al leer el archivo.
  });
};

/**
 * Función principal de transcodificación:
 * - Procesa un archivo de video, lo transcodifica en varias calidades y lo sube a MinIO.
 * - Soporta múltiples pistas de audio.
 * - Acepta un callback `onProgress` para notificar el progreso al frontend.
 */
const transcode = async (filePath, onProgress) => {
  return new Promise(async (resolve, reject) => {
    const fileName = path.parse(filePath).name; // Obtiene el nombre del archivo sin extensión.
    const localDir = `vod/${fileName}`; // Directorio local para almacenar las versiones transcodificadas.
    makeDir(localDir); // Crea el directorio si no existe.

    // Analiza el video original para obtener metadatos.
    ffmpeg.ffprobe(filePath, async (err, data) => {
      if (err) {
        console.error(`Error al analizar el video: ${err.message}`); // Log de error.
        return reject(err); // Rechaza la promesa si ocurre un error.
      }

      const videoStream = data.streams.find((item) => item.codec_type === 'video'); // Busca el stream de video.
      if (!videoStream) {
        console.error('No se encontró un stream de video en el archivo.'); // Log de error.
        return reject(new Error('No se encontró un stream de video en el archivo.')); // Rechaza la promesa si no hay video.
      }

      const originalWidth = videoStream.width; // Ancho original del video.
      const originalHeight = videoStream.height; // Alto original del video.

      // Detecta todas las pistas de audio disponibles.
      const audioStreams = await detectAudioStreams(filePath);

      // Calcula las nuevas resoluciones basadas en la proporción de aspecto original.
      const qualities = calculateResolutions(originalWidth, originalHeight);
      const outputOptions = generateOutputOptions(qualities, audioStreams); // Genera las opciones de FFmpeg para cada calidad.

      // Determina cuántas calidades generar según el alto original.
      let maxQuality = 3;
      if (originalHeight >= 2160) {
        maxQuality = 5; // Genera hasta 4K si el video original es 4K o superior.
      } else if (originalHeight >= 1440) {
        maxQuality = 4; // Genera hasta 2K si el video original es 2K o superior.
      } else if (originalHeight < 1080 && originalHeight >= 720) {
        maxQuality = 2; // Genera hasta 720p si el video original es menor a 1080p pero mayor o igual a 720p.
      } else if (originalHeight < 720 && originalHeight >= 480) {
        maxQuality = 1; // Genera hasta 480p si el video original es menor a 720p pero mayor o igual a 480p.
      } else if (originalHeight < 480) {
        maxQuality = 1; // Genera solo 480p si el video original es menor a 480p.
      }
      
      console.log(`Generando ${maxQuality} calidades para el video.`); // Log informativo.

      let filesProcessed = 0; // Contador para rastrear cuántos archivos han sido procesados.

      // Itera sobre las calidades seleccionadas.
      for (const [index, q] of qualities.slice(0, maxQuality).entries()) {
        const outputFile = `${localDir}/_${q.h}p.mp4`; // Ruta del archivo de salida.
        const remotePath = `vod/${fileName}/_${q.h}p.mp4`; // Ruta remota en MinIO.

        // Transcodifica el video.
        await new Promise((resolveTranscode, rejectTranscode) => {
          ffmpeg(filePath)
            .output(outputFile) // Especifica el archivo de salida.
            .outputOptions(outputOptions[index]) // Aplica las opciones de FFmpeg para esta calidad.
            .on('start', (commandLine) => {
              console.log(`Comando FFmpeg ejecutado: ${commandLine}`); // Log del comando ejecutado.
            })
            .on('progress', (progress) => {
              const overallProgress =
                ((filesProcessed + progress.percent / 100) / maxQuality) * 100; // Calcula el progreso global.
              onProgress(Math.round(overallProgress)); // Notifica el progreso al frontend.
            })
            .on('end', () => {
              console.log(`${outputFile} procesado correctamente`); // Log informativo.
              resolveTranscode(); // Resuelve la promesa cuando el proceso termina.
            })
            .on('error', (err) => {
              console.error(`Error al procesar el archivo: ${outputFile}`, err); // Log de error.
              rejectTranscode(err); // Rechaza la promesa si ocurre un error.
            })
            .run(); // Ejecuta el comando de FFmpeg.
        });

        // Verifica si el archivo ya existe en MinIO.
        const fileExists = await checkIfFileExistsInMinIO(remotePath);
        if (fileExists) {
          console.log(`El archivo ${outputFile} ya existe en MinIO. Saltando...`); // Log informativo.
          filesProcessed++; // Incrementa el contador de archivos procesados.
          if (filesProcessed === maxQuality) {
            deleteVodDirectory(); // Borra el directorio temporal si todos los archivos han sido procesados.
            resolve(); // Resuelve la promesa principal.
          }
          continue; // Salta al siguiente archivo si ya existe en MinIO.
        }

        // Calcula el hash del archivo transcodificado.
        const fileHash = await calculateFileHash(outputFile);

        // Sube el archivo a MinIO.
        await new Promise((resolveUpload, rejectUpload) => {
          uploadToMinIO(outputFile, remotePath, (error) => {
            if (error) {
              console.error(`Error al subir el archivo a MinIO: ${remotePath}`, error); // Log de error.
              return rejectUpload(error); // Rechaza la promesa si ocurre un error.
            }
            console.log(`Archivo subido a MinIO: ${remotePath}`); // Log informativo.
            filesProcessed++; // Incrementa el contador de archivos procesados.
            if (filesProcessed === maxQuality) {
              deleteVodDirectory(); // Borra el directorio temporal si todos los archivos han sido procesados.
              resolve(); // Resuelve la promesa principal.
            }
            resolveUpload(); // Resuelve la promesa de subida.
          });
        });
      }
    });
  });
};

module.exports = { transcode }; // Exporta la función `transcode` para ser usada en otros módulos.