// src/services/Users/getUserByIdService.js (NUEVO)
import axios from "axios";
import { environmentService } from "../environmentService";

/**
 * Obtener usuario por ID
 * Endpoint: GET /api/v1/users/{id} (según Bruno)
 */
const getUserByIdService = async (id) => {
    const { urlBackend } = environmentService();
    try {
        const response = await axios.get(`${urlBackend}/api/v1/users/${id}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        throw error;
    }
};

export { getUserByIdService };
