// src/services/Movies/searchMoviesService.js
import axios from "axios";
import { environmentService } from "../environmentService";

const searchMoviesService = async (title) => {
    const { urlBackend } = environmentService();
    try {
        const response = await axios.get(`${urlBackend}/api/v1/movies/search`, {
            params: { title },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error al buscar películas:', error);
        throw error;
    }
};

export { searchMoviesService };