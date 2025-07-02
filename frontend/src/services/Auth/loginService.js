// ===== 1. LOGIN SERVICE CORREGIDO =====
// src/services/Auth/loginService.js (REEMPLAZAR EL EXISTENTE)

import { environmentService } from "../environmentService";

/**
 * Servicio para autenticación de usuarios - HOMOLOGADO
 * ✅ CORREGIDO: Respuesta estructurada para mejor manejo
 * @param {string} userValue - Username del usuario (ya usa userName correctamente)
 * @param {string} passValue - Contraseña del usuario
 * @returns {Promise<Object>} Respuesta estructurada del servidor
 */
const loginService = async (userValue, passValue) => {
    // 1. Obtener configuración del entorno
    const { urlBackend, apiKey } = environmentService();
    
    // 2. Configurar headers de la solicitud
    const myHeaders = new Headers();
    myHeaders.append("api", apiKey);
    myHeaders.append("Content-Type", "application/json");

    // 3. Crear cuerpo de la solicitud en formato JSON
    // ✅ YA ESTÁ CORRECTO: usa userName como espera el backend
    const raw = JSON.stringify({
        userName: userValue,
        password: passValue
    });

    // 4. Configuración completa de la solicitud
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
        credentials: 'include'
    };

    try {
        // 5. Realizar solicitud al endpoint de login
        const response = await fetch(`${urlBackend}/api/v1/auth/login`, requestOptions);
        
        // 6. Convertir respuesta a JSON
        const data = await response.json();
        
        console.log('Respuesta del backend login:', data);
        
        // ✅ MEJORADO: Estructurar respuesta para mejor manejo
        if (data?.sub) {
            return {
                success: true,
                user: data,
                message: 'Login exitoso'
            };
        } else {
            return {
                success: false,
                error: 'Credenciales incorrectas',
                message: 'Usuario o contraseña inválidos'
            };
        }
    } catch (error) {
        console.error('Error en loginService:', error);
        return {
            success: false,
            error: 'Error de conexión',
            message: 'No se pudo conectar con el servidor'
        };
    }
}

export { loginService };