// ===== 5. UPDATE USER SERVICE CORREGIDO =====
// src/services/Users/updateUserService.js (REEMPLAZAR EL EXISTENTE)

import axios from "axios";
import { environmentService } from "../environmentService";

/**
 * Actualizar usuario - HOMOLOGADO
 * ✅ CORREGIDO: Agregar campo userName para actualización
 */
const updateUserService = async (id, userData) => {
    const { urlBackend } = environmentService();
    
    // ✅ CORREGIDO: Incluir userName en actualizaciones
    const updateData = {};
    if (userData.username) updateData.userName = userData.username; // ✅ AGREGADO
    if (userData.email) updateData.email = userData.email;
    if (userData.roleId) updateData.roleId = userData.roleId;
    
    console.log('Actualizando usuario:', id, updateData);

    try {
        const response = await axios.patch(`${urlBackend}/api/v1/users/${id}`, 
            updateData,
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );
        
        console.log('Usuario actualizado exitosamente:', response.data);
        
        // ✅ MEJORADO: Respuesta estructurada
        return {
            success: true,
            data: response.data,
            message: 'Usuario actualizado exitosamente'
        };
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        
        // ✅ MEJORADO: Manejo específico de errores
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
                error: 'Usuario no encontrado',
                code: 'USER_NOT_FOUND'
            };
        }
        
        return {
            success: false,
            error: error.response?.data?.message || 'Error al actualizar usuario',
            details: error.response?.data
        };
    }
};

export { updateUserService };