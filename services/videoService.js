// VideoService.js

// Importamos los módulos necesarios para el manejo de archivos, rutas y operaciones en PostgreSQL
const fs = require('fs'); // Para interactuar con el sistema de archivos
const path = require('path'); // Para manejar rutas de archivos
const pool = require('../libs/postgresPool'); // Pool de conexiones a PostgreSQL
const { transcode } = require('../utils/mp4-transcoder'); // Función para transcodificar videos
const { getUrl } = require('../utils/vod-unique-url'); // Función para generar URLs únicas
const { getPresignedUrl } = require('../utils/getPresignedUrl'); // Función para generar URLs prefirmadas
const crypto = require('crypto'); // Para calcular hashes de archivos
const { uploadToMinIO } = require('../utils/aws'); // Función para subir archivos a MinIO
const ffmpeg = require('fluent-ffmpeg'); // Librería para obtener metadatos del video mediante ffprobe

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

  formatSubtitles(subtitles, videoHash) {
    return subtitles.map((sub) => {
      const [type, lang] = sub.replace('.vtt', '').split('-');
      return {
        language: lang || type,
        kind: type === 'forced' ? 'forced' : 'standard',
        url: `${videoHash}/subtitles/${sub}`,
        default: false,
      };
    });
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
      // Validación extrema de parámetros
      const requiredFields = [
        'name',
        'category',
        'contentType',
        'releaseYear',
        'videoFilePath',
        'coverImagePath',
      ];

      // Desestructuramos la información necesaria del objeto fileInfo
      const {
        name,
        category: categoryId,
        contentType,
        season,
        episodeNumber,
        releaseYear,
        description = '',
      } = fileInfo.body;

      const { videoFilePath, coverImagePath, user = {}, ip = '' } = fileInfo;

      // Validación específica para series
      if (contentType === 'series') {
        if (!season || !episodeNumber) {
          throw new Error(
            'Para series se requiere: temporada y número de episodio'
          );
        }

        if (season < 1) {
          throw new Error('Temporada debe ser un número entero positivo');
        }

        if (episodeNumber < 1) {
          throw new Error('Número de episodio debe ser un entero positivo');
        }
      }

      // Validación de año
      const currentYear = new Date().getFullYear();
      const parsedYear = parseInt(releaseYear, 10);
      if (isNaN(parsedYear)) throw new Error('Año debe ser un número');
      if (parsedYear < 1900 || parsedYear > currentYear) {
        throw new Error(`Año inválido. Rango permitido: 1900-${currentYear}`);
      }

      // Verificamos que los archivos de video y portada existan en el sistema
      if (!fs.existsSync(videoFilePath))
        throw new Error('Archivo de video no encontrado');
      if (!fs.existsSync(coverImagePath))
        throw new Error('Imagen de portada no encontrada');

      // Se calcula el hash del archivo de video para identificarlo de forma única
      const videoFileHash = await this.calculateFileHash(videoFilePath);
      if (await this.checkIfFileExistsInDatabase(videoFileHash)) {
        [videoFilePath, coverImagePath].forEach(
          (f) => fs.existsSync(f) && fs.unlinkSync(f)
        );
        throw new Error('Contenido duplicado Hash de video ya existe en la BD');
      }

      const userId = user.id ? user.id.toString() : 'anonymous';
      const clientIp = ip || 'unknown';

      await client.query(
        `SELECT 
        set_config('app.current_user_id', $1, false),
        set_config('app.client_ip', $2, false)`,
        [userId, clientIp]
      );

      // Verificación (opcional)
      const { rows } = await client.query(`SELECT 
        current_setting('app.current_user_id') AS user_id,
        current_setting('app.client_ip') AS ip`);

      console.log('Auditoría configurada:', rows[0]);

      // Se obtienen los metadatos del video utilizando ffprobe (vía ffmpeg)
      const videoMetadata = await new Promise((resolve, reject) => {
        ffmpeg.ffprobe(videoFilePath, (err, data) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        });
      });

      // Se extrae el stream de video principal para obtener dimensiones y duración
      const primaryVideoStream = videoMetadata.streams.find(
        (s) => s.codec_type === 'video'
      );
      if (!primaryVideoStream) {
        throw new Error('No se encontró stream de video en el archivo.');
      }
      const originalWidth = primaryVideoStream.width;
      const originalHeight = primaryVideoStream.height;

      // Definición de calidades base según altura (en píxeles)
      const baseQualities = [
        { h: 480 },
        { h: 720 },
        { h: 1080 },
        { h: 1440 },
        { h: 2160 },
      ];
      // Se calcula la relación de aspecto original
      const aspectRatio = originalWidth / originalHeight;

      // Se generan las resoluciones basadas en la altura y relación de aspecto
      const qualities = baseQualities.map((q) => {
        // Calcula el ancho proporcional
        let newWidth = Math.round(q.h * aspectRatio);
        // Ajusta el ancho para que sea par (requisito de algunos codecs)
        newWidth = newWidth % 2 === 0 ? newWidth : newWidth + 1;
        return { quality: `${q.h}p`, width: newWidth, height: q.h };
      });

      // Se determina la cantidad máxima de calidades a generar en función de la altura original
      let maxQuality;
      if (originalHeight >= 2160) {
        maxQuality = 5;
      } else if (originalHeight >= 1440) {
        maxQuality = 4;
      } else if (originalHeight >= 1080) {
        maxQuality = 3;
      } else if (originalHeight >= 720) {
        maxQuality = 2;
      } else {
        maxQuality = 1;
      }

      // Se seleccionan las calidades definidas
      const selectedQualities = qualities.slice(0, maxQuality);
      // Se ajusta la última calidad para que use la resolución original del video
      selectedQualities[maxQuality - 1] = {
        quality: `${originalHeight}p`,
        width: originalWidth,
        height: originalHeight,
      };

      // Se arma un array solo con las alturas disponibles para las resoluciones
      const availableResolutions = selectedQualities.map((q) => q.height);
      console.log('Resoluciones disponibles:', availableResolutions);

      // Se extraen los streams de subtítulos (no forzados) del metadata del video
      const subtitleStreams = videoMetadata.streams.filter(
        (s) => s.codec_type === 'subtitle'
      );
      // Arrays y objetos para manejar la nomenclatura de los archivos de subtítulos
      const availableSubtitles = [];
      const forcedLangCount = {}; // Contador para pistas forzadas por idioma
      const normalLangCount = {}; // Contador para pistas no forzadas por idioma

      // Se procesa cada stream de subtítulo para generar nombres de archivo únicos
      subtitleStreams.forEach((stream) => {
        // Se obtiene el lenguaje, o se asigna 'und' (indefinido) si no existe
        const language = (stream.tags && stream.tags.language) || 'und';
        // Se verifica si el subtítulo está marcado como forzado
        const isForced = stream.disposition && stream.disposition.forced === 1;
        let fileNameSubtitle;
        let fileNameWithOutExtension;
        if (isForced) {
          // Incrementa el contador para pistas forzadas de ese idioma
          forcedLangCount[language] = (forcedLangCount[language] || 0) + 1;
          // Si hay más de una pista forzada, se añade un sufijo numérico
          fileNameSubtitle =
            forcedLangCount[language] > 1
              ? `forced-${language}_${forcedLangCount[language]}.vtt`
              : `forced-${language}.vtt`;
          fileNameWithOutExtension = fileNameSubtitle.replace('.vtt', '');
          availableSubtitles.push(fileNameWithOutExtension);
        } else {
          // Incrementa el contador para pistas no forzadas de ese idioma
          normalLangCount[language] = (normalLangCount[language] || 0) + 1;
          // Se asigna el nombre según si es la primera pista o hay varias
          fileNameSubtitle =
            normalLangCount[language] > 1
              ? `${language}_${normalLangCount[language]}.vtt`
              : `${language}.vtt`;
          fileNameWithOutExtension = fileNameSubtitle.replace('.vtt', '');
          availableSubtitles.push(fileNameWithOutExtension);
        }
      });
      console.log('Subtítulos disponibles:', availableSubtitles);

      // Se inicia una transacción para asegurar la integridad de las operaciones en la base de datos
      await client.query('BEGIN');

      // Se sube la imagen de portada a MinIO, construyendo la ruta remota usando el hash del video
      const coverImageRemotePath = `vod/${videoFileHash}/cover.jpg`;
      await uploadToMinIO(coverImagePath, coverImageRemotePath);
      console.log(`Imagen de portada subida a MinIO: ${coverImageRemotePath}`);

      // Se inserta un registro en la tabla videos con la información obtenida, retornando solo el id para reducir datos transferidos
      const duration = primaryVideoStream.duration; // Duración extraída del stream de video
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
          [name, description, categoryId, videoId, parsedYear]
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
          [name, description, categoryId, parsedYear]
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
      // Se inicia el proceso de transcodificación del video, el cual genera las distintas resoluciones y extrae subtítulos
      console.log(`Transcodificando el archivo: ${videoFilePath}`);
      const minioFolder = `${videoFileHash}`; // Carpeta en MinIO basada en el hash del video
      await transcode(videoFilePath, videoFileHash, onProgress);

      // Se confirma la transacción, asegurando que todas las operaciones anteriores se hayan ejecutado correctamente
      await client.query('COMMIT');

      // Se eliminan los archivos originales para liberar espacio en el servidor
      console.log(`Eliminando el archivo original de video: ${videoFilePath}`);
      fs.unlinkSync(videoFilePath);
      console.log(
        `Eliminando el archivo original de portada: ${coverImagePath}`
      );
      fs.unlinkSync(coverImagePath);

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
