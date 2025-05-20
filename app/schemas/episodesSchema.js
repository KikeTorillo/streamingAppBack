const Joi = require('joi');

/**
 * Definición de tipos de datos reutilizables para validación.
 */
const id = Joi.number().integer().positive();
const serieId = Joi.number().integer().positive().min(1);
const season = Joi.number().integer().positive().min(1);
const episodeNumber = Joi.number().integer().positive().min(1);
const title = Joi.string().allow('');
const description = Joi.string().allow('');
const video = Joi.string();
const user = Joi.object();
const ip = Joi.string();

// Esquema para subir videos, adaptado para películas, series y episodios
const createEpisodeSchema = Joi.object({
  serieId: serieId.required().messages({
    'any.required': 'El id de a serie es obligatorio para episodios',
    'number.base': 'El id de a serie es obligatorio para episodios',
  }),

  // En series, para subir un episodio se requieren temporada y número de episodio.
  // Si se está creando una serie, estos campos se rechazan.
  season: season.required().messages({
    'any.required': 'La temporada es obligatoria para episodios',
    'number.base': 'La temporada debe ser un número entero positivo',
  }),

  episodeNumber: episodeNumber.required().messages({
    'any.required': 'El número de episodio es obligatorio para episodios',
    'number.base': 'El número de episodio debe ser un número entero positivo',
  }),

  title: title.optional().messages({
    'any.required': 'El nombre de la serie es obligatorio',
    'string.empty': 'El nombre no puede estar vacío',
  }),

  description: description.optional().messages({
    'any.required': 'La descripcion de la serie es obligatoria',
    'string.empty': 'La descripcion de la serie es obligatoria',
  }),

  video: video.required().messages({
    'any.required': 'La ruta del video es obligatoria para episodios',
    'string.empty': 'La ruta del video es obligatoria',
  }),

  user: user.required(),
  ip: ip.required(),
});

// Esquema para búsqueda. En este caso se mantiene simple ya que la búsqueda se realiza por nombre y tipo de contenido.
const getEpisodesSchema = Joi.object({
  serieId: serieId.required().messages({
    'any.required': 'El id de la serie es obligatorio',
    'number.base': 'El id debe ser un número',
    'number.positive': 'El id debe ser un número positivo',
  }),

  season: season.optional().messages({
    'number.base': 'La temporada debe ser un número entero positivo',
  }),

  episodeNumber: episodeNumber.optional().messages({
    'number.base': 'El número de episodio debe ser un número entero positivo',
  }),
})
  .with('episodeNumber', 'season')
  .messages({
    'object.with':
      'La temporada es obligatoria cuando se especifica el número de episodio',
  });
// Esquema para búsqueda. En este caso se mantiene simple ya que la búsqueda se realiza por nombre y tipo de contenido.
const getEpisodeSchema = Joi.object({
  id: id.required().messages({
    'any.required': 'El id es obligatorio',
    'number.empty': 'El id no puede estar vacio',
    'number.base': 'El id debe ser un número',
    'number.positive': 'El id debe ser un número positivo',
  }),
});

// Nuevo esquema para actualizar una película
const updateEpisodeSchema = Joi.object({
  serieId: serieId.optional().messages({
    'any.required': 'El id de a serie es obligatorio para episodios',
    'number.base': 'El id de a serie es obligatorio para episodios',
  }),

  // En series, para subir un episodio se requieren temporada y número de episodio.
  // Si se está creando una serie, estos campos se rechazan.
  season: season.optional().messages({
    'any.required': 'La temporada es obligatoria para episodios',
    'number.base': 'La temporada debe ser un número entero positivo',
  }),

  episodeNumber: episodeNumber.optional().messages({
    'any.required': 'El número de episodio es obligatorio para episodios',
    'number.base': 'El número de episodio debe ser un número entero positivo',
  }),

  title: title.optional().messages({
    'any.required': 'El nombre de la serie es obligatorio',
    'string.empty': 'El nombre no puede estar vacío',
  }),

  description: description.optional().messages({
    'any.required': 'La descripcion de la serie es obligatoria',
    'string.empty': 'La descripcion de la serie es obligatoria',
  }),

  user: user.required(),
  ip: ip.required(),
});

module.exports = {
  createEpisodeSchema,
  getEpisodeSchema,
  getEpisodesSchema,
  updateEpisodeSchema,
};
