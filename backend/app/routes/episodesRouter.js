// routes/episodesRouter.js
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

// Ruta para obtener la lista de episodios
router.get(
  '/',
  authenticateJwt,
  checkRoles(['admin']),
  completeInfoUser,
  validatorHandler(getEpisodesSchema, 'query'),
  async (req, res, next) => {
    try {
      const { serieId, season, episodeNumber } = req.query;
      const episodes = await service.findEpisode(serieId, season, episodeNumber);
      res.json(episodes);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * ✅ NUEVO: Endpoint para obtener el progreso de una tarea de episodio
 * - Esta ruta maneja una solicitud GET para consultar el estado de una tarea específica.
 * - Devuelve el estado (`status`) y el progreso (`progress`) de la tarea.
 */
router.get(
  '/progress/:taskId',
  authenticateJwt,
  checkRoles(['admin']),
  (req, res) => {
    const { taskId } = req.params; // Obtener el ID de la tarea desde los parámetros de la URL
    const task = progressMap[taskId]; // Buscar la tarea en el mapa de progreso
    
    console.log(`📊 Consultando progreso para taskId: ${taskId}`, task);
    
    // Si la tarea no existe, devolver un error 404
    if (!task) {
      console.log(`❌ Tarea no encontrada: ${taskId}`);
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    
    // Responder con el estado de la tarea
    console.log(`✅ Progreso de episodio encontrado:`, task);
    res.json(task);
  }
);

/**
 * Ruta para actualizar un episodio.
 * Se espera recibir en el cuerpo de la solicitud:
 * { serieId, season, episodeNumber, title, description, video }
 */
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
 * Ruta para eliminar un episodio por su ID.
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
 * - Para episodios, se llama al método createEpisode del servicio
 * - Actualiza el progressMap con el estado actual
 */
async function processFile(taskId, fileInfo) {
  try {
    console.log(`🚀 Iniciando procesamiento de episodio para taskId: ${taskId}`);
    
    // Actualizar el progreso inicial
    progressMap[taskId].status = 'transcoding'; // Estado: "transcodificando"
    progressMap[taskId].progress = 0;

    // Llamar al servicio para crear el episodio con callback de progreso
    await service.createEpisode(fileInfo, (progress) => {
      console.log(`📊 Progreso del episodio ${taskId}: ${progress}%`);
      progressMap[taskId].progress = progress;
    });

    // Marcar como completado
    progressMap[taskId].status = 'completed';
    progressMap[taskId].progress = 100;
    
    console.log(`✅ Episodio procesado exitosamente para taskId: ${taskId}`);
    
  } catch (error) {
    console.error(`❌ Error procesando episodio para taskId ${taskId}:`, error);
    
    progressMap[taskId].status = 'failed';
    progressMap[taskId].error = error.message;
  }
}

/**
 * Middleware para completar información del usuario y archivos
 */
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
  
  // Manejar archivo de video para episodios
  if (req.files && req.files['video']) {
    data.video = req.files['video'] ? req.files['video'][0].path : '';
    console.log('📹 Video de episodio recibido:', data.video);
  }
  
  // Manejar imagen de portada si existe
  if (req.files && req.files['coverImage']) {
    data.coverImage = req.files['coverImage']
      ? req.files['coverImage'][0].path
      : '';
    console.log('🖼️ Imagen de episodio recibida:', data.coverImage);
  }
  
  next();
}

module.exports = router;