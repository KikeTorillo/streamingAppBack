// src/services/Movies/getMoviesService.js
import axios from "axios";
import { environmentService } from "../environmentService";

const getMoviesService = async () => {
    const { urlBackend } = environmentService();
    try {
        const response = await axios.get(`${urlBackend}/api/v1/movies`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener películas:', error);
        throw error;
    }
};

export { getMoviesService };