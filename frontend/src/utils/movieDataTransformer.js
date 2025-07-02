// src/utils/movieDataTransformer.js

/**
 * Construir URL de portada a partir del hash entregado por el backend
 * @param {Object} movieData - Datos de película desde backend
 * @param {string} baseUrl - URL base del backend
 * @returns {string} URL completa de la portada
 */
function buildCoverUrl(movieData, baseUrl = 'http://localhost:8082') {
  if (!movieData || !movieData.cover_image) return '';
  const sanitized = baseUrl.replace(/\/$/, '');
  return `${sanitized}/covers/${movieData.cover_image}/cover.jpg`;
}

/**
 * Transformar los datos de película recibidos del backend al formato utilizado
 * por los componentes de presentación.
 * Mantiene los datos originales en la propiedad `_original`.
 * @param {Object} backendMovie - Película devuelta por el backend
 * @param {Array|Object} [categoryData] - Datos de categorías para obtener nombre
 * @param {string} [baseUrl] - URL base para imágenes de portada
 * @returns {Object} Película transformada
 */
function transformMovieData(backendMovie, categoryData = [], baseUrl) {
  if (!backendMovie) return null;

  const movie = {
    id: backendMovie.id,
    title: backendMovie.title,
    year: backendMovie.release_year || backendMovie.year,
    categoryId: backendMovie.category_id,
    category: undefined,
    cover: buildCoverUrl(backendMovie, baseUrl),
    type: 'movie',
    rating: backendMovie.rating,
    duration: backendMovie.duration,
    seasons: backendMovie.seasons,
    episodes: backendMovie.episodes,
    _original: backendMovie,
  };

  if (categoryData) {
    if (Array.isArray(categoryData)) {
      const found = categoryData.find((c) => String(c.id) === String(backendMovie.category_id));
      movie.category = found?.label || found?.name;
    } else if (typeof categoryData === 'object') {
      movie.category = categoryData[backendMovie.category_id];
    }
  }

  return movie;
}

export { transformMovieData, buildCoverUrl };
