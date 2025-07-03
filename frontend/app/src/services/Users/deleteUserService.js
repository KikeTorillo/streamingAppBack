// ===== 6. DELETE USER SERVICE MEJORADO =====
// src/services/Users/deleteUserService.js (CREAR NUEVO)

import axios from "axios";
import { environmentService } from "../environmentService";

/**
 * Eliminar usuario - HOMOLOGADO
 * ✅ NUEVO: Servicio faltante con manejo completo de errores
 */
const deleteUserService = async (id) => {
    const { urlBackend } = environmentService();
    
    console.log('Eliminando usuario:', id);
    
    try {
        const response = await axios.delete(`${urlBackend}/api/v1/users/${id}`, {
            withCredentials: true,
        });
        
        console.log('Usuario eliminado exitosamente:', response.data);
        
        return {
            success: true,
            message: 'Usuario eliminado exitosamente'
        };
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        
        // ✅ MANEJO ESPECÍFICO de errores
        if (error.response?.status === 401) {
            return {
                success: false,
                message: 'session expired',
                error: true
            };
        }
        
        if (error.response?.status === 404) {
            return {
                success: false,
                error: 'El usuario no existe o ya fue eliminado',
                code: 'USER_NOT_FOUND'
            };
        }
        
        if (error.response?.status === 403) {
            return {
                success: false,
                error: 'No tienes permisos para eliminar este usuario',
                code: 'INSUFFICIENT_PERMISSIONS'
            };
        }
        
        return {
            success: false,
            error: error.response?.data?.message || 'Error al eliminar usuario',
            details: error.response?.data
        };
    }
};

export { deleteUserService };