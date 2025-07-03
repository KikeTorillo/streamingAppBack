// ===== TMDB SERVICE - INTEGRACIÓN REAL CON API DE TMDB =====
// src/services/tmdb/TMDBService.js

/**
 * TMDBService - Servicio para integración con The Movie Database API
 * ✅ VARIABLES DE ENTORNO: Usa VITE_TMDB_API_KEY automáticamente
 * ✅ BÚSQUEDA MULTI-CONTENIDO: Películas, series o ambos
 * ✅ MANEJO DE ERRORES: Respuestas estructuradas y logs
 * ✅ TRANSFORMACIÓN DE DATOS: Formato consistente para el frontend
 */
class TMDBService {
  constructor() {
    // Obtener API key desde variables de entorno
    this.apiKey = import.meta.env.VITE_TMDB_API_KEY;
    this.baseUrl = 'https://api.themoviedb.org/3';
    this.imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

    // Verificar que la API key existe
    if (!this.apiKey) {
      console.error('❌ TMDB API Key no encontrada en variables de entorno');
      console.log('💡 Asegúrate de tener VITE_TMDB_API_KEY en tu archivo .env');
    }
  }

  /**
   * Buscar contenido en TMDB
   * @param {string} query - Término de búsqueda
   * @param {string} contentType - 'all', 'movie', 'tv'
   * @param {object} options - Opciones adicionales (page, sort_by, etc.)
   * @returns {Promise<Array>} Array de resultados transformados
   */
  async searchContent(query, contentType = 'all', options = {}) {
    try {
      if (!this.apiKey) {
        throw new Error('API Key de TMDB no configurada');
      }

      if (!query || query.trim().length < 2) {
        throw new Error('El término de búsqueda debe tener al menos 2 caracteres');
      }

      console.log(`🔍 Buscando en TMDB: "${query}" (tipo: ${contentType})`);

      let results = [];

      // Decidir qué endpoints usar según el tipo de contenido
      if (contentType === 'all' || contentType === 'movie') {
        const movieResults = await this.searchMovies(query, options);
        results = [...results, ...movieResults];
      }

      if (contentType === 'all' || contentType === 'tv') {
        const tvResults = await this.searchTV(query, options);
        results = [...results, ...tvResults];
      }

      // Ordenar resultados por popularidad y fecha
      results = this.sortResults(results, options.sortBy || 'popularity');

      console.log(`✅ TMDB: Encontrados ${results.length} resultados`);
      return results;

    } catch (error) {
      console.error('❌ Error en búsqueda TMDB:', error.message);
      throw new Error(`Error al buscar en TMDB: ${error.message}`);
    }
  }

  /**
   * Buscar películas específicamente
   */
  async searchMovies(query, options = {}) {
    const params = new URLSearchParams({
      api_key: this.apiKey,
      query: query.trim(),
      language: 'es-ES',
      page: options.page || 1,
      include_adult: false
    });

    const url = `${this.baseUrl}/search/movie?${params}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results.map(item => this.transformMovieData(item));
  }

  /**
   * Buscar series específicamente
   */
  async searchTV(query, options = {}) {
    const params = new URLSearchParams({
      api_key: this.apiKey,
      query: query.trim(),
      language: 'es-ES',
      page: options.page || 1,
      include_adult: false
    });

    const url = `${this.baseUrl}/search/tv?${params}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results.map(item => this.transformTVData(item));
  }

  /**
   * Obtener detalles completos de una película
   */
  async getMovieDetails(tmdbId) {
    try {
      const params = new URLSearchParams({
        api_key: this.apiKey,
        language: 'es-ES',
        append_to_response: 'credits,videos,images'
      });

      const url = `${this.baseUrl}/movie/${tmdbId}?${params}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }

      const data = await response.json();
      return this.transformMovieData(data, true);

    } catch (error) {
      console.error('❌ Error obteniendo detalles de película:', error);
      throw error;
    }
  }

  /**
   * Obtener detalles completos de una serie
   */
  async getTVDetails(tmdbId) {
    try {
      const params = new URLSearchParams({
        api_key: this.apiKey,
        language: 'es-ES',
        append_to_response: 'credits,videos,images'
      });

      const url = `${this.baseUrl}/tv/${tmdbId}?${params}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }

      const data = await response.json();
      return this.transformTVData(data, true);

    } catch (error) {
      console.error('❌ Error obteniendo detalles de serie:', error);
      throw error;
    }
  }

  /**
   * Transformar datos de película al formato del frontend
   */
  transformMovieData(item, isDetailed = false) {
    return {
      id: item.id,
      tmdb_id: item.id,
      title: item.title,
      original_title: item.original_title,
      type: 'movie',
      media_type: 'movie',
      year: item.release_date ? new Date(item.release_date).getFullYear() : 'N/A',
      release_date: item.release_date,
      rating: item.vote_average ? Math.round(item.vote_average * 10) / 10 : 'N/A',
      popularity: item.popularity || 0,
      overview: item.overview || 'Sin descripción disponible',
      poster_path: item.poster_path ? `${this.imageBaseUrl}${item.poster_path}` : null,
      backdrop_path: item.backdrop_path ? `${this.imageBaseUrl}${item.backdrop_path}` : null,
      genre_ids: item.genre_ids || [],
      // Datos adicionales para detalles completos
      ...(isDetailed && {
        genres: item.genres || [],
        runtime: item.runtime,
        budget: item.budget,
        revenue: item.revenue,
        credits: item.credits,
        videos: item.videos,
        images: item.images
      })
    };
  }

  /**
   * Transformar datos de serie al formato del frontend
   */
  transformTVData(item, isDetailed = false) {
    return {
      id: item.id,
      tmdb_id: item.id,
      title: item.name,
      name: item.name,
      original_title: item.original_name,
      original_name: item.original_name,
      type: 'tv',
      media_type: 'tv',
      year: item.first_air_date ? new Date(item.first_air_date).getFullYear() : 'N/A',
      first_air_date: item.first_air_date,
      last_air_date: item.last_air_date,
      rating: item.vote_average ? Math.round(item.vote_average * 10) / 10 : 'N/A',
      popularity: item.popularity || 0,
      overview: item.overview || 'Sin descripción disponible',
      poster_path: item.poster_path ? `${this.imageBaseUrl}${item.poster_path}` : null,
      backdrop_path: item.backdrop_path ? `${this.imageBaseUrl}${item.backdrop_path}` : null,
      genre_ids: item.genre_ids || [],
      // Datos adicionales para detalles completos
      ...(isDetailed && {
        genres: item.genres || [],
        number_of_seasons: item.number_of_seasons,
        number_of_episodes: item.number_of_episodes,
        episode_run_time: item.episode_run_time,
        networks: item.networks,
        created_by: item.created_by,
        credits: item.credits,
        videos: item.videos,
        images: item.images
      })
    };
  }

  /**
   * Ordenar resultados según criterio
   */
  sortResults(results, sortBy) {
    switch (sortBy) {
      case 'year-desc':
        return results.sort((a, b) => {
          const yearA = parseInt(a.year) || 0;
          const yearB = parseInt(b.year) || 0;
          return yearB - yearA;
        });
        
      case 'year-asc':
        return results.sort((a, b) => {
          const yearA = parseInt(a.year) || 0;
          const yearB = parseInt(b.year) || 0;
          return yearA - yearB;
        });
        
      case 'rating-desc':
        return results.sort((a, b) => {
          const ratingA = typeof a.rating === 'number' ? a.rating : 0;
          const ratingB = typeof b.rating === 'number' ? b.rating : 0;
          return ratingB - ratingA;
        });
        
      case 'popularity':
      default:
        return results.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }
  }

  /**
   * Obtener configuración de TMDB (géneros, idiomas, etc.)
   */
  async getConfiguration() {
    try {
      const params = new URLSearchParams({
        api_key: this.apiKey
      });

      const [configResponse, genresMovieResponse, genresTVResponse] = await Promise.all([
        fetch(`${this.baseUrl}/configuration?${params}`),
        fetch(`${this.baseUrl}/genre/movie/list?${params}&language=es-ES`),
        fetch(`${this.baseUrl}/genre/tv/list?${params}&language=es-ES`)
      ]);

      const [config, genresMovie, genresTV] = await Promise.all([
        configResponse.json(),
        genresMovieResponse.json(),
        genresTVResponse.json()
      ]);

      return {
        images: config.images,
        genres: {
          movie: genresMovie.genres || [],
          tv: genresTV.genres || []
        }
      };

    } catch (error) {
      console.error('❌ Error obteniendo configuración TMDB:', error);
      return null;
    }
  }
}

// Exportar instancia singleton
export const tmdbService = new TMDBService();
export { TMDBService };