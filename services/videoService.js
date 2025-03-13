// VideoService.js

// Importamos los módulos necesarios para el manejo de archivos, rutas y operaciones en PostgreSQL
const fs = require('fs'); // Para interactuar con el sistema de archivos
const pool = require('../libs/postgresPool'); // Pool de conexiones a PostgreSQL
const { transcode } = require('../utils/mp4-transcoder'); // Función para transcodificar videos
const crypto = require('crypto'); // Para calcular hashes de archivos
const { uploadToMinIO } = require('../utils/aws'); // Función para subir archivos a MinIO
const { configureAuditContext } = require('../utils/configureAuditContext');

/**
 * Clase que gestiona las operaciones relacionadas con videos.
 */
class VideoService {
  /**
   * Constructor de la clase.
   * Inicializa el pool de conexiones y maneja errores globales del pool.
   */
  constructor() {
    this.pool = pool; // Asigna el pool de conexiones a una variable interna
    // Se suscribe al evento de error del pool para loguear errores generales
    this.pool.on('error', (err) => console.error(err));
  }

  /**
   * Obtiene todas las categorías disponibles, ordenadas alfabéticamente.
   * @returns {Promise<Array>} - Lista de categorías con sus id y nombre.
   */
  async getCategories() {
    try {
      // Consulta SQL que obtiene el id y nombre de las categorías ordenadas por nombre
      const query = 'SELECT id, name FROM categories ORDER BY name';
      const result = await this.pool.query(query);
      return result.rows; // Retorna un arreglo con las categorías
    } catch (error) {
      console.error('Error al obtener las categorías:', error.message);
      throw new Error('Error al obtener las categorías: ' + error.message);
    }
  }

  /**
   * Calcula el hash SHA256 de un archivo.
   * @param {string} filePath - Ruta del archivo a procesar.
   * @returns {Promise<string>} - Hash calculado del archivo.
   */
  async calculateFileHash(filePath) {
    return new Promise((resolve, reject) => {
      // Se crea un objeto hash de tipo sha256
      const hash = crypto.createHash('sha256');
      // Se crea un stream de lectura del archivo
      const stream = fs.createReadStream(filePath);
      stream.on('data', (chunk) => hash.update(chunk)); // Actualiza el hash con cada chunk leído
      stream.on('end', () => resolve(hash.digest('hex'))); // Al finalizar, devuelve el hash en formato hexadecimal
      stream.on('error', (err) => reject(err)); // Si ocurre error, lo rechaza
    });
  }

  /**
   * Verifica si un archivo ya existe en la base de datos basado en su hash.
   * @param {string} fileHash - Hash del archivo.
   * @returns {Promise<boolean>} - True si existe, false en caso contrario.
   */
  async checkIfFileExistsInDatabase(fileHash) {
    // Consulta SQL para buscar el archivo en la tabla videos limitando el resultado a 1 registro
    const query = 'SELECT id FROM videos WHERE file_hash = $1 LIMIT 1';
    const result = await this.pool.query(query, [fileHash]);
    return result.rows.length > 0; // Retorna true si se encontró al menos un registro
  }

  /**
   * Sube un video, lo transcodifica y lo guarda en MinIO.
   * También sube la imagen de portada y actualiza el registro del video
   * con la información de resoluciones y subtítulos disponibles.
   * @param {Object} fileInfo - Información del video. Dentro de fileInfo.body se esperan campos como (name, category, contentType, season, episodeNumber). Además, se espera fileInfo.videoFilePath y fileInfo.coverImagePath.
   * @param {function} onProgress - Callback para actualizar el progreso de transcodificación.
   * @returns {Promise<Object>} - Objeto con el estado del proceso.
   */
  async uploadVideo(fileInfo, onProgress) {
    // Se obtiene una conexión individual del pool para realizar la transacción
    const client = await this.pool.connect();
    try {

      // Desestructuramos la información necesaria del objeto fileInfo
      const {
        name,
        category: categoryId,
        contentType,
        season,
        episodeNumber,
        releaseYear,
        description,
        videoFilePath,
        coverImagePath,
        user,
        ip,
      } = fileInfo;

      // Verificamos que los archivos de video y portada existan en el sistema
      if (!fs.existsSync(videoFilePath))
        throw new Error('Archivo de video no encontrado');
      if (!fs.existsSync(coverImagePath))
        throw new Error('Imagen de portada no encontrada');

      // Se calcula el hash del archivo de video para identificarlo de forma única
      const videoFileHash = await this.calculateFileHash(videoFilePath);
      if (await this.checkIfFileExistsInDatabase(videoFileHash)) {
        await fs.promises.unlink(videoFilePath);
        await fs.promises.unlink(coverImagePath);
        console.log('Archivo eliminado correctamente');

        throw new Error('Contenido duplicado Hash de video ya existe en la BD');
      }

      configureAuditContext(client, user.id, ip);

      // Se inicia una transacción para asegurar la integridad de las operaciones en la base de datos
      await client.query('BEGIN');

      // Se sube la imagen de portada a MinIO, construyendo la ruta remota usando el hash del video
      const coverImageRemotePath = `vod/${videoFileHash}/cover.jpg`;
      await uploadToMinIO(coverImagePath, coverImageRemotePath);
      console.log(`Imagen de portada subida a MinIO: ${coverImageRemotePath}`);

      // Se inicia el proceso de transcodificación del video, el cual genera las distintas resoluciones y extrae subtítulos
      console.log(`Transcodificando el archivo: ${videoFilePath}`);
      const { 
        availableResolutions, 
        availableSubtitles, 
        duration 
      } = await transcode(videoFilePath, videoFileHash, onProgress);
      console.log('Resoluciones creadas:', availableResolutions);
      console.log('Subtítulos creados:', availableSubtitles);

      // Se inserta un registro en la tabla videos con la información obtenida, retornando solo el id para reducir datos transferidos
      // Inserción del video (se asume que el hash es único, y se inserta sin ON CONFLICT)
      const insertVideoQuery = `
        INSERT INTO videos (
          file_hash,
          available_resolutions,
          available_subtitles,
          duration
        ) VALUES ($1, $2, $3, $4)
        RETURNING id
      `;
      const videoResult = await client.query(insertVideoQuery, [
        videoFileHash,
        JSON.stringify(availableResolutions),
        JSON.stringify(availableSubtitles),
        duration,
      ]);
      if (videoResult.rows.length === 0) {
        throw new Error('No se pudo insertar el video.');
      }
      const videoId = videoResult.rows[0].id;

      // Se registra el contenido en la tabla correspondiente según el tipo de contenido
      // Insertar en tabla específica (movies/series)
      if (contentType === 'movie') {
        // Inserción en películas usando ON CONFLICT DO NOTHING
        const movieResult = await client.query(
          `INSERT INTO movies (
            title,
            description,
            category_id,
            video_id,
            release_year
          ) VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (title_normalized, release_year) DO NOTHING
          RETURNING id`,
          [name, description, categoryId, videoId, releaseYear]
        );

        // Si ya existe una película con ese título y año, rowCount será 0
        if (movieResult.rowCount === 0) {
          throw new Error('La película ya existe. Operación abortada.');
        }
      } else {
        // Verificamos que la serie no exista ya para evitar duplicados
        const seriesResult = await client.query(
          `INSERT INTO series (
            title,
            description,
            category_id,
            release_year
          ) VALUES ($1, $2, $3, $4)
          ON CONFLICT (title_normalized, release_year) DO NOTHING
          RETURNING id`,
          [name, description, categoryId, releaseYear]
        );

        // Si la serie ya existe, abortamos la operación
        if (seriesResult.rowCount === 0) {
          throw new Error('La serie ya existe. Operación abortada.');
        }
        const seriesId = seriesResult.rows[0].id;

        // Ahora insertamos el episodio (aquí, según tu lógica, puedes querer hacer lo mismo)
        const episodeResult = await client.query(
          `INSERT INTO episodes (
            series_id,
            title,
            season,
            episode_number,
            video_id
          ) VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (series_id, season, episode_number) DO NOTHING
          RETURNING id`,
          [seriesId, name, season, episodeNumber, videoId]
        );
        if (episodeResult.rowCount === 0) {
          throw new Error('El episodio ya existe. Operación abortada.');
        }
      }
      // Se confirma la transacción, asegurando que todas las operaciones anteriores se hayan ejecutado correctamente
      await client.query('COMMIT');

      // Se eliminan los archivos originales para liberar espacio en el servidor
      console.log(`Eliminando el archivo original de video: ${videoFilePath}`);
      fs.unlink(videoFilePath);
      console.log(
        `Eliminando el archivo original de portada: ${coverImagePath}`
      );
      fs.unlink(coverImagePath);

      // Se retorna un mensaje confirmando que el proceso se completó correctamente
      return {
        message:
          'Video e imagen de portada subidos, transcodificados y eliminados correctamente.',
      };
    } catch (error) {
      // En caso de error, se realiza un rollback para revertir las operaciones en la base de datos
      await client.query('ROLLBACK');
      console.error('Error al procesar el video:', error.message);
      throw new Error('Error al subir el video: ' + error.message);
    } finally {
      // Se libera la conexión adquirida del pool
      client.release();
    }
  }

  /**
   * Busca videos por nombre, filtrando según el tipo de contenido si se especifica.
   * Se utiliza una subconsulta con EXISTS para mejorar la eficiencia en la búsqueda.
   * @param {string} name - Nombre (o parte del nombre) del video a buscar.
   * @param {string} contentType - Tipo de contenido ('movie' o 'series'), opcional.
   * @returns {Promise<Array>} - Lista de videos que coinciden con el criterio de búsqueda.
   */
  async searchVideosByName(name, contentType) {
    try {
      // Validación del parámetro name para asegurarse que sea una cadena de texto no vacía
      if (!name || typeof name !== 'string' || name.trim() === '') {
        throw new Error(
          'El nombre del video es requerido y debe ser una cadena de texto válida.'
        );
      }
      let query;
      // Se construye la consulta según el tipo de contenido especificado
      if (contentType === 'movie') {
        // Para películas: se seleccionan videos cuyo título coincida y que tengan un registro en la tabla movies
        query = `
          SELECT m.*
          FROM movies m
          WHERE title_normalized LIKE $1
        `;
      } else {
        // Para series: se seleccionan videos cuyo título coincida y que tengan un registro en la tabla episodes
        query = `
          SELECT s.*
          FROM series s
          WHERE title_normalized LIKE $1
        `;
      }
      // Se prepara el parámetro de búsqueda convirtiendo el nombre a minúsculas y envolviéndolo en comodines
      const params = [`%${name.toLowerCase()}%`];
      const result = await this.pool.query(query, params);
      return result.rows; // Retorna el listado de videos que cumplen con la condición
    } catch (error) {
      console.error('Error al buscar videos por nombre:', error.message);
      throw new Error('Error al buscar videos por nombre: ' + error.message);
    }
  }

  async getMovies() {
    try {
      const query = 'SELECT * FROM movies ORDER BY release_year DESC';
      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error('Error al obtener las películas: ' + error.message);
    }
  }

  async getSeries() {
    try {
      const query = 'SELECT * FROM series ORDER BY release_year DESC';
      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error('Error al obtener las series: ' + error.message);
    }
  }
}

// Se exporta la clase VideoService para poder utilizarla en otras partes de la aplicación
module.exports = VideoService;
