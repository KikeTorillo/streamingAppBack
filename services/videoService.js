// Este es el servicio que gestiona la data de los videos
const fs = require('fs'); // Módulo para interactuar con el sistema de archivos
const path = require('path'); // Módulo para manejar rutas de archivos
const pool = require('../libs/postgresPool');
const { transcode } = require('../utils/mp4-transcoder'); // Importa el script de transcodificación
const { getUrl } = require('../utils/vod-unique-url');
const { getPresignedUrl } = require('../utils/getPresignedUrl');

class VideoService {
  /**
   * Sube un video, lo transcodifica y lo guarda en MinIO.
   * @param {string} name - Nombre del video.
   * @param {string} category - Categoría del video.
   * @param {string} filePath - Ruta del archivo subido.
   * @param {function} onProgress - Callback para actualizar el progreso.
   * @returns {Promise<Object>} - Respuesta con el estado del proceso.
   */
  async uploadVideo(name, category, contentType, filePath, onProgress) {
    try {
      // Verificar si el archivo existe
      if (!fs.existsSync(filePath)) {
        throw new Error('El archivo no existe en la ruta especificada.');
      }

      // Transcodificar el video
      console.log(`Transcodificando el archivo: ${filePath}`);
      await transcode(filePath, onProgress); // Pasamos el callback de progreso

      // Guardar en la tabla videos
      const rta = await pool.query(
        'INSERT INTO videos (title, category_id, file_path) VALUES ($1, $2, $3) RETURNING *',
        [name, category, filePath]
      );

      const videoId = rta.rows[0].id;

      // Registrar en movies o series según el tipo de contenido
      if (contentType === 'movie') {
      await pool.query(
        'INSERT INTO movies (title, category_id, video_id) VALUES ($1, $2, $3)',
        [name, category, videoId]
      );
      } else if (contentType === 'series') {
        await pool.query(
         'INSERT INTO series (title, category_id) VALUES ($1, $2) RETURNING *',
         [name, category]
       );
      }

      // Eliminar el archivo original de la carpeta uploads/
      console.log(`Eliminando el archivo original: ${filePath}`);
      fs.unlinkSync(filePath);

      return {
        message: 'Video subido, transcodificado y eliminado correctamente.',
      };
    } catch (error) {
      console.error('Error al procesar el video:', error.message);
      throw new Error('Error al subir el video: ' + error.message);
    }
  }

  /**
   * Obtiene los 10 videos más vistos.
   * @param {string} ip - Dirección IP del cliente.
   * @param {string} name - Nombre del video (opcional).
   * @returns {Promise<void>}
   */
  async getTopVideos(ip, name = 'prueba') {
    try {
      const bucketName = 'videos';
      const objectName = 'vod/prueba_720p.mp4';

      // Generar una URL prefirmada para el video
      const url = await getPresignedUrl(bucketName, objectName);
      console.log('URL prefirmada generada:', url);

      // Opcional: Obtener la URL única del video
      // const uniqueUrl = await getUrl(ip, name);
      // console.log('URL única generada:', uniqueUrl);

      // Consultar los 10 videos más vistos en la base de datos (opcional)
      // const result = await pool.query(
      //   'SELECT * FROM videos ORDER BY views DESC LIMIT 10'
      // );
      // return result.rows;
    } catch (error) {
      console.error('Error al obtener los videos:', error.message);
      throw new Error('Error al obtener los videos: ' + error.message);
    }
  }

  async getCategories() {
    const query = `SELECT id, name FROM categories`;
    const rta = await pool.query(query);
    return rta.rows;
  }
}

module.exports = VideoService;
