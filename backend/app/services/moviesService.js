// services/moviesService.js
const fs = require('fs');
const pool = require('../libs/postgresPool');
const boom = require('@hapi/boom'); // Biblioteca para manejo de errores HTTP estructurados
const { updateTable } = require('../utils/sql/updateAbtraction'); // Función genérica para actualización de tablas
const { transcode } = require('../utils/mp4-transcoder');
const crypto = require('crypto');
const { config } = require('../config/config');
const { processAndUploadCover } = require('../utils/imageProcessor');
const { deleteFilesByPrefix } = require('../utils/aws');
const { configureAuditContext } = require('../utils/configureAuditContext');
const { fileExists, deleteTempDir } = require('../utils/fileHelpers');

class MoviesService {
  constructor() {
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));
  }

  async calculateFileHash(filePath) {
    try {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);

      for await (const chunk of stream) {
        hash.update(chunk);
      }

      return hash.digest('hex');
    } catch (error) {
      throw new Error(
        `Error al calcular el hash del archivo: ${error.message}`
      );
    }
  }

  async checkIfFileExistsInDatabase(fileHash) {
    const query = 'SELECT id FROM videos WHERE file_hash = $1 LIMIT 1';
    const result = await this.pool.query(query, [fileHash]);
    return result.rows.length > 0;
  }

  /**
   * Obtiene todas las películas, incluyendo algunos datos del video asociado.
   * @returns {Promise<Array>} Lista de películas.
   */
  async find() {
    try {
      const query = `
        SELECT vi.file_hash, vi.available_resolutions, m.*
        FROM movies m
        LEFT JOIN videos vi ON vi.id = m.video_id
        ORDER BY m.release_year DESC
      `;
      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error('Error al obtener las películas: ' + error.message);
    }
  }

  /**
   * Obtiene una categoría por su ID.
   * @param {number} id - ID de la categoría a buscar.
   * @returns {Object} Datos de la categoría encontrada.
   * @throws {Error} Error si la categoría no existe.
   */
  async findOne(id) {
    const query = 'SELECT * FROM movies WHERE id = $1;';
    const result = await this.pool.query(query, [id]);
    if (!result.rows.length) {
      throw boom.notFound('Pelicula no encontrada');
    }
    const movie = result.rows[0];
    return movie;
  }

  /**
   * Busca películas por nombre.
   * @param {string} title - Nombre (o parte del nombre) del video a buscar.
   * @returns {Promise<Array>} Lista de películas que coinciden.
   */
  async findByName(title) {
    try {
      const query = `
        SELECT m.*
        FROM movies m
        WHERE title_normalized LIKE $1
      `;
      const params = [`%${title.toLowerCase()}%`];
      const result = await this.pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error al buscar película por nombre:', error.message);
      throw new Error('Error al buscar película por nombre: ' + error.message);
    }
  }

  /**
   * Sube una película:
   * - Verifica existencia de archivos (video y portada).
   * - Procesa la portada y la sube a MinIO.
   * - Transcodifica el video en varias calidades y sube cada resultado.
   * - Inserta registros en las tablas videos y movies.
   * @param {Object} movieInfo - Información de la película.
   * @param {function} onProgress - Callback para el progreso de transcodificación.
   * @returns {Object} Mensaje de éxito.
   */
  async create(movieInfo, onProgress) {
    const client = await this.pool.connect();
    const {
      title,
      description,
      categoryId,
      releaseYear,
      video,
      coverImage,
      user,
      ip,
    } = movieInfo;

    const videoFileHash = await this.calculateFileHash(video);

    try {
      if (!(await fileExists(video))) {
        throw new Error('Archivo de video no encontrado');
      }
      if (!(await fileExists(coverImage))) {
        throw new Error('Imagen de portada no encontrada');
      }
      if (await this.checkIfFileExistsInDatabase(videoFileHash)) {
        throw new Error(
          'Contenido duplicado. Hash de video ya existe en la BD'
        );
      }
      configureAuditContext(client, user.id, ip);

      await client.query('BEGIN');

      const coverFileHash = await this.calculateFileHash(coverImage);

      await processAndUploadCover(coverImage, coverFileHash);

      // Transcodifica el video y sube cada calidad a MinIO
      const { availableResolutions, availableSubtitles, duration } =
        await transcode(video, videoFileHash, onProgress);

      // Inserta registro en la tabla videos
      const insertQuery = `
        INSERT INTO videos (
          file_hash,
          available_resolutions,
          available_subtitles,
          duration
        ) VALUES ($1, $2, $3, $4)
        RETURNING id
      `;
      const videoResult = await client.query(insertQuery, [
        videoFileHash,
        JSON.stringify(availableResolutions),
        JSON.stringify(availableSubtitles),
        duration,
      ]);

      if (videoResult.rows.length === 0) {
        throw new Error('No se pudo insertar el video.');
      }

      const videoId = videoResult.rows[0].id;

      const insertQueryMovie = `
      INSERT INTO movies (
        title,
        cover_image,
        description,
        category_id,
        video_id,
        release_year
      ) VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (title_normalized, release_year) DO NOTHING
      RETURNING id
      `;

      // Inserta registro en la tabla movies
      const movieResult = await client.query(insertQueryMovie, [
        title,
        coverFileHash,
        description,
        categoryId,
        videoId,
        releaseYear,
      ]);

      if (movieResult.rowCount === 0) {
        throw new Error('La película ya existe. Operación abortada.');
      }

      await client.query('COMMIT');
      return { message: 'Película subida y procesada exitosamente' };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al subir la película:', error.message);
      throw new Error('Error al subir la película: ' + error.message);
    } finally {
      await deleteTempDir(video);
      await deleteTempDir(coverImage);
      if (movieInfo.isTemporaryCoverImage && coverImage) {
        try {
          const { cleanupTempFile } = require('../utils/imageDownloader');
          cleanupTempFile(coverImage);
        } catch (error) {
          console.error('⚠️ Error limpiando imagen temporal:', error);
        }
      }
      client.release();
    }
  }

  /**
   * Actualiza una película cambiando el título, la portada y el año de lanzamiento.
   * @param {number} id - ID de la película a actualizar.
   * @param {Object} changes - Datos a actualizar { title, coverImage, releaseYear }.
   * @returns {Object} Registro actualizado.
   */
  async update(id, changes) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const movie = await this.findOne(id);

      if (changes.coverImage) {
        const coverFileHash = await this.calculateFileHash(changes.coverImage);
        //const coverDirminio = `${config.coversDir}/${movie.cover_image}/cover.jpg`;
        //await deleteFileFromMinIO(coverDirminio);
        const remoteCoverPath = `${config.coversDir}/${movie.cover_image}`;
        await deleteFilesByPrefix(remoteCoverPath);

        // Procesa y sube la nueva portada
        await processAndUploadCover(changes.coverImage, coverFileHash);
        await deleteTempDir(changes.coverImage);
        changes.coverImage = coverFileHash;
      }

      const result = await updateTable(client, 'movies', movie.id, changes);

      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al actualizar la película:', error.message);
      throw new Error('Error al actualizar la película: ' + error.message);
    } finally {
      client.release();
    }
  }

  /**
   * Elimina una película por su ID y remueve los archivos asociados en MinIO.
   * @param {number} id - ID de la película a eliminar.
   * @returns {Object} Confirmación de eliminación.
   */
  async delete(id) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const movie = await this.findOne(id);

      // Consulta la tabla de videos para obtener el file_hash y las resoluciones disponibles.
      const videoResult = await client.query(
        'SELECT file_hash, available_resolutions FROM videos WHERE id = $1',
        [movie.video_id]
      );
      if (videoResult.rowCount === 0) {
        throw new Error('Video asociado no encontrado');
      }
      const { file_hash, available_resolutions } = videoResult.rows[0];

      // Elimina la película de la base de datos.
      const deleteMovieQuery = `DELETE FROM movies WHERE id = $1`;
      await client.query(deleteMovieQuery, [id]);

      // Elimina la película de la base de datos.
      const deleteVideoQuery = `DELETE FROM videos WHERE id = $1`;
      await client.query(deleteVideoQuery, [movie.video_id]);

      // Rutas remotas a eliminar en MinIO:
      const remoteCoverPath = `${config.coversDir}/${movie.cover_image}`;
      // Se asume que available_resolutions es un arreglo de alturas (por ejemplo, [360, 480, 720])
      const remoteVideoPaths = `${config.videoDir}/${file_hash}`;

      await deleteFilesByPrefix(remoteCoverPath);
      await deleteFilesByPrefix(remoteVideoPaths);

      // Elimina la portada en MinIO.
      //await deleteFileFromMinIO(remoteCoverPath);

      // Elimina cada uno de los archivos de video en MinIO.
      //for (const remotePath of remoteVideoPaths) {
      //  await deleteFileFromMinIO(remotePath);
      //}

      await client.query('COMMIT');

      return { message: 'Película eliminada exitosamente', id };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al eliminar la película:', error.message);
      throw new Error('Error al eliminar la película: ' + error.message);
    } finally {
      client.release();
    }
  }
}

module.exports = MoviesService;
