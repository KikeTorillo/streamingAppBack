// videoSchemas.js
const Joi = require('joi');

// Esquema base para el cuerpo de la solicitud
const uploadVideoSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'El nombre del video es obligatorio',
    'string.empty': 'El nombre no puede estar vacío',
  }),
  category: Joi.number().integer().positive().required().messages({
    'any.required': 'La categoría es obligatoria',
    'number.base': 'La categoría debe ser un ID numérico válido',
  }),
  contentType: Joi.string().valid('movie', 'series').required().messages({
    'any.required': 'El tipo de contenido es obligatorio',
    'any.only': 'Tipo de contenido inválido (debe ser "movie" o "series")',
  }),
  releaseYear: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required()
    .messages({
      'any.required': 'El año de lanzamiento es obligatorio',
      'number.base': 'El año debe ser un número válido',
      'number.min': 'El año no puede ser menor a 1900',
      'number.max': `El año no puede ser mayor a ${new Date().getFullYear()}`,
    }),
  season: Joi.number()
    .integer()
    .min(1)
    .when('contentType', {
      is: 'series',
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      'any.required': 'La temporada es obligatoria para series',
      'number.base': 'La temporada debe ser un número entero positivo',
    }),
  episodeNumber: Joi.number()
    .integer()
    .min(1)
    .when('contentType', {
      is: 'series',
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      'any.required': 'El número de episodio es obligatorio para series',
      'number.base': 'El número de episodio debe ser un número entero positivo',
    }),
  description: Joi.string().allow('').optional(),

  videoFilePath: Joi.string().required().messages({
    'any.required': 'La ruta del video es obligatoria',
    'string.empty': 'La ruta del video es obligatoria',
  }),

  coverImagePath: Joi.string().required().messages({
    'any.required': 'La ruta de la portada es obligatoria',
    'string.empty': 'La ruta de la portada es obligatoria',
  }),

  user: Joi.object().optional(),

  ip: Joi.string().optional(),
});

// Exportación de los esquemas para su uso en validaciones
module.exports = {
  uploadVideoSchema,
};
