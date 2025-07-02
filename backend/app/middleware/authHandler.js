// middleware/auth.middleware.js

const boom = require('@hapi/boom'); // Biblioteca para errores HTTP estructurados
const { config } = require('./../config/config'); // Configuración de la aplicación
const jwt = require('jsonwebtoken'); // Para manejo de JSON Web Tokens

/**
 * Middleware: Verifica la validez de la API Key en las cabeceras
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 * @param {Function} next - Función para pasar al siguiente middleware
 */
function checkApiKey(req, res, next) {
    const apiKey = req.headers['api']; // Obtener API Key de las cabeceras
    if (apiKey === config.apiKey) {
        next(); // API Key válida - continuar
    } else {
        next(boom.unauthorized('Invalid API key')); // Error 401 si no coincide
    }
}

/**
 * Middleware: Verifica el token JWT de autenticación
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 * @param {Function} next - Función para pasar al siguiente middleware
 */
function authenticateJwt(req, res, next) {
    const token = req.cookies.access_token; // Obtener token de las cookies
    if (!token) {
        throw boom.unauthorized('Session expired or invalid'); // Error si no hay token
    }

    // Verificar firma y contenido del token
    jwt.verify(token, config.jwtSecret, (err, user) => {
        if (err) {
            throw boom.unauthorized('Invalid or expired token'); // Token inválido/expirado
        }
        req.user = user; // Adjuntar datos del usuario a la solicitud
        next();
    });
}

/**
 * Middleware: Verifica roles de usuario autorizados
 * @param {Array<string>} roles - Lista de roles permitidos
 * @returns {Function} Middleware de verificación de roles
 */
function checkRoles(roles) {
    return (req, res, next) => {
        const userRole = req.user?.role; // Obtener rol del usuario
        if (roles.includes(userRole)) {
            next(); // Rol autorizado - continuar
        } else {
            next(boom.forbidden('Insufficient permissions')); // Error 403 si no tiene permiso
        }
    };
}

module.exports = { checkApiKey, authenticateJwt, checkRoles };