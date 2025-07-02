// src/services/Episodes/getEpisodesService.js
import axios from "axios";
import { environmentService } from "../environmentService";

/**
 * Obtener episodios con filtros opcionales
 * @param {Object} filters - Filtros de búsqueda
 * @param {number} filters.serieId - ID de la serie (requerido)
 * @param {number} [filters.season] - Temporada específica
 * @param {number} [filters.episodeNumber] - Número de episodio específico
 */
const getEpisodesService = async (filters = {}) => {
    const { urlBackend } = environmentService();
    try {
        const response = await axios.get(`${urlBackend}/api/v1/episodes`, {
            params: filters,
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener episodios:', error);
        throw error;
    }
};

export { getEpisodesService };