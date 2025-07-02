// src/services/Episodes/createEpisodeService.js
import axios from "axios";
import { environmentService } from "../environmentService";

/**
 * Crear nuevo episodio
 * @param {Object} episodeData - Datos del episodio
 * @param {number} episodeData.serieId - ID de la serie
 * @param {number} episodeData.season - Temporada
 * @param {number} episodeData.episodeNumber - Número de episodio
 * @param {string} episodeData.title - Título del episodio
 * @param {string} episodeData.description - Descripción
 * @param {File} episodeData.video - Archivo de video
 */
const createEpisodeService = async (episodeData) => {
    const { urlBackend } = environmentService();
    
    const formData = new FormData();
    formData.append("serieId", episodeData.serieId);
    formData.append("season", episodeData.season);
    formData.append("episodeNumber", episodeData.episodeNumber);
    formData.append("title", episodeData.title);
    formData.append("description", episodeData.description || "");
    formData.append("video", episodeData.video);

    try {
        const response = await axios.post(`${urlBackend}/api/v1/episodes`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error al crear episodio:", error);
        throw error;
    }
};

export { createEpisodeService };