// services/seriesService.js
const fs = require('fs');
const pool = require('../libs/postgresPool');
const { transcode } = require('../utils/mp4-transcoder');
const crypto = require('crypto');
const { processCoverImage } = require('../utils/imageProcessor');
const { uploadFileIfNotExists } = require('../utils/minioHelpers');
const { configureAuditContext } = require('../utils/configureAuditContext');
const { createTempDir, fileExists, deleteTempDir } = require('../utils/fileHelpers');

class SeriesService {
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
   * Obtiene la lista de series (con información representativa).
   */
  async getSeries() {
    try {
      const query = `
        SELECT se.*
        FROM series se
        ORDER BY se.release_year DESC
      `;
      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error('Error al obtener las series: ' + error.message);
    }
  }

  /**
   * Busca videos por nombre, filtrando según el tipo de contenido.
   * Para películas se busca en la tabla "movies" y para series en la tabla "series".
   * @param {string} name - Nombre (o parte del nombre) del video a buscar.
   * @returns {Promise<Array>} - Lista de videos que coinciden con la consulta.
   */
  async searchSerieByName(name) {
    try {
      let query = `
          SELECT s.*
          FROM series s
          WHERE title_normalized LIKE $1
        `;

      const params = [`%${name.toLowerCase()}%`];
      const result = await this.pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error al buscar serie por nombre:', error.message);
      throw new Error('Error al buscar serie por nombre: ' + error.message);
    }
  }

  /**
   * Crea una serie (sin video) y sube la portada general.
   * seriesInfo debe incluir: name, description, category, releaseYear,
   * coverImagePath, user y ip.
   */
  async createSeries(seriesInfo) {
    const client = await this.pool.connect();
    const { name, description, category, releaseYear, coverImage, user, ip } =
      seriesInfo;
    // Generar identificador único para la serie y crear directorio temporal
    const seriesIdentifier = crypto.randomBytes(16).toString('hex');
    const localDir = `vod/${seriesIdentifier}`;
    try {
      if (!(await fileExists(coverImage))) {
        throw new Error('Imagen de portada no encontrada');
      }

      await configureAuditContext(client, user.id, ip);
      await client.query('BEGIN');

      await createTempDir(localDir);

      // Procesar y subir la portada a MinIO
      const processedCoverPath = `${localDir}/cover.jpg`;
      try {
        await processCoverImage(coverImage, processedCoverPath, {
          width: 640,
          height: 360,
          format: 'jpeg',
          quality: 80,
        });
        const remoteCoverPath = `vod/${seriesIdentifier}/cover.jpg`;
        await uploadFileIfNotExists(processedCoverPath, remoteCoverPath);
      } catch (err) {
        throw new Error(
          'Error en el procesamiento de la imagen de portada: ' + err
        );
      }

      // Insertar la serie en la tabla "series"
      const seriesResult = await client.query(
        `INSERT INTO series (
          title,
          description,
          category_id,
          release_year
        ) VALUES ($1, $2, $3, $4)
        RETURNING id`,
        [name, description, category, releaseYear]
      );
      if (seriesResult.rows.length === 0) {
        throw new Error('No se pudo crear la serie');
      }

      await client.query('COMMIT');
      return {
        serieId: seriesResult.rows[0].id,
        message: 'Serie creada exitosamente',
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al crear la serie:', error.message);
      throw new Error('Error al crear la serie: ' + error.message);
    } finally {
      await deleteTempDir(coverImage);
      await deleteTempDir(localDir);
      await client.release();
    }
  }

  /**
   * Flujo para subir un episodio a una serie existente.
   * Procesa el video (transcodificación, etc.) e inserta registros en las tablas "videos" y "episodes".
   *
   * @param {Object} episodeInfo - Objeto con la información del episodio.
   *   Debe incluir: serieId, name (título del episodio), season, episodeNumber, video, user, ip.
   * @param {function} onProgress - Callback para actualizar el progreso de transcodificación.
   * @returns {Promise<Object>} - Objeto con mensaje de éxito.
   */
  async uploadEpisode(episodeInfo, onProgress) {
    const client = await this.pool.connect();
    const { serieId, season, episodeNumber, video, user, ip } = episodeInfo;
    // Calcular el hash del video para identificarlo de forma única
    const videoFileHash = await this.calculateFileHash(video);
    // Crear directorio temporal para el procesamiento del video
    const localDir = `vod/${videoFileHash}`;
    try {
      // Validar que la serie exista
      const seriesCheckQuery = 'SELECT id FROM series WHERE id = $1';
      const seriesResult = await client.query(seriesCheckQuery, [serieId]);
      if (seriesResult.rowCount === 0) {
        throw new Error(`La serie con id ${serieId} no existe.`);
      }

      // Validar que exista el archivo de video
      if (!(await fileExists(video))) {
        throw new Error('Archivo de video no encontrado');
      }

      if (await this.checkIfFileExistsInDatabase(videoFileHash)) {
        throw new Error(
          'Contenido duplicado. Hash de video ya existe en la BD'
        );
      }

      // Configurar contexto de auditoría
      configureAuditContext(client, user.id, ip);
      await client.query('BEGIN');

      await createTempDir(localDir);

      // Transcodificar el video para generar resoluciones y subtítulos
      const { availableResolutions, availableSubtitles, duration } =
        await transcode(video, videoFileHash, onProgress);

      // Insertar el registro del video en la tabla "videos"
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

      // Validar que no exista ya un episodio con la misma serie, temporada y número de episodio
      const episodeCheckQuery = `
      SELECT id FROM episodes
      WHERE series_id = $1 AND season = $2 AND episode_number = $3
    `;
      const episodeCheckResult = await client.query(episodeCheckQuery, [
        serieId,
        season,
        episodeNumber,
      ]);
      if (episodeCheckResult.rowCount > 0) {
        throw new Error(
          `El episodio para la serie ${serieId}, temporada ${season} y episodio ${episodeNumber} ya existe.`
        );
      }

      // Insertar el registro del episodio en la tabla "episodes"
      const episodeResult = await client.query(
        `INSERT INTO episodes (
        series_id,
        season,
        episode_number,
        video_id
      ) VALUES ($1, $2, $3, $4)
      RETURNING id`,
        [serieId, season, episodeNumber, videoId]
      );
      if (episodeResult.rowCount === 0) {
        throw new Error(
          'El episodio no pudo ser insertado. Operación abortada.'
        );
      }

      await client.query('COMMIT');

      return { message: 'Episodio subido y procesado exitosamente' };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al subir el episodio:', error.message);
      throw new Error('Error al subir el episodio: ' + error.message);
    } finally {
      await deleteTempDir(video);
      await deleteTempDir(localDir);
      await client.release();
    }
  }
}

module.exports = SeriesService;
