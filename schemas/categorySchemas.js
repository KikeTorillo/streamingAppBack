// categorySchemas.js

const Joi = require('joi');

/**
 * Esquema para la creación de una categoría.
 * Se valida que el nombre sea un string no vacío y con una longitud máxima de 100 caracteres.
 */
const createCategorySchema = Joi.object({
  name: Joi.string().max(100).required().messages({
    'any.required': 'El nombre de la categoría es obligatorio',
    'string.empty': 'El nombre de la categoría no puede estar vacío',
    'string.max': 'El nombre de la categoría no debe exceder 100 caracteres'
  })
});

/**
 * Esquema para actualizar una categoría.
 * Se permite actualizar el nombre (opcional), manteniendo la validación de longitud.
 */
const updateCategorySchema = Joi.object({
  name: Joi.string().max(100).optional().messages({
    'string.empty': 'El nombre de la categoría no puede estar vacío',
    'string.max': 'El nombre de la categoría no debe exceder 100 caracteres'
  })
});

/**
 * Esquema para obtener una categoría a través de su ID (usado en params).
 */
const getCategorySchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'any.required': 'El ID es obligatorio',
    'number.base': 'El ID debe ser un número',
    'number.positive': 'El ID debe ser un número positivo'
  })
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  getCategorySchema,
};