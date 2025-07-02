// src/services/Categories/updateCategoryService.js (NUEVO)
import axios from "axios";
import { environmentService } from "../environmentService";

const updateCategoryService = async (id, name) => {
    const { urlBackend } = environmentService();
    try {
        const response = await axios.patch(`${urlBackend}/api/v1/category/${id}`, 
            { name },
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al actualizar categoría:", error);
        throw error;
    }
};

export { updateCategoryService };