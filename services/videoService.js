// Importa módulos necesarios
const fs = require('fs'); // Módulo para interactuar con el sistema de archivos (leer, escribir, eliminar archivos)
const path = require('path'); // Módulo para manejar rutas de archivos
const pool = require('../libs/postgresPool'); // Pool de conexiones a PostgreSQL
const { transcode } = require('../utils/mp4-transcoder'); // Script para transcodificar videos
const { getUrl } = require('../utils/vod-unique-url'); // Función para generar URLs únicas
const { getPresignedUrl } = require('../utils/getPresignedUrl'); // Función para generar URLs prefirmadas
const crypto = require('crypto'); // Módulo para calcular hashes
const { uploadToMinIO } = require('../utils/aws'); // Función para subir archivos a MinIO

class VideoService {
  constructor() {
    // Cada servicio tiene su propio pool de conexiones en el constructor
    this.pool = pool;
    // Escucha errores globales del pool
    this.pool.on('error', (err) => console.error(err));
  }

  /**
   * Obtiene todas las categorías disponibles.
   * @returns {Promise} - Lista de categorías.
   */
  async getCategories() {
    try {
      const query = 'SELECT id, name FROM categories'; // Consulta SQL para obtener las categorías
      const result = await this.pool.query(query); // Ejecuta la consulta
      return result.rows; // Devuelve las filas obtenidas
    } catch (error) {
      // Manejo de errores: registra el error y lanza una excepción
      console.error('Error al obtener las categorías:', error.message);
      throw new Error('Error al obtener las categorías: ' + error.message);
    }
  }

  /**
   * Calcula el hash SHA256 de un archivo.
   * @param {string} filePath - Ruta del archivo.
   * @returns {Promise} - Hash del archivo.
   */
  async calculateFileHash(filePath) {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);
      stream.on('data', (chunk) => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', (err) => reject(err));
    });
  }

  /**
   * Verifica si el archivo ya existe en la base de datos.
   * @param {string} fileHash - Hash del archivo.
   * @returns {Promise} - True si el archivo ya existe, false si no.
   */
  async checkIfFileExistsInDatabase(fileHash) {
    const query = 'SELECT id FROM videos WHERE file_hash = $1';
    const result = await this.pool.query(query, [fileHash]);
    return result.rows.length > 0;
  }

  /**
   * Sube un video, lo transcodifica y lo guarda en MinIO.
   * También sube la imagen de portada asociada.
   * @param {Object} fileInfo - Información del video en un objeto
   * dentro de fileInfo.body esta (name, category, contentType, season, episodeNumber).
   * adicional esta fileInfo.videoFilePath y fileInfo.coverImagePath.
   * @param {function} onProgress - Callback para actualizar el progreso.
   * @returns {Promise} - Respuesta con el estado del proceso.
   */
  async uploadVideo(fileInfo, onProgress) {
    const client = await this.pool.connect(); // Obtener una conexión individual
    try {
      const { name, category, contentType, season, episodeNumber } = fileInfo.body;
      const { videoFilePath } = fileInfo;
      const { coverImagePath } = fileInfo;

      // Validar datos obligatorios
      if (!name || !category || !contentType || !videoFilePath || !coverImagePath) {
        throw new Error('Faltan datos obligatorios.');
      }

      if (!['movie', 'series'].includes(contentType)) {
        throw new Error('El tipo de contenido debe ser "movie" o "series".');
      }

      if (contentType === 'series' && (!season || !episodeNumber)) {
        throw new Error('Para series, debes proporcionar temporada y número de episodio.');
      }

      if (!fs.existsSync(videoFilePath) || !fs.existsSync(coverImagePath)) {
        throw new Error('Uno o más archivos no existen en la ruta especificada.');
      }

      // Calcular el hash del archivo de video
      const videoFileHash = await this.calculateFileHash(videoFilePath);
      console.log(`Hash del archivo de video: ${videoFileHash}`);

      // Verificar si el archivo ya existe en la base de datos
      const fileExists = await this.checkIfFileExistsInDatabase(videoFileHash);
      if (fileExists) {
        // Eliminar los archivos originales de la carpeta uploads/
        console.log(`Eliminando el archivo original de video: ${videoFilePath}`);
        fs.unlinkSync(videoFilePath);
        console.log(`Eliminando el archivo original de portada: ${coverImagePath}`);
        fs.unlinkSync(coverImagePath);
        throw new Error('El archivo ya existe en el sistema.');
      }

      // Iniciar transacción
      await client.query('BEGIN');

      // Subir la imagen de portada a MinIO
      const coverImageFileName = path.parse(coverImagePath).name;
      const coverImageRemotePath = `covers/${coverImageFileName}.jpg`;
      await uploadToMinIO(coverImagePath, coverImageRemotePath);
      console.log(`Imagen de portada subida a MinIO: ${coverImageRemotePath}`);

      // Insertar en la tabla videos
      const insertVideoQuery =
        'INSERT INTO videos (title, category_id, file_hash, cover_image) VALUES ($1, $2, $3, $4) RETURNING *';
      const videoResult = await client.query(insertVideoQuery, [
        name, // Nombre proporcionado por el usuario
        category,
        videoFileHash,
        coverImageRemotePath, // Ruta de la imagen de portada en MinIO
      ]);
      const videoId = videoResult.rows[0].id;

      // Registrar en movies o series según el tipo de contenido
      if (contentType === 'movie') {
        const insertMovieQuery =
          'INSERT INTO movies (title, category_id, video_id) VALUES ($1, $2, $3)';
        await client.query(insertMovieQuery, [name, category, videoId]);
      } else if (contentType === 'series') {
        // Buscar o crear la serie en la tabla `series`
        let seriesResult = await client.query(
          'SELECT id FROM series WHERE title = $1 AND category_id = $2',
          [name, category]
        );

        let seriesId;
        if (seriesResult.rows.length === 0) {
          // Si la serie no existe, crearla
          const insertSeriesQuery =
            'INSERT INTO series (title, category_id) VALUES ($1, $2) RETURNING id';
          const newSeriesResult = await client.query(insertSeriesQuery, [name, category]);
          seriesId = newSeriesResult.rows[0].id;
        } else {
          // Si la serie ya existe, usar su ID
          seriesId = seriesResult.rows[0].id;
        }

        // Verificar si ya existe un episodio con el mismo número en la misma temporada
        const checkEpisodeQuery = `
          SELECT id FROM episodes 
          WHERE series_id = $1 AND season = $2 AND episode_number = $3
        `;
        const episodeCheckResult = await client.query(checkEpisodeQuery, [
          seriesId,
          season,
          episodeNumber,
        ]);

        if (episodeCheckResult.rows.length > 0) {
          // Eliminar los archivos originales de la carpeta uploads/
          console.log(`Eliminando el archivo original de video: ${videoFilePath}`);
          fs.unlinkSync(videoFilePath);
          console.log(`Eliminando el archivo original de portada: ${coverImagePath}`);
          fs.unlinkSync(coverImagePath);
          throw new Error(
            `Ya existe un episodio con el número ${episodeNumber} en la temporada ${season} para esta serie.`
          );
        }

        // Insertar el episodio en la tabla `episodes`
        const insertEpisodeQuery =
          'INSERT INTO episodes (series_id, title, season, episode_number, video_id) VALUES ($1, $2, $3, $4, $5)';
        await client.query(insertEpisodeQuery, [
          seriesId,
          name,
          season,
          episodeNumber,
          videoId,
        ]);
      }

      // Transcodificar el video
      console.log(`Transcodificando el archivo: ${videoFilePath}`);
      const minioFolder = `${videoFileHash}`; // Carpeta en MinIO basada en el hash
      await transcode(videoFilePath, videoFileHash, onProgress);

      // Confirmar la transacción
      await client.query('COMMIT');

      // Eliminar los archivos originales de la carpeta uploads/
      console.log(`Eliminando el archivo original de video: ${videoFilePath}`);
      fs.unlinkSync(videoFilePath);
      console.log(`Eliminando el archivo original de portada: ${coverImagePath}`);
      fs.unlinkSync(coverImagePath);

      return {
        message:
          'Video e imagen de portada subidos, transcodificados y eliminados correctamente.',
      };
    } catch (error) {
      // Rollback en caso de error
      await client.query('ROLLBACK');
      console.error('Error al procesar el video:', error.message);
      throw new Error('Error al subir el video: ' + error.message);
    } finally {
      // Liberar la conexión
      client.release();
    }
  }

  /**
   * Obtiene los 10 videos más vistos.
   * @param {string} ip - Dirección IP del cliente.
   * @param {string} name - Nombre del video (opcional).
   * @returns {Promise} - Lista de videos más vistos.
   */
  async getTopVideos(ip, name = 'prueba') {
    try {
      const bucketName = 'videos'; // Nombre del bucket en MinIO
      const objectName = 'vod/prueba_720p.mp4'; // Nombre del objeto en MinIO
      // Generar una URL prefirmada para el video
      const url = await getPresignedUrl(bucketName, objectName); // Genera una URL prefirmada
      console.log('URL prefirmada generada:', url);
      // Consultar los 10 videos más vistos en la base de datos
      const query = 'SELECT * FROM videos ORDER BY views DESC LIMIT 10'; // Consulta SQL para obtener los videos más vistos
      const result = await this.pool.query(query); // Ejecuta la consulta
      return result.rows; // Devuelve las filas obtenidas
    } catch (error) {
      // Manejo de errores: registra el error y lanza una excepción
      console.error('Error al obtener los videos:', error.message);
      throw new Error('Error al obtener los videos: ' + error.message);
    }
  }

  /**
   * Busca videos por nombre.
   * @param {string} name - Nombre del video a buscar.
   * @returns {Promise} - Lista de videos que coinciden con el nombre proporcionado.
   */
  async searchVideosByName(name, contentType) {
    try {
      // Validar que se haya proporcionado un nombre
      if (!name || typeof name !== 'string' || name.trim() === '') {
        throw new Error('El nombre del video es requerido y debe ser una cadena de texto válida.');
      }
  
      // Consulta base
      let query = `
        SELECT v.* 
        FROM videos v
        LEFT JOIN movies m ON v.id = m.video_id
        LEFT JOIN episodes e ON v.id = e.video_id
        WHERE LOWER(v.title) LIKE $1
      `;
  
      // Agregar filtro por tipo de contenido
      const params = [`%${name.toLowerCase()}%`];
      if (contentType === 'movie') {
        query += ` AND m.video_id IS NOT NULL`;
      } else if (contentType === 'series') {
        query += ` AND e.video_id IS NOT NULL`;
      }
  
      // Ejecutar la consulta
      const result = await this.pool.query(query, params);
  
      // Retornar los resultados
      return result.rows;
    } catch (error) {
      console.error('Error al buscar videos por nombre:', error.message);
      throw new Error('Error al buscar videos por nombre: ' + error.message);
    }
  }
}

module.exports = VideoService; // Exporta la clase VideoService