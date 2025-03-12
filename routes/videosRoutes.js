// Importación de dependencias
const express = require('express'); // Framework Express para manejar rutas y solicitudes HTTP
const multiUpload = require('../middleware/upload'); // Middleware para manejar la subida de archivos
const VideoService = require('../services/videoService'); // Servicio para gestionar la lógica de los videos
const service = new VideoService(); // Instancia del servicio de videos
const path = require('path'); // Módulo de Node.js para manejar rutas de archivos
const router = express.Router(); // Enrutador de Express para definir las rutas

/**
 * Estado global para rastrear el progreso de transcodificación:
 * - `progressMap` es un objeto que almacena el estado de cada tarea de transcodificación.
 * - Cada tarea tiene un ID único (`taskId`) y un estado (`status` y `progress`).
 */
const progressMap = {};

/**
 * Obtener los 10 videos más vistos:
 * - Esta ruta maneja una solicitud GET para obtener los videos más populares.
 * - Obtiene la IP del cliente y la pasa al servicio para generar datos específicos.
 */
router.get('/top', async (req, res, next) => {
  try {
    // Obtener la IP del cliente
    let clientIp =
      req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;
    // Si X-Forwarded-For contiene múltiples IPs, tomar la primera
    if (Array.isArray(clientIp)) {
      clientIp = clientIp[0];
    } else if (typeof clientIp === 'string') {
      clientIp = clientIp.split(',')[0].trim();
    }
    // Normalizar la IP (eliminar ::ffff: para IPv6)
    clientIp = clientIp.replace(/^::ffff:/, '');
    // Llamar al servicio para obtener los videos más vistos
    const videos = await service.getTopVideos(clientIp);
    // Responder con los videos obtenidos
    res.json(videos);
  } catch (error) {
    // Manejar errores pasándolos al middleware de errores
    next(error);
  }
});

/**
 * Subir un video:
 * - Esta ruta maneja una solicitud POST para subir un archivo de video y una imagen de portada.
 * - Usa el middleware `upload.fields()` para procesar ambos archivos.
 */
router.post('/upload', multiUpload, async (req, res, next) => {
  try {
    // Obtener la IP del cliente
    let clientIp =
      req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;
    // Si X-Forwarded-For contiene múltiples IPs, tomar la primera
    if (Array.isArray(clientIp)) {
      clientIp = clientIp[0];
    } else if (typeof clientIp === 'string') {
      clientIp = clientIp.split(',')[0].trim();
    }
    // Normalizar la IP (eliminar ::ffff: para IPv6)
    clientIp = clientIp.replace(/^::ffff:/, '');

    // Verificar si se recibieron los archivos
    if (!req.files || !req.files['video'] || !req.files['coverImage']) {
      throw new Error('Faltan archivos obligatorios.');
    }

    console.log('Archivo de video recibido:', req.files['video'][0]); // Registro del archivo de video
    console.log('Imagen de portada recibida:', req.files['coverImage'][0]); // Registro de la imagen de portada

    // Rutas temporales de los archivos subidos
    const videoFilePath = req.files['video'][0].path; // Ruta temporal del archivo de video
    const coverImagePath = req.files['coverImage'][0].path; // Ruta temporal de la imagen de portada

    // Generar un ID único para la tarea
    const taskId = Date.now().toString();
    progressMap[taskId] = { status: 'processing', progress: 0 };
    const user = { id: 1 };
    // Extraer datos adicionales del cuerpo de la solicitud
    const fileInfo = {
      body: req.body,
      videoFilePath: videoFilePath,
      coverImagePath: coverImagePath,
      ip: clientIp,
      user: user,
    };

    // Procesar el archivo en segundo plano
    processFile(taskId, fileInfo);

    // Responder con el ID de la tarea
    res.json({ taskId });
  } catch (error) {
    // Manejar errores pasándolos al middleware de errores
    next(error);
  }
});

/**
 * Obtener categorías disponibles:
 * - Esta ruta maneja una solicitud GET para obtener todas las categorías.
 */
router.get('/categories', async (req, res, next) => {
  try {
    const rta = await service.getCategories();
    res.json(rta);
  } catch (error) {
    next(error);
  }
});

/**
 * Endpoint para obtener el progreso de una tarea:
 * - Esta ruta maneja una solicitud GET para consultar el estado de una tarea específica.
 * - Devuelve el estado (`status`) y el progreso (`progress`) de la tarea.
 */
router.get('/progress/:taskId', (req, res) => {
  const { taskId } = req.params; // Obtener el ID de la tarea desde los parámetros de la URL
  const task = progressMap[taskId]; // Buscar la tarea en el mapa de progreso
  // Si la tarea no existe, devolver un error 404
  if (!task) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  // Responder con el estado de la tarea
  res.json(task);
});

/**
 * Endpoint para buscar videos por nombre:
 * - Esta ruta maneja una solicitud GET para buscar videos cuyos nombres coincidan con una consulta.
 * - La consulta debe ser proporcionada como un parámetro de consulta (`name`).
 */
router.get('/search', async (req, res, next) => {
  try {
    const { name, contentType } = req.query; // Obtener el nombre y el tipo de contenido
    if (!name || name.length < 3) {
      return res
        .status(400)
        .json({ error: 'La consulta debe tener al menos 3 caracteres.' });
    }

    // Llamar al servicio con el tipo de contenido
    const results = await service.searchVideosByName(name, contentType);
    res.json(results); // Responder con los resultados de la búsqueda
  } catch (error) {
    next(error);
  }
});

/**
 * Endpoint para solicitar (listar) películas:
 * - Se espera que en VideoService implementes el método getMovies() que realice la consulta correspondiente.
 */
router.get('/movies', async (req, res, next) => {
  try {
    const movies = await service.getMovies(); // Método a implementar en VideoService
    res.json(movies);
  } catch (error) {
    next(error);
  }
});

/**
 * Endpoint para solicitar (listar) series:
 * - Se espera que en VideoService implementes el método getSeries() que realice la consulta correspondiente.
 */
router.get('/series', async (req, res, next) => {
  try {
    const series = await service.getSeries(); // Método a implementar en VideoService
    res.json(series);
  } catch (error) {
    next(error);
  }
});

/**
 * Función para procesar el archivo y actualizar el progreso:
 * - Esta función maneja la lógica de transcodificación y notifica el progreso al frontend.
 * - Actualiza el estado de la tarea en `progressMap`.
 */
async function processFile(taskId, fileInfo) {
  try {
    // Actualizar el progreso inicial
    progressMap[taskId].status = 'transcoding'; // Estado: "transcodificando"
    progressMap[taskId].progress = 0; // Progreso inicial: 0%

    // Procesar el archivo con el servicio
    await service.uploadVideo(fileInfo, (progress) => {
      progressMap[taskId].progress = progress; // Actualiza el progreso en tiempo real
    });

    // Marcar la tarea como completada
    progressMap[taskId].status = 'completed'; // Estado: "completado"
    progressMap[taskId].progress = 100; // Progreso final: 100%
  } catch (error) {
    // Manejar errores marcando la tarea como fallida
    progressMap[taskId].status = 'failed'; // Estado: "fallido"
    progressMap[taskId].error = error.message; // Mensaje de error
  }
}

module.exports = router;
