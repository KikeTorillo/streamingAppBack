// environmentService.js

/**
 * Servicio de configuración de entorno para múltiples ambientes
 * @returns {Object} Configuración de URLs y API Key según el entorno
 */
function environmentService() {
    // 1. Obtener variables de entorno
    const mode = import.meta.env.VITE_MODE; // Modo de ejecución (local/producción)
    const apiKey = import.meta.env.VITE_API_KEY; // Clave API para servicios backend

    // 2. Inicializar URLs con valores por defecto
    let urlBackend = '';
    let urlFront = '';

    // 3. Configuración condicional según entorno
    if (mode !== 'local') {
        // Configuración para entornos de producción/develop
        urlBackend = import.meta.env.VITE_HOST_VERCEL; // URL del backend en Vercel
        urlFront = import.meta.env.VITE_FRONT_URL_PROD; // URL del frontend en producción
    } else {
        // Configuración para entorno local
        urlBackend = import.meta.env.VITE_HOST_LOCAL; // URL local del backend
        urlFront = import.meta.env.VITE_FRONT_URL_LOCAL; // URL local del frontend
    }

    // 4. Retornar configuración consolidada
    return {
        urlFront, // URL del frontend
        urlBackend, // URL del backend
        apiKey // Clave de autenticación
    };
}

export { environmentService };