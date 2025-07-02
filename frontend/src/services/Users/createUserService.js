// ===== 3. CREATE USER SERVICE CORREGIDO =====
// src/services/Users/createUserService.js (REEMPLAZAR EL EXISTENTE)

import axios from "axios";
import { environmentService } from "../environmentService";

/**
 * Crear nuevo usuario - HOMOLOGADO
 * ✅ CORREGIDO: Agregar campo userName que faltaba
 * @param {Object} userData - Datos del usuario
 * @param {string} userData.username - Username (será mapeado a userName)
 * @param {string} userData.email - Email del usuario
 * @param {string} userData.password - Contraseña del usuario
 * @param {number} userData.roleId - ID del rol del usuario
 */
const createUserService = async (userData) => {
    const { urlBackend } = environmentService();
    
    // ✅ ESTRUCTURA CORREGIDA: Agregar userName que faltaba
    const payload = {
        userName: userData.username,  // ✅ AGREGADO: Frontend 'username' → Backend 'userName'
        email: userData.email,
        password: userData.password,
        roleId: userData.roleId
    };
    
    console.log('Enviando al backend createUser:', payload);
    
    try {
        const response = await axios.post(`${urlBackend}/api/v1/users`, 
            payload,
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );
        
        console.log('Usuario creado exitosamente:', response.data);
        
        // ✅ MEJORADO: Respuesta estructurada
        return {
            success: true,
            data: response.data,
            message: 'Usuario creado exitosamente'
        };
    } catch (error) {
        console.error("Error al crear usuario:", error);
        
        // ✅ MEJORADO: Manejo de errores específicos
        if (error.response?.status === 409) {
            return {
                success: false,
                error: 'El username o email ya están registrados',
                code: 'DUPLICATE_USER'
            };
        }
        
        if (error.response?.status === 400) {
            return {
                success: false,
                error: 'Datos inválidos. Verifica los campos requeridos',
                code: 'VALIDATION_ERROR',
                details: error.response.data
            };
        }
        
        // ✅ AGREGAR: Manejo de sesión expirada
        if (error.response?.status === 401) {
            return {
                success: false,
                message: 'session expired',
                error: true
            };
        }
        
        return {
            success: false,
            error: error.response?.data?.message || 'Error al crear usuario',
            details: error.response?.data
        };
    }
};

export { createUserService };