// src/services/Series/searchSeriesService.js
import axios from "axios";
import { environmentService } from "../environmentService";

const searchSeriesService = async (title) => {
    const { urlBackend } = environmentService();
    try {
        const response = await axios.get(`${urlBackend}/api/v1/series/search`, {
            params: { title },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error al buscar series:', error);
        throw error;
    }
};

export { searchSeriesService };