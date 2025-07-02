// src/services/Episodes/deleteEpisodeService.js
import axios from "axios";
import { environmentService } from "../environmentService";

const deleteEpisodeService = async (id) => {
    const { urlBackend } = environmentService();
    try {
        const response = await axios.delete(`${urlBackend}/api/v1/episodes/${id}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error al eliminar episodio:", error);
        throw error;
    }
};

export { deleteEpisodeService };