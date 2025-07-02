// src/services/Series/getSeriesService.js
import axios from "axios";
import { environmentService } from "../environmentService";

const getSeriesService = async () => {
    const { urlBackend } = environmentService();
    try {
        const response = await axios.get(`${urlBackend}/api/v1/series`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener series:', error);
        throw error;
    }
};

export { getSeriesService };