// 1. MEJORAR registrationService.js
// src/services/Auth/registrationService.js - VERSIÓN MEJORADA

import { environmentService } from "../environmentService";

const registrationService = async (userData) => {
    const { urlBackend, apiKey } = environmentService();
    
    const myHeaders = new Headers();
    myHeaders.append("api", apiKey);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        userName: userData.username,
        password: userData.password
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch(`${urlBackend}/api/v1/auth/registration`, requestOptions);
        const data = await response.json();
        
        console.log('Respuesta del backend registration:', data);
        
        // ✅ MEJORADO: Manejo más específico de respuestas
        if (response.ok) {
            return {
                success: true,
                user: data,
                message: 'Usuario registrado exitosamente'
            };
        } else {
            // Manejo específico de errores del backend
            if (response.status === 409) {
                return {
                    success: false,
                    error: 'Usuario ya existe',
                    message: 'El nombre de usuario ya está registrado'
                };
            } else if (response.status === 400) {
                return {
                    success: false,
                    error: 'Datos inválidos',
                    message: data.message || 'Verifica los datos ingresados'
                };
            } else {
                return {
                    success: false,
                    error: 'Error del servidor',
                    message: 'Error interno del servidor'
                };
            }
        }
    } catch (error) {
        console.error('Error en registrationService:', error);
        return {
            success: false,
            error: 'Error de conexión',
            message: 'No se pudo conectar con el servidor'
        };
    }
}

export { registrationService };