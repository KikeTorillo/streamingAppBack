// routes/seriesRoutes.js
const express = require('express');
const multiUpload = require('../middleware/upload');
const SeriesService = require('../services/seriesService');
const service = new SeriesService();
const { validatorHandler } = require('../middleware/validatorHandler');
const {
  createSerieSchema,
  getSerieSchema,
  getSerieByTitleSchema,
  updateSerieSchema,
} = require('../schemas/seriesSchemas');
const { authenticateJwt, checkRoles } = require('./../middleware/authHandler');
const router = express.Router();
// Estado global para rastrear el progreso de transcodificación
const progressMap = {};

/**
 * Ruta para crear una serie
 */
router.post(
  '/',
  authenticateJwt,
  checkRoles(['admin']),
  multiUpload,
  completeInfoUser,
  validatorHandler(createSerieSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newSerie = await service.create(body);
      res.status(201).json(newSerie);
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
  async (req, res, next) => {
    try {
      const series = await service.find();
      res.json(series);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Ruta para obtener una serie específica por ID
 */
router.get(
  '/:id',
  authenticateJwt,
  checkRoles(['admin']),
  validatorHandler(getSerieSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const serie = await service.findOne(id);
      res.json(serie);
    } catch (error) {
      next(error);
    }
  }
);

// /**
//  * Endpoint para buscar videos por nombre:
//  * - Esta ruta maneja una solicitud GET para buscar videos cuyos nombres coincidan con una consulta.
//  * - La consulta debe ser proporcionada como un parámetro de consulta (`title`).
//  */
router.get(
  '/search',
  authenticateJwt,
  checkRoles(['admin']),
  validatorHandler(getSerieByTitleSchema, 'query'),
  async (req, res, next) => {
    try {
      const { title } = req.query; // Obtener el nombre y el tipo de contenido
      if (!title || title.length < 3) {
        return res
          .status(400)
          .json({ error: 'La consulta debe tener al menos 3 caracteres.' });
      }
      // Llamar al servicio con el tipo de contenido
      const results = await service.findByName(title);
      res.json(results); // Responder con los resultados de la búsqueda
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
  validatorHandler(getSerieSchema, 'params'),
  validatorHandler(updateSerieSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const changes = req.body;
      const updatedMovie = await service.update(id, changes);
      res.json(updatedMovie);
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
  validatorHandler(getSerieSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await service.delete(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

async function completeInfoUser(req, res, next) {
  try {
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
    
    // Manejar archivos de video
    if (req.files && req.files['video']) {
      data.video = req.files['video'][0].path;
      console.log('📹 Video archivo recibido:', data.video);
    }
    
    // ✅ NUEVO: Manejar coverImage (archivo O URL)
    if (req.files && req.files['coverImage']) {
      // Si hay archivo subido, usarlo
      data.coverImage = req.files['coverImage'][0].path;
      console.log('🖼️ Imagen archivo recibida:', data.coverImage);
      
      // Si también viene coverImageUrl, eliminarla (priorizar archivo)
      if (data.coverImageUrl) {
        console.log('⚠️ Se recibió tanto archivo como URL. Priorizando archivo subido.');
        delete data.coverImageUrl;
      }
    } else if (data.coverImageUrl) {
      // Si no hay archivo pero sí URL, descargarla como archivo temporal
      console.log('🌐 URL de imagen recibida, descargando...:', data.coverImageUrl);
      
      try {
        const { downloadImageFromUrl, isValidImageUrl } = require('../utils/imageDownloader');
        
        // Validar URL
        if (!isValidImageUrl(data.coverImageUrl)) {
          throw new Error('URL de imagen no válida o dominio no permitido');
        }
        
        // Descargar imagen y crear archivo temporal
        const tempImagePath = await downloadImageFromUrl(data.coverImageUrl);
        data.coverImage = tempImagePath;
        data.isTemporaryCoverImage = true; // Flag para limpieza posterior
        
        console.log('✅ Imagen descargada como archivo temporal:', tempImagePath);
        
        // Limpiar coverImageUrl ya que ahora tenemos el archivo
        delete data.coverImageUrl;
        
      } catch (error) {
        console.error('❌ Error descargando imagen:', error);
        return next(new Error(`Error descargando imagen: ${error.message}`));
      }
    } else {
      // Si no hay ninguno de los dos, será manejado por la validación
      console.log('⚠️ No se recibió imagen (ni archivo ni URL)');
    }
    
    console.log('📦 Datos procesados en middleware:', {
      title: data.title,
      hasVideo: !!data.video,
      hasCoverImage: !!data.coverImage,
      isTemporary: !!data.isTemporaryCoverImage
    });
    
    next();
  } catch (error) {
    console.error('❌ Error en completeInfoUser:', error);
    next(error);
  }
}

module.exports = router;
