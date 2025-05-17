/**
 * @file server.js
 * @description Punto de entrada del servidor Express. Configura middleware, CORS,
 * manejo de cookies, autenticación y rutas de la API, así como gestión de errores.
 */

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const routerApi = require('./routes');
const { checkApiKey } = require('./middleware/authHandler');
const { logErrors, errorHandler, boomErrorHandler } = require('./middleware/errorHandler');
const { config } = require('./config/config');

// Middleware para parsear cuerpos JSON en las peticiones
app.use(express.json());

// Middleware para parsear cookies en las peticiones
app.use(cookieParser());

/**
 * Lista de orígenes permitidos para CORS, obtenida de configuración.
 * @type {string[]}
 */
const whiteList = config.whiteList.split(',');

/**
 * Opciones de configuración de CORS.
 * Permite peticiones solo desde orígenes en la whitelist y con credenciales.
 * @type {Object}
 * @property {Function} origin - Función de validación de origen.
 * @property {boolean} credentials - Habilita envío de cookies.
 */
const options = {
  origin: (origin, callback) => {
    /**
     * Callback de validación de origen para CORS.
     * @param {string|null} origin - Origen de la petición.
     * @param {Function} callback - Callback a invocar con el resultado.
     */
    if (!origin) {
      // Peticiones desde herramientas como Postman no envían origen
      return callback(null, true);
    }
    if (whiteList.includes(origin)) {
      // Origen permitido
      callback(null, true);
    } else {
      // Origen no permitido
      callback(new Error('Error CORS: origen no permitido'));
    }
  },
  credentials: true
};

// Middleware CORS con opciones personalizadas
app.use(cors(options));
// app.use(cors('*')); // Permitir todos los orígenes (no recomendado en producción)

// Inicialización de estrategias de autenticación con Passport
require('./utils/auth');

/**
 * Ruta GET /
 * @name GetRoot
 * @description Ruta de prueba que devuelve un saludo.
 * @route {GET} /
 * @param {express.Request} req - Objeto de petición Express.
 * @param {express.Response} res - Objeto de respuesta Express.
 */
app.get('/', (req, res) => {
  res.send('Hola mi server en express');
});

// Si quisieras validar API Key globalmente, descomenta la siguiente línea:
// app.use(checkApiKey);

/**
 * Configura todas las rutas de la API bajo el prefijo /api/v1.
 * @param {express.Application} app - Instancia de la aplicación Express.
 */
routerApi(app);

// --- Gestión de errores ---
// Los middleware de manejo de errores deben ir después de las rutas.

/**
 * Middleware para capturar errores no manejados y pasarlos al siguiente handler.
 */
app.use(logErrors);

/**
 * Middleware para formatear errores generados con Boom.
 */
app.use(boomErrorHandler);

/**
 * Middleware final para enviar la respuesta de error al cliente.
 */
app.use(errorHandler);

/**
 * Levanta el servidor en el puerto definido en la variable de entorno PORT.
 * @param {number|string} process.env.PORT - Puerto en el que escucha el servidor.
 */
app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
});
