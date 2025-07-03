// src/services/Categories/deleteCategoryService.js (NUEVO)
import axios from "axios";
import { environmentService } from "../environmentService";

const deleteCategoryService = async (id) => {
    const { urlBackend } = environmentService();
    try {
        const response = await axios.delete(`${urlBackend}/api/v1/category/${id}`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error al eliminar categoría:", error);
        throw error;
    }
};

export { deleteCategoryService };