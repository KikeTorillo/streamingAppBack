const Joi = require('joi');

// Esquema para subir videos, adaptado para películas, series y episodios
const uploadSeriesSchema = Joi.object({
  // Nombre del contenido (película, serie o episodio)
  name: Joi.string().required().messages({
    'any.required': 'El nombre de la serie es obligatorio',
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
    'any.required': 'La sipnosis de la serie es obligatoria',
    'string.empty': 'La sipnosis de la serie es obligatoria',
  }),

  coverImage: Joi.string().required().messages({
    'any.required': 'La ruta de la portada es obligatoria',
    'string.empty': 'La ruta de la portada es obligatoria',
  }),

  user: Joi.object().required(),
  ip: Joi.string().required(),
});

// Esquema para búsqueda. En este caso se mantiene simple ya que la búsqueda se realiza por nombre y tipo de contenido.
const searchSerieSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'El nombre es obligatorio',
    'string.empty': 'El nombre no puede estar vacío',
  }),
});

// Esquema para subir videos, adaptado para películas, series y episodios
const uploadEpisodeSchema = Joi.object({
  // En series, para subir un episodio se requieren temporada y número de episodio.
  // Si se está creando una serie, estos campos se rechazan.
  serieId: Joi.number().integer().min(1).required().messages({
    'any.required': 'El id de a serie es obligatorio para episodios',
    'number.base': 'El id de a serie es obligatorio para episodios',
  }),

  // En series, para subir un episodio se requieren temporada y número de episodio.
  // Si se está creando una serie, estos campos se rechazan.
  season: Joi.number().integer().min(1).required().messages({
    'any.required': 'La temporada es obligatoria para episodios',
    'number.base': 'La temporada debe ser un número entero positivo',
  }),

  episodeNumber: Joi.number().integer().min(1).required().messages({
    'any.required': 'El número de episodio es obligatorio para episodios',
    'number.base': 'El número de episodio debe ser un número entero positivo',
  }),

  video: Joi.string().required().messages({
    'any.required': 'La ruta del video es obligatoria para episodios',
    'string.empty': 'La ruta del video es obligatoria',
  }),

  user: Joi.object().optional(),
  ip: Joi.string().optional(),

});

module.exports = {
  uploadSeriesSchema,
  searchSerieSchema,
  uploadEpisodeSchema,
};
