// routes/seriesRoutes.js
const express = require('express');
const multiUpload = require('../middleware/upload');
const SeriesService = require('../services/seriesService');
const service = new SeriesService();
const { validatorHandler } = require('../middleware/validatorHandler');
const {
  createEpisodeSchema,
  getEpisodeSchema,
  getEpisodesSchema,
  updateEpisodeSchema,
} = require('../schemas/episodesSchema');
const { authenticateJwt, checkRoles } = require('./../middleware/authHandler');
const router = express.Router();
// Estado global para rastrear el progreso de transcodificación
const progressMap = {};

/**
 * Ruta para crear un episodio
 */
router.post(
  '/',
  authenticateJwt,
  checkRoles(['admin']),
  multiUpload,
  completeInfoUser,
  validatorHandler(createEpisodeSchema, 'body'),
  async (req, res, next) => {
    try {
      // Puedes generar un taskId para seguimiento si lo requieres
      const taskId = Date.now().toString();
      progressMap[taskId] = { status: 'processing', progress: 0 };
      const fileInfo = req.body;
      // Procesar el archivo en segundo plano según el flujo correspondiente
      processFile(taskId, fileInfo);
      // Responder con el ID de la tarea
      res.json({ taskId });

      //const body = req.body;
      //const newEpisode = await service.create(body);
      //res.status(201).json(newEpisode);
    } catch (error) {
      next(error);
    }
  }
);

// // Ruta para obtener la lista de series
router.get(
  '/',
  authenticateJwt,
  checkRoles(['admin']),
  completeInfoUser,
  validatorHandler(getEpisodesSchema, 'query'),
  async (req, res, next) => {
    try {
      const { serieId, season, episodeNumber } = req.query;
      const series = await service.findEpisode(serieId, season, episodeNumber);
      res.json(series);
    } catch (error) {
      next(error);
    }
  }
);

// /**
//  * Ruta para actualizar una película.
//  * Se espera recibir en el cuerpo de la solicitud:
//  * { title, coverImage, releaseYear }
//  */
router.patch(
  '/:id',
  authenticateJwt,
  checkRoles(['admin']),
  multiUpload,
  completeInfoUser,
  validatorHandler(getEpisodeSchema, 'params'),
  validatorHandler(updateEpisodeSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const changes = req.body;
      const updatedEpisode = await service.updateEpisode(id, changes);
      res.json(updatedEpisode);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Ruta para eliminar una película por su ID.
 */
router.delete(
  '/:id',
  authenticateJwt,
  checkRoles(['admin']),
  completeInfoUser,
  validatorHandler(getEpisodeSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await service.deleteEpisode(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Función para procesar el archivo y actualizar el progreso:
 * - Según fileInfo.contentType y la presencia de videoFilePath, se decide el flujo:
 *    • Para "movie": se llama a uploadMovie.
 *    • Para "series":
 *         - Si existe videoFilePath, se asume que es una subida de episodio.
 *         - Si NO existe videoFilePath, se asume creación de la serie.
 */
async function processFile(taskId, fileInfo) {
  try {
    // Actualizar el progreso inicial
    progressMap[taskId].status = 'transcoding'; // Estado: "transcodificando"
    progressMap[taskId].progress = 0;

    await service.createEpisode(fileInfo, (progress) => {
      progressMap[taskId].progress = progress;
    });

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
