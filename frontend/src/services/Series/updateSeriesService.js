// src/services/Series/updateSeriesService.js
import axios from "axios";
import { environmentService } from "../environmentService";

const updateSeriesService = async (id, seriesData) => {
    const { urlBackend } = environmentService();
    
    const formData = new FormData();
    if (seriesData.title) formData.append("title", seriesData.title);
    if (seriesData.categoryId) formData.append("categoryId", seriesData.categoryId);
    if (seriesData.releaseYear) formData.append("releaseYear", seriesData.releaseYear);
    if (seriesData.description) formData.append("description", seriesData.description);
    if (seriesData.coverImage) formData.append("coverImage", seriesData.coverImage);

    try {
        const response = await axios.patch(`${urlBackend}/api/v1/series/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar serie:", error);
        throw error;
    }
};

export { updateSeriesService };