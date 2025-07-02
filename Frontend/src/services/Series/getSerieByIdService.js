// src/services/Series/getSerieByIdService.js
import axios from "axios";
import { environmentService } from "../environmentService";

const getSerieByIdService = async (serieId) => {
  try {
    const { urlBackend } = environmentService();
    console.log(`[getSerieByIdService] URL Backend: ${urlBackend}`);
    console.log(`[getSerieByIdService] Buscando serie con ID: ${serieId}`);
    
    // ✅ URL CORREGIDA: incluye /v1 en la ruta
    const fullUrl = `${urlBackend}/api/v1/series/${serieId}`;
    console.log(`[getSerieByIdService] URL Completa: ${fullUrl}`);
    
    const response = await axios.get(fullUrl, {
      withCredentials: true,
    });

    console.log('[getSerieByIdService] Response:', response.data);
    
    return {
      success: true,
      data: response.data,
      message: 'Serie obtenida exitosamente'
    };
    
  } catch (error) {
    console.error('[getSerieByIdService] Error:', error);
    
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Error al obtener la serie'
    };
  }
};

export { getSerieByIdService };