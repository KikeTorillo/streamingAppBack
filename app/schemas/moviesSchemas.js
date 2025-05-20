// moviesSchemas.js
// Importación de Joi para crear esquemas de validación
const Joi = require('joi');

/**
 * Definición de tipos de datos reutilizables para validación.
 */
const id = Joi.number().integer().positive();
const title = Joi.string();
const categoryId = Joi.number().integer().positive();
const releaseYear = Joi.number()
  .integer()
  .min(1900)
  .max(new Date().getFullYear());
const description = Joi.string().allow('');
const video = Joi.string();
const coverImage = Joi.string();
const user = Joi.object();
const ip = Joi.string();

// Esquema para subir videos, adaptado para películas, series y episodios
const createMovieSchema = Joi.object({
  // Nombre del contenido (película, serie o episodio)
  title: title.required().messages({
    'any.required': 'El nombre de la pelicula es obligatorio',
    'string.empty': 'El nombre no puede estar vacío',
  }),
  // ID de la categoría
  categoryId: categoryId.required().messages({
    'any.required': 'La categoría es obligatoria',
    'number.empty': 'La categoria no puede estar vacia',
    'number.base': 'La categoría debe ser un ID numérico válido',
  }),

  // Año de lanzamiento
  releaseYear: releaseYear.required().messages({
    'any.required': 'El año de lanzamiento es obligatorio',
    'number.base': 'El año debe ser un número válido',
    'number.min': 'El año no puede ser menor a 1900',
    'number.max': `El año no puede ser mayor a ${new Date().getFullYear()}`,
  }),

  description: description.required().messages({
    'any.required': 'La descripcion de la pelicula es obligatoria',
    'string.empty': 'La descripcion de la pelicula es obligatoria',
  }),

  video: video.required().messages({
    'any.required': 'La ruta de la pelicula es obligatoria',
    'string.empty': 'La ruta de la pelicula es obligatoria',
  }),

  coverImage: coverImage.required().messages({
    'any.required': 'La ruta de la portada es obligatoria para películas',
    'string.empty': 'La ruta de la portada es obligatoria',
  }),

  user: user.required(),
  ip: ip.required(),
});

// Esquema para búsqueda. En este caso se mantiene simple ya que la búsqueda se realiza por nombre y tipo de contenido.
const getMovieSchema = Joi.object({
  id: id.required().messages({
    'any.required': 'El id es obligatorio',
    'number.empty': 'El id no puede estar vacio',
    'number.base': 'El id debe ser un número',
    'number.positive': 'El id debe ser un número positivo',
  }),
});

// Esquema para búsqueda. En este caso se mantiene simple ya que la búsqueda se realiza por nombre y tipo de contenido.
const getMovieByTitleSchema = Joi.object({
  title: title.required().messages({
    'any.required': 'El titulo es obligatorio',
    'string.empty': 'El titulo no puede estar vacío',
  }),
});

// Nuevo esquema para actualizar una película
const updateMovieSchema = Joi.object({
    // Nombre del contenido (película, serie o episodio)
    title: title.optional().messages({
      'any.required': 'El nombre de la pelicula es obligatorio',
      'string.empty': 'El nombre no puede estar vacío',
    }),
    // ID de la categoría
    categoryId: categoryId.optional().messages({
      'any.required': 'La categoría es obligatoria',
      'number.empty': 'La categoria no puede estar vacia',
      'number.base': 'La categoría debe ser un ID numérico válido',
    }),
  
    // Año de lanzamiento
    releaseYear: releaseYear.optional().messages({
      'any.required': 'El año de lanzamiento es obligatorio',
      'number.base': 'El año debe ser un número válido',
      'number.min': 'El año no puede ser menor a 1900',
      'number.max': `El año no puede ser mayor a ${new Date().getFullYear()}`,
    }),
  
    description: description.optional().messages({
      'any.required': 'La descripcion de la pelicula es obligatoria',
      'string.empty': 'La descripcion de la pelicula es obligatoria',
    }),

    coverImage: coverImage.optional().messages({
      'any.required': 'La ruta de la portada es obligatoria para películas',
      'string.empty': 'La ruta de la portada es obligatoria',
    }),
  
    user: user.required(),
    ip: ip.required(),
});

module.exports = {
  createMovieSchema,
  getMovieSchema,
  getMovieByTitleSchema,
  updateMovieSchema,
};
