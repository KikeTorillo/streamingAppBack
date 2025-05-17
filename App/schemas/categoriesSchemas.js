// categorySchemas.js
// Importación de Joi para crear esquemas de validación
const Joi = require('joi');

/**
 * Definición de tipos de datos reutilizables para validación.
 */
const id = Joi.number().integer().positive();
const name = Joi.string().max(100);

/**
 * Esquema para la creación de una categoría.
 * Se valida que el nombre sea un string no vacío y con una longitud máxima de 100 caracteres.
 */
const createCategorySchema = Joi.object({
  name: name.required().messages({
    'any.required': 'El nombre es obligatorio',
    'string.empty': 'El nombre no puede estar vacío',
    'string.base': 'El nombre debe ser un string',
    'string.max': 'El nombre de la categoría no debe exceder 100 caracteres',
  }),
});

/**
 * Esquema para obtener una categoría a través de su ID (usado en params).
 */
const getCategorySchema = Joi.object({
  id: id.required().messages({
    'any.required': 'El id es obligatorio',
    'number.empty': 'El id no puede estar vacio',
    'number.base': 'El id debe ser un número',
    'number.positive': 'El id debe ser un número positivo',
  }),
});

/**
 * Esquema para actualizar una categoría.
 * Se permite actualizar el nombre (opcional), manteniendo la validación de longitud.
 */
const updateCategorySchema = Joi.object({
  name: name.optional().messages({
    'string.empty': 'El nombre no puede estar vacío',
    'string.base': 'El password debe ser un string',
    'string.max': 'El nombre no debe exceder 100 caracteres',
  }),
});

module.exports = {
  createCategorySchema,
  getCategorySchema,
  updateCategorySchema,
};
