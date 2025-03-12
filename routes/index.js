// routerApi.js

// Importación de las rutas que se utilizarán en la aplicación
const authRouter = require('./authRouter'); // Rutas relacionadas con autenticación
const videosRoutes = require('./videosRoutes'); // Rutas relacionadas con videos

// Importación de Express para manejo de rutas
const express = require('express');

/**
 * Función principal para gestionar las rutas de la API.
 * @param {Object} app - Instancia de la aplicación Express.
 */
function routerApi(app) {
  // Creación de un enrutador principal utilizando Express.Router()
  const router = express.Router();

  /**
   * Middleware para servir archivos estáticos (comentado por ahora).
   * Ejemplo: Sirve archivos desde la carpeta 'uploads' bajo la ruta '/uploads'.
   */
  // app.use('/uploads', express.static('uploads'));

  /**
   * Definición de la versión de la API.
   * Todas las rutas definidas a continuación estarán bajo el prefijo '/api/v1'.
   * Esto permite gestionar diferentes versiones de la API en el futuro.
   */
  app.use('/api/v1', router);

  /**
   * Registro de las rutas específicas dentro de la versión '/api/v1'.
   * Cada conjunto de rutas se asocia con un recurso específico.
   */
  router.use('/videos', videosRoutes); // Rutas relacionadas con videos
  router.use('/auth', authRouter); // Rutas relacionadas con autenticación
  // router.use('/users', usersRouter); // Rutas relacionadas con usuarios (comentado por ahora)
}

// Exportación de la función para ser utilizada en la aplicación principal
module.exports = routerApi;