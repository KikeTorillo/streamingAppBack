// routes/seriesRoutes.js
const express = require('express');
const multiUpload = require('../middleware/upload');
const SeriesService = require('../services/seriesService');
const seriesService = new SeriesService();
const { validatorHandler } = require('../middleware/validatorHandler');
const {
  uploadSeriesSchema, // Schema para creación de series (sin video)
  uploadEpisodeSchema, // Schema para episodios (debe incluir seriesId, season, episodeNumber, videoFilePath, etc.)
  searchSerieSchema,
} = require('../schemas/seriesSchemas');
const { authenticateJwt, checkRoles } = require('./../middleware/authHandler');
const router = express.Router();

// Estado global para rastrear el progreso de transcodificación
const progressMap = {};

// Ruta para obtener la lista de series
router.get('/', 
  authenticateJwt,
  checkRoles(['admin']),
  async (req, res, next) => {
  try {
    const series = await seriesService.getSeries();
    res.json(series);
  } catch (error) {
    next(error);
  }
});

/**
 * Endpoint para buscar series por nombre
 */
router.get('/search',
  authenticateJwt,
  checkRoles(['admin']),
  validatorHandler(searchSerieSchema, 'query'),
  async (req, res, next) => {
    try {
      const { name } = req.query;
      if (!name || name.length < 3) {
        return res
          .status(400)
          .json({ error: 'La consulta debe tener al menos 3 caracteres.' });
      }
      const results = await seriesService.searchSerieByName(name);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Ruta para crear una serie (sin video) usando processFile
 */
router.post('/upload',
  authenticateJwt,
  checkRoles(['admin']),
  multiUpload,
  completeInfoUser,
  validatorHandler(uploadSeriesSchema, 'body'),
  async (req, res, next) => {
    try {
      const taskId = Date.now().toString();
      progressMap[taskId] = { status: 'processing', progress: 0 };
      const fileInfo = req.body;
      // Aquí, fileInfo NO contiene videoFilePath, por lo que se crea la serie
      processFile(taskId, fileInfo);
      res.json({ taskId });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Ruta para subir un episodio a una serie existente usando processFile.
 * Se espera que el body incluya: seriesId, name, season, episodeNumber, videoFilePath, etc.
 */
router.post('/episode',
  authenticateJwt,
  checkRoles(['admin']),
  multiUpload,
  completeInfoUser,
  validatorHandler(uploadEpisodeSchema, 'body'),
  async (req, res, next) => {
    try {
      const taskId = Date.now().toString();
      progressMap[taskId] = { status: 'processing', progress: 0 };
      const fileInfo = req.body;
      // Al incluir videoFilePath, processFile entenderá que se trata de un episodio.
      processFile(taskId, fileInfo);
      res.json({ taskId });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Endpoint para obtener el progreso de una tarea:
 */
router.get('/progress/:taskId', 
  authenticateJwt,
  checkRoles(['admin']),
  (req, res) => {
  const { taskId } = req.params;
  const task = progressMap[taskId];
  if (!task) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  res.json(task);
});

/**
 * Función para procesar el archivo y actualizar el progreso.
 * Dependiendo de si fileInfo.videoFilePath existe, se decide el flujo:
 *   - Si existe videoFilePath: se asume que se trata de un episodio y se llama a uploadEpisode.
 *   - Si no existe: se crea la serie (con portada y metadatos) mediante createSeries.
 */
async function processFile(taskId, fileInfo) {
  try {
    // Actualizar el progreso inicial
    progressMap[taskId].status = 'transcoding';
    progressMap[taskId].progress = 0;
    if (fileInfo.video) {
      // Se trata de la subida de un episodio
      await seriesService.uploadEpisode(fileInfo, (progress) => {
        progressMap[taskId].progress = progress;
      });
    } else {
      // Se trata de la creación de una serie
      await seriesService.createSeries(fileInfo);
    }

    progressMap[taskId].status = 'completed';
    progressMap[taskId].progress = 100;
  } catch (error) {
    progressMap[taskId].status = 'failed';
    progressMap[taskId].error = error.message;
  }
}

async function completeInfoUser(req, res, next) {
  // Extraer datos adicionales del cuerpo de la solicitud
  // Obtener la IP del cliente
  let clientIp = req.socket.remoteAddress || '';
  // Si X-Forwarded-For contiene múltiples IPs, tomar la primera
  if (Array.isArray(clientIp)) {
    clientIp = clientIp[0];
  } else if (typeof clientIp === 'string') {
    clientIp = clientIp.split(',')[0].trim();
  }
  // Normalizar la IP (eliminar ::ffff: para IPv6)
  clientIp = clientIp.replace(/^::ffff:/, '');
  const user = { id: 'anonymous' };
  const ip = clientIp || 'unknown';
  const data = req.body;
  data.user = user;
  data.ip = ip;
  if (req.files && req.files['video']) {
    data.video = req.files['video'] ? req.files['video'][0].path : '';
  }
  if (req.files && req.files['coverImage']) {
    data.coverImage = req.files['coverImage']
      ? req.files['coverImage'][0].path
      : '';
  }
  next();
}

module.exports = router;
