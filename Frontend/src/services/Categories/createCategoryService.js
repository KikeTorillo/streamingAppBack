// src/services/Categories/createCategoryService.js (NUEVO)
import axios from "axios";
import { environmentService } from "../environmentService";

const createCategoryService = async (categoryData) => {
    const { urlBackend } = environmentService();
    try {
        const response = await axios.post(`${urlBackend}/api/v1/category`, 
            { name: categoryData.name },
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al crear categoría:", error);
        throw error;
    }
};

export { createCategoryService };