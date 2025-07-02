// src/services/Episodes/getEpisodesBySerieService.js
// ✅ REUTILIZAR el servicio existente
import { getEpisodesService } from './getEpisodesService'; // Asumiendo que ya lo tienes

const getEpisodesBySerieService = async (serieId) => {
  try {
    console.log(`[getEpisodesBySerieService] Buscando episodios para serie ID: ${serieId}`);
    
    // ✅ Usar el servicio existente con el filtro de serieId
    const episodes = await getEpisodesService({ serieId });
    
    console.log('[getEpisodesBySerieService] Episodes found:', episodes);
    
    return {
      success: true,
      data: Array.isArray(episodes) ? episodes : episodes.data || [],
      message: 'Episodios obtenidos exitosamente'
    };
    
  } catch (error) {
    console.error('[getEpisodesBySerieService] Error:', error);
    
    return {
      success: false,
      data: [],
      message: error.message || 'Error al obtener episodios'
    };
  }
};

export { getEpisodesBySerieService };