// src/services/Movies/deleteMovieService.js
import axios from "axios";
import { environmentService } from "../environmentService";

const deleteMovieService = async (id) => {
    const { urlBackend } = environmentService();
    try {
        const response = await axios.delete(`${urlBackend}/api/v1/movies/${id}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error al eliminar película:", error);
        throw error;
    }
};

export { deleteMovieService };