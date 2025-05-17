// middleware/error.middleware.js

/**
 * Middleware de manejo de errores: Centraliza y gestiona errores en una aplicación Express.
 * Los middleware de error se caracterizan por recibir 4 parámetros: (err, req, res, next).
 */

/**
 * Middleware: Registra errores en la consola para propósitos de depuración.
 * @param {Error} err - Objeto de error capturado.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 */
function logErrors(err, req, res, next) {
    //console.error('[Error Log]:', err); // Imprime el error en la consola para seguimiento.
    next(err); // Pasa el error al siguiente middleware de error.
}

/**
 * Middleware: Maneja errores específicos generados por la biblioteca Boom.
 * Boom es una biblioteca que proporciona errores HTTP estructurados con mensajes claros.
 * @param {Error} err - Objeto de error capturado.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 */
function boomErrorHandler(err, req, res, next) {
    if (err.isBoom) {
        // Si el error es de tipo Boom, extrae su información estructurada.
        const { output } = err;
        const errorResponse = output.payload;
        if (err.data) {
            errorResponse.message = err.data.details[0].message; //este es un mensaje mas detallado pero no siempre se puede obtener el details 
        }
        res.status(output.statusCode).json(errorResponse); // Responde con el código de estado y mensaje de Boom.
    } else {
        // Si no es un error Boom, pasa el error al siguiente middleware.
        next(err);
    }
}

/**
 * Middleware: Maneja errores genéricos que no son de tipo Boom.
 * Este middleware actúa como último recurso para capturar errores no manejados previamente.
 * @param {Error} err - Objeto de error capturado.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 */
function errorHandler(err, req, res, next) {
    //console.log(err);
    // Responde con un código de estado 500 (Internal Server Error) y detalles del error.
    res.status(500).json({
        message: err.message || 'Internal Server Error', // Mensaje descriptivo del error.
        stack: err.stack || 'No stack trace available' // Traza de la pila para depuración.
    });
}

// Exporta los middlewares para ser utilizados en la aplicación.
module.exports = { logErrors, errorHandler, boomErrorHandler };