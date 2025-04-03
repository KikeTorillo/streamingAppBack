const Joi = require('joi');

// Esquema para subir videos, adaptado para películas, series y episodios
const uploadMovieSchema = Joi.object({
  // Nombre del contenido (película, serie o episodio)
  title: Joi.string().required().messages({
    'any.required': 'El nombre de la pelicula es obligatorio',
    'string.empty': 'El nombre no puede estar vacío',
  }),
  // ID de la categoría
  category: Joi.number().integer().positive().required().messages({
    'any.required': 'La categoría es obligatoria',
    'number.base': 'La categoría debe ser un ID numérico válido',
  }),

  // Año de lanzamiento
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

  description: Joi.string().allow('').required().messages({
    'any.required': 'La sipnosis de la pelicula es obligatoria',
    'string.empty': 'La sipnosis de la pelicula es obligatoria',
  }),

  video: Joi.string().required().messages({
    'any.required': 'La ruta de la pelicula es obligatoria',
    'string.empty': 'La ruta de la pelicula es obligatoria',
  }),

  coverImage: Joi.string().required().messages({
    'any.required': 'La ruta de la portada es obligatoria para películas',
    'string.empty': 'La ruta de la portada es obligatoria',
  }),

  user: Joi.object().required(),
  ip: Joi.string().required(),
});

// Esquema para búsqueda. En este caso se mantiene simple ya que la búsqueda se realiza por nombre y tipo de contenido.
const searchMovieSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'El nombre es obligatorio',
    'string.empty': 'El nombre no puede estar vacío',
  }),
});

// Nuevo esquema para actualizar una película
const updateMovieSchema = Joi.object({
  title: Joi.string().optional(),
  coverImage: Joi.string().optional(),
  releaseYear: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .optional(),
  user: Joi.object().required(),
  ip: Joi.string().required(),
});

module.exports = {
  uploadMovieSchema,
  searchMovieSchema,
  updateMovieSchema,
};
