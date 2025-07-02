// src/services/Episodes/updateEpisodeService.js
import axios from "axios";
import { environmentService } from "../environmentService";

const updateEpisodeService = async (id, episodeData) => {
    const { urlBackend } = environmentService();
    
    const formData = new FormData();
    if (episodeData.season) formData.append("season", episodeData.season);
    if (episodeData.serieId) formData.append("serieId", episodeData.serieId);
    if (episodeData.episodeNumber) formData.append("episodeNumber", episodeData.episodeNumber);
    if (episodeData.title) formData.append("title", episodeData.title);
    if (episodeData.description) formData.append("description", episodeData.description);

    try {
        const response = await axios.patch(`${urlBackend}/api/v1/episodes/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar episodio:", error);
        throw error;
    }
};

export { updateEpisodeService };