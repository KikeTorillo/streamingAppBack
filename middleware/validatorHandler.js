// middleware/validator.middleware.js

const boom = require('@hapi/boom'); // Biblioteca para manejo de errores HTTP estructurados

/**
 * Middleware dinámico para validar datos según un esquema Joi.
 * Utiliza closures para generar middlewares específicos basados en el esquema y la propiedad a validar.
 * 
 * @param {Object} schema - Esquema Joi que define las reglas de validación.
 * @param {string} property - Propiedad del objeto `req` que contiene los datos a validar (ej: 'body', 'params', 'query').
 * @returns {Function} Middleware de validación específico.
 */
function validatorHandler(schema, property) {
    // Retorna un middleware dinámico gracias al closure
    return (req, res, next) => {
        const data = req[property]; // Obtiene los datos a validar (req.body, req.params, req.query, etc.)
        
        // Valida los datos utilizando el esquema Joi
        const { error } = schema.validate(data, { abortEarly: false }); // abortEarly: false permite capturar todos los errores
        if (error) {
            // Si hay errores de validación, pasa un error 400 (Bad Request) con detalles
            next(boom.badRequest('Validation error', error)); // Envía el error al siguiente middleware de error
        } else {
            // Si la validación es exitosa, continúa con la siguiente función en la cadena
            next();
        }
    };
}

// Exporta el middleware dinámico para su uso en rutas
module.exports = { validatorHandler };