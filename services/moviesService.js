// services/moviesService.js
const fs = require('fs');
const pool = require('../libs/postgresPool');
const { transcode } = require('../utils/mp4-transcoder');
const crypto = require('crypto');
const { config } = require('../config/config');
const {
  processAndUploadMovieCover,
  generateCoverHash,
} = require('../utils/imageProcessor');
const { deleteFileFromMinIO } = require('../utils/minioHelpers');
const { configureAuditContext } = require('../utils/configureAuditContext');
const { fileExists, deleteTempDir } = require('../utils/fileHelpers');

class MoviesService {
  constructor() {
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));
  }

  async calculateFileHash(filePath) {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);
      stream.on('data', (chunk) => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', (err) => reject(err));
    });
  }

  async checkIfFileExistsInDatabase(fileHash) {
    const query = 'SELECT id FROM videos WHERE file_hash = $1 LIMIT 1';
    const result = await this.pool.query(query, [fileHash]);
    return result.rows.length > 0;
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
  async uploadMovie(movieInfo, onProgress) {
    const client = await this.pool.connect();
    const {
      title,
      description,
      category: categoryId,
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

      await processAndUploadMovieCover(coverImage, title, releaseYear);

      // Transcodifica el video y sube cada calidad a MinIO
      const { availableResolutions, availableSubtitles, duration } =
        await transcode(video, videoFileHash, onProgress);

      // Inserta registro en la tabla videos
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
      const title_hash = generateCoverHash(title, releaseYear);

      // Inserta registro en la tabla movies
      const movieResult = await client.query(
        `INSERT INTO movies (
          title,
          title_hash,
          description,
          category_id,
          video_id,
          release_year
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (title_normalized, release_year) DO NOTHING
        RETURNING id`,
        [title, title_hash, description, categoryId, videoId, releaseYear]
      );
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
      client.release();
    }
  }

  /**
   * Actualiza una película cambiando el título, la portada y el año de lanzamiento.
   * @param {number} movieId - ID de la película a actualizar.
   * @param {Object} updatedData - Datos a actualizar { title, coverImage, releaseYear }.
   * @returns {Object} Registro actualizado.
   */
  async updateMovie(movieId, updatedData) {
    const client = await this.pool.connect();
    const { title, coverImage, releaseYear } = updatedData;
    try {
      await client.query('BEGIN');

      // Verifica que la película exista
      const movieResult = await client.query(
        'SELECT * FROM movies WHERE id = $1',
        [movieId]
      );
      if (movieResult.rowCount === 0) {
        throw new Error('La película no existe');
      }
      const movie = movieResult.rows[0];

      // Obtiene el hash del video asociado para ubicar la portada
      const videoResult = await client.query(
        'SELECT file_hash FROM videos WHERE id = $1',
        [movie.video_id]
      );
      if (videoResult.rowCount === 0) {
        throw new Error('Video asociado no encontrado');
      }

      let updateResult;
      if (coverImage) {
        const coverDirminio = `${config.coversDir}/${movie.title_hash}/cover.jpg`;
        await deleteFileFromMinIO(coverDirminio);
        // Procesa y sube la nueva portada
        await processAndUploadMovieCover(coverImage, title, releaseYear);
        const title_hash = generateCoverHash(title, releaseYear);
        // Actualiza el título y el año de lanzamiento en la tabla movies
        const updateQuery = `UPDATE movies SET title = $1, release_year = $2, title_hash = $3 WHERE id = $4 RETURNING *`;
        updateResult = await client.query(updateQuery, [
          title,
          releaseYear,
          title_hash,
          movieId,
        ]);
      } else {
        // Actualiza el título y el año de lanzamiento en la tabla movies
        const updateQuery = `UPDATE movies SET title = $1, release_year = $2  WHERE id = $3 RETURNING *`;
        updateResult = await client.query(updateQuery, [
          title,
          releaseYear,
          movieId,
        ]);
      }

      await client.query('COMMIT');
      return updateResult.rows[0];
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
   * @param {number} movieId - ID de la película a eliminar.
   * @returns {Object} Confirmación de eliminación.
   */
  async deleteMovie(movieId) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Consulta la película para verificar existencia y obtener el video_id.
      const movieResult = await client.query(
        'SELECT * FROM movies WHERE id = $1',
        [movieId]
      );
      if (movieResult.rowCount === 0) {
        throw new Error('La película no existe');
      }
      const movie = movieResult.rows[0];

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
      await client.query(deleteMovieQuery, [movieId]);

      // Elimina la película de la base de datos.
      const deleteVideoQuery = `DELETE FROM videos WHERE id = $1`;
      await client.query(deleteVideoQuery, [movie.video_id]);

      // Rutas remotas a eliminar en MinIO:
      const remoteCoverPath = `${config.coversDir}/${movie.title_hash}/cover.jpg`;
      // Se asume que available_resolutions es un arreglo de alturas (por ejemplo, [360, 480, 720])
      const remoteVideoPaths = available_resolutions.map(
        (res) => `${config.videoDir}/${file_hash}/_${res}p.mp4`
      );

      // Elimina la portada en MinIO.
      await deleteFileFromMinIO(remoteCoverPath);

      // Elimina cada uno de los archivos de video en MinIO.
      for (const remotePath of remoteVideoPaths) {
        await deleteFileFromMinIO(remotePath);
      }

      await client.query('COMMIT');

      return { message: 'Película eliminada exitosamente', id: movieId };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al eliminar la película:', error.message);
      throw new Error('Error al eliminar la película: ' + error.message);
    } finally {
      client.release();
    }
  }

  /**
   * Busca películas por nombre.
   * @param {string} title - Nombre (o parte del nombre) del video a buscar.
   * @returns {Promise<Array>} Lista de películas que coinciden.
   */
  async searchMovieByName(title) {
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
   * Obtiene todas las películas, incluyendo algunos datos del video asociado.
   * @returns {Promise<Array>} Lista de películas.
   */
  async getMovies() {
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
}

module.exports = MoviesService;
