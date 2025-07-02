// src/services/Movies/updateMovieService.js
import axios from "axios";
import { environmentService } from "../environmentService";

const updateMovieService = async (id, movieData) => {
    const { urlBackend } = environmentService();
    
    const formData = new FormData();
    if (movieData.title) formData.append("title", movieData.title);
    if (movieData.categoryId) formData.append("categoryId", movieData.categoryId);
    if (movieData.releaseYear) formData.append("releaseYear", movieData.releaseYear);
    if (movieData.description) formData.append("description", movieData.description);
    if (movieData.coverImage) formData.append("coverImage", movieData.coverImage);

    try {
        const response = await axios.patch(`${urlBackend}/api/v1/movies/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar película:", error);
        throw error;
    }
};

export { updateMovieService };