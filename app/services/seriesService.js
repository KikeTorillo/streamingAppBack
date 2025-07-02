// services/seriesService.js
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

class SeriesService {
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

  async checkIfCoverExistsInDatabase(fileHash) {
    const query = 'SELECT id FROM series WHERE cover_image = $1 LIMIT 1';
    const result = await this.pool.query(query, [fileHash]);
    return result.rows.length > 0;
  }

  /**
   * Obtiene todas las series.
   * @returns {Promise<Array>} Lista de series.
   */
  async find() {
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
   * Obtiene una categoría por su ID.
   * @param {number} id - ID de la categoría a buscar.
   * @returns {Object} Datos de la categoría encontrada.
   * @throws {Error} Error si la categoría no existe.
   */
  async findOne(id) {
    const query = 'SELECT * FROM series WHERE id = $1;';
    const result = await this.pool.query(query, [id]);
    if (!result.rows.length) {
      throw boom.notFound('Serie no encontrada');
    }
    const serie = result.rows[0];
    return serie;
  }

  async checkExistByTitleAndYear(title, releaseYear) {
    const query = `
    SELECT * FROM series 
    WHERE title_normalized = $1
    and release_year = $2;
    `;

    const result = await this.pool.query(query, [
      title.toLowerCase(),
      releaseYear,
    ]);

    return result.rows.length > 0;
  }

  /**
   * Busca series por nombre.
   * @param {string} title - Nombre (o parte del nombre) del video a buscar.
   * @returns {Promise<Array>} - Lista de videos que coinciden con la consulta.
   */
  async findByName(title) {
    try {
      const query = `
          SELECT s.*
          FROM series s
          WHERE title_normalized LIKE $1
        `;

      const params = [`%${title.toLowerCase()}%`];
      const result = await this.pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error al buscar serie por nombre:', error.message);
      throw new Error('Error al buscar serie por nombre: ' + error.message);
    }
  }

  /**
   * Sube una serie:
   * - Verifica existencia de archivos (video y portada).
   * - Procesa la portada y la sube a MinIO.
   * - Transcodifica el video en varias calidades y sube cada resultado.
   * - Inserta registros en las tablas series.
   * @param {Object} serieInfo - Información de la serie.
   * @param {function} onProgress - Callback para el progreso de transcodificación.
   * @returns {Object} Mensaje de éxito.
   */
  async create(serieInfo) {
    const client = await this.pool.connect();
    const {
      title,
      description,
      categoryId,
      releaseYear,
      coverImage,
      user,
      ip,
    } = serieInfo;

    const coverFileHash = await this.calculateFileHash(coverImage);
    try {
      if (!(await fileExists(coverImage))) {
        throw new Error('Imagen de portada no encontrada');
      }

      if (await this.checkIfCoverExistsInDatabase(coverFileHash)) {
        throw new Error(
          'Contenido duplicado. Hash de portada ya existe en la BD'
        );
      }

      if (await this.checkExistByTitleAndYear(title, releaseYear)) {
        throw new Error(
          'La serie ya existe. Nombre y anio de lanzamiento ya existen en la BD.'
        );
      }

      await configureAuditContext(client, user.id, ip);

      await client.query('BEGIN');

      await processAndUploadCover(coverImage, coverFileHash);

      // Insertar la serie en la tabla "series"
      const seriesResult = await client.query(
        `INSERT INTO series (
          title,
          cover_image,
          description,
          category_id,
          release_year
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING id`,
        [title, coverFileHash, description, categoryId, releaseYear]
      );

      if (seriesResult.rowCount === 0) {
        throw new Error('La serie ya existe. Operación abortada.');
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
      //await deleteTempDir(localDir);
      await client.release();
    }
  }

  /**
   * Actualiza una serie cambiando el título, la portada y el año de lanzamiento.
   * @param {number} id - ID de la serie a actualizar.
   * @param {Object} changes - Datos a actualizar { title, coverImage, releaseYear }.
   * @returns {Object} Registro actualizado.
   */
  async update(id, changes) {
    const client = await this.pool.connect();
    const { title, releaseYear, coverImage } = changes;

    try {
      await client.query('BEGIN');

      if (await this.checkExistByTitleAndYear(title, releaseYear)) {
        throw new Error(
          'La serie ya existe. Nombre y anio de lanzamiento ya existen en la BD.'
        );
      }

      const serie = await this.findOne(id);

      if (coverImage) {
        const coverFileHash = await this.calculateFileHash(coverImage);

        if (await this.checkIfCoverExistsInDatabase(coverFileHash)) {
          throw new Error(
            'Contenido duplicado. Hash de portada ya existe en la BD'
          );
        }

        const remoteCoverPath = `${config.coversDir}/${serie.cover_image}`;
        await deleteFilesByPrefix(remoteCoverPath);

        // Procesa y sube la nueva portada
        await processAndUploadCover(changes.coverImage, coverFileHash);
        await deleteTempDir(changes.coverImage);
        changes.coverImage = coverFileHash;
      }

      const result = await updateTable(client, 'series', serie.id, changes);

      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al actualizar la serie:', error.message);
      throw new Error('Error al actualizar la serie: ' + error.message);
    } finally {
      client.release();
    }
  }

  /**
 * 🗑️ Elimina una serie y todos sus episodios relacionados
 * ✅ VERSIÓN SIMPLIFICADA - PostgreSQL + Triggers manejan todo automáticamente
 * @param {number} id - ID de la serie a eliminar
 * @returns {Object} Confirmación de eliminación con estadísticas
 */
  async delete(id) {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');
      console.log(`🎬 Eliminando serie ID: ${id}`);

      // ✅ PASO 1: Obtener información ANTES de eliminar (para MinIO y estadísticas)
      const serieInfoQuery = `
      SELECT 
        s.id, 
        s.title, 
        s.cover_image,
        COUNT(ep.id) as total_episodes,
        array_agg(DISTINCT vi.file_hash) FILTER (WHERE vi.file_hash IS NOT NULL) as video_hashes
      FROM series s
      LEFT JOIN episodes ep ON s.id = ep.serie_id
      LEFT JOIN videos vi ON ep.video_id = vi.id
      WHERE s.id = $1
      GROUP BY s.id, s.title, s.cover_image;
    `;

      const infoResult = await client.query(serieInfoQuery, [id]);

      if (infoResult.rowCount === 0) {
        throw new Error(`Serie con ID ${id} no encontrada`);
      }

      const serieInfo = infoResult.rows[0];
      const videoHashes = serieInfo.video_hashes && serieInfo.video_hashes[0] !== null ? serieInfo.video_hashes : [];

      console.log(`📺 Serie: "${serieInfo.title}" con ${serieInfo.total_episodes} episodios`);

      // ✅ PASO 2: Eliminar archivos de MinIO (lo único que no puede hacer PostgreSQL)
      if (videoHashes.length > 0) {
        console.log(`☁️ Eliminando ${videoHashes.length} archivos de video de MinIO...`);

        for (const hash of videoHashes) {
          if (hash) {
            const remotePath = `${config.videoDir}/${hash}`;
            try {
              await deleteFilesByPrefix(remotePath);
              console.log(`✅ Video eliminado de MinIO: ${hash}`);
            } catch (error) {
              console.warn(`⚠️ Error eliminando video ${hash}:`, error.message);
              // Continuar con otros archivos aunque uno falle
            }
          }
        }
      }

      // Eliminar portada de MinIO
      if (serieInfo.cover_image) {
        const remoteCoverPath = `${config.coversDir}/${serieInfo.cover_image}`;
        try {
          await deleteFilesByPrefix(remoteCoverPath);
          console.log(`✅ Portada eliminada de MinIO: ${serieInfo.cover_image}`);
        } catch (error) {
          console.warn(`⚠️ Error eliminando portada:`, error.message);
        }
      }

      // ✅ PASO 3: ⚡ LA MAGIA - Una consulta elimina TODO automáticamente
      console.log(`🗑️ Eliminando serie de la base de datos...`);
      const deleteResult = await client.query('DELETE FROM series WHERE id = $1', [id]);

      if (deleteResult.rowCount === 0) {
        throw new Error('No se pudo eliminar la serie');
      }

      // 🎉 En este punto PostgreSQL ya eliminó automáticamente:
      // - ✅ La serie (obviamente)
      // - ✅ Todos los episodios (por CASCADE: serie_id REFERENCES series(id) ON DELETE CASCADE)
      // - ✅ Todos los videos (por TRIGGER: auto_delete_video_on_episode_delete)

      await client.query('COMMIT');

      const result = {
        message: 'Serie eliminada exitosamente',
        serieId: id,
        serieTitle: serieInfo.title,
        statistics: {
          episodesDeleted: parseInt(serieInfo.total_episodes) || 0,
          videosDeleted: videoHashes.length,
          coverDeleted: !!serieInfo.cover_image
        },
        automaticDeletion: {
          episodesCascade: true,
          videosTrigger: true,
          minioFiles: true
        }
      };

      console.log(`🎉 Eliminación completada automáticamente:`, result);
      return result;

    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`❌ Error al eliminar serie ${id}:`, error.message);
      throw new Error(`Error al eliminar la serie: ${error.message}`);
    } finally {
      client.release();
    }
  }

  /**
   * Obtiene todas las series.
   * @returns {Promise<Array>} Lista de series.
   */
  async findEpisode(serieId, season, episodeNumber) {
    try {
      await this.findOne(serieId);

      let query;
      const arrayValues = [];
      arrayValues.push(serieId);
      if (season && episodeNumber) {
        query = `
        SELECT ep.*
        FROM episodes ep
        where serie_id = $1 and season = $2 and episode_number = $3;
      `;
        arrayValues.push(season);
        arrayValues.push(episodeNumber);
      } else if (season) {
        query = `
        SELECT ep.*
        FROM episodes ep
        where serie_id = $1 and season = $2;
      `;
        arrayValues.push(season);
      } else {
        query = `
        SELECT ep.*
        FROM episodes ep
        where serie_id = $1;
      `;
      }

      const result = await this.pool.query(query, arrayValues);
      return result.rows;
    } catch (error) {
      throw new Error('Error al obtener los episodios: ' + error.message);
    }
  }

  /**
   * Obtiene una categoría por su ID.
   * @param {number} serieId - ID de la categoría a buscar.
   * @param {number} season - ID de la categoría a buscar.
   * @param {number} episodeNumber - ID de la categoría a buscar.
   * @returns {Object} Datos de la categoría encontrada.
   * @throws {Error} Error si la categoría no existe.
   */
  async findOneEpisode(id) {
    const query = `
      SELECT * FROM episodes 
      WHERE id = $1;
      `;
    const result = await this.pool.query(query, [id]);
    const episode = result.rows;
    return episode;
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
  async createEpisode(episodeInfo, onProgress) {
    const client = await this.pool.connect();
    const {
      serieId,
      season,
      episodeNumber,
      title,
      description,
      video,
      user,
      ip,
    } = episodeInfo;

    try {
      if (!(await fileExists(video))) {
        throw new Error('Archivo de video no encontrado');
      }

      // Calcular el hash del video para identificarlo de forma única
      const videoFileHash = await this.calculateFileHash(video);

      if (await this.checkIfFileExistsInDatabase(videoFileHash)) {
        throw new Error(
          'Contenido duplicado. Hash de video ya existe en la BD'
        );
      }

      configureAuditContext(client, user.id, ip);

      await this.findOne(serieId);

      const episode = await this.findEpisode(serieId, season, episodeNumber);

      if (episode.length > 0) {
        throw new Error(
          `El episodio para la serie ${serieId}, temporada ${season} y episodio ${episodeNumber} ya existe.`
        );
      }

      await client.query('BEGIN');

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

      const insertEpisodeQuery = `
      INSERT INTO episodes (
        serie_id,
        season,
        episode_number,
        title,
        description,
        video_id
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id`;

      // Insertar el registro del episodio en la tabla "episodes"
      const episodeResult = await client.query(insertEpisodeQuery, [
        serieId,
        season,
        episodeNumber,
        title,
        description,
        videoId,
      ]);

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
      await client.release();
    }
  }

  /**
   * Actualiza una película cambiando el título, la portada y el año de lanzamiento.
   * @param {number} id - ID de la película a actualizar.
   * @param {Object} changes - Datos a actualizar { title, coverImage, releaseYear }.
   * @returns {Object} Registro actualizado.
   */
  async updateEpisode(id, changes) {
    const client = await this.pool.connect();

    const { serieId, season, episodeNumber } = changes;

    try {
      await client.query('BEGIN');

      const episode = await this.findOneEpisode(id);

      if (episode.length === 0) {
        throw new Error(`El episodio con ${id} no existe.`);
      }

      let newSerie;
      if (serieId) {
        const serie = await this.findOne(changes.serieId);
        newSerie = serie.id;
      } else {
        newSerie = episode[0].serie_id;
      }

      let newSeason;
      if (season) {
        newSeason = season;
      } else {
        newSeason = episode[0].season;
      }

      let newEpisodeNumber;
      if (episodeNumber) {
        newEpisodeNumber = episodeNumber;
      } else {
        newEpisodeNumber = episode[0].episode_number;
      }

      const episodeWithSameDataExist = await this.findEpisode(
        newSerie,
        newSeason,
        newEpisodeNumber
      );

      if (
        episodeWithSameDataExist.length > 0 &&
        episodeWithSameDataExist[0].id !== episode[0].id
      ) {
        throw new Error(
          `El episodio para la serie ${newSerie}, temporada ${newSeason} y episodio ${newEpisodeNumber} ya existe.`
        );
      }

      const result = await updateTable(
        client,
        'episodes',
        episode[0].id,
        changes
      );
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al actualizar el episodio:', error.message);
      throw new Error('Error al actualizar el episodio: ' + error.message);
    } finally {
      client.release();
    }
  }

  /**
   * Elimina una película por su ID y remueve los archivos asociados en MinIO.
   * @param {number} id - ID de la película a eliminar.
   * @returns {Object} Confirmación de eliminación.
   */
  async deleteEpisode(id) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const episode = await this.findOneEpisode(id);

      if (episode.length === 0) {
        throw boom.notFound('Episodio no encontrado');
      }

      // Consulta la tabla de videos para obtener el file_hash y las resoluciones disponibles.
      const videoResult = await client.query(
        'SELECT file_hash, available_resolutions FROM videos WHERE id = $1',
        [episode[0].video_id]
      );
      if (videoResult.rowCount === 0) {
        throw new Error('Video asociado no encontrado');
      }

      const { file_hash, available_resolutions } = videoResult.rows[0];

      // Elimina la película de la base de datos.
      const deleteEpisodeQuery = `DELETE FROM episodes WHERE id = $1`;
      await client.query(deleteEpisodeQuery, [episode[0].id]);

      // Elimina la película de la base de datos.
      const deleteVideoQuery = `DELETE FROM videos WHERE id = $1`;
      await client.query(deleteVideoQuery, [episode[0].id]);

      // Rutas remotas a eliminar en MinIO:
      const remoteVideoPaths = `${config.videoDir}/${file_hash}`;

      await deleteFilesByPrefix(remoteVideoPaths);

      await client.query('COMMIT');

      return { message: 'Episodio eliminado exitosamente', id };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al eliminar la película:', error.message);
      throw new Error('Error al eliminar la película: ' + error.message);
    } finally {
      client.release();
    }
  }
}

module.exports = SeriesService;
