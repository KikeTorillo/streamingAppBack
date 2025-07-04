// environmentService.js - VERSIÓN CORREGIDA PARA PRODUCCIÓN

/**
 * Servicio de configuración de entorno para múltiples ambientes
 * ✅ CORREGIDO: Detecta automáticamente si está en producción o desarrollo
 * ✅ SOLUCIÓN: URLs relativas en producción, absolutas en desarrollo
 * @returns {Object} Configuración de URLs y API Key según el entorno
 */
function environmentService() {
    // 1. Detectar entorno actual
    const isDevelopment = import.meta.env.DEV;
    const isProduction = import.meta.env.PROD;
    
    // 2. Variables de entorno (disponibles en desarrollo)
    const viteMode = import.meta.env.VITE_MODE;
    const viteApiKey = import.meta.env.VITE_API_KEY;
    const viteHostLocal = import.meta.env.VITE_HOST_LOCAL;
    const viteFrontLocal = import.meta.env.VITE_FRONT_URL_LOCAL;
    const viteTmdbKey = import.meta.env.VITE_TMDB_API_KEY;

    console.log('🔍 Environment Debug:', {
        isDevelopment,
        isProduction,
        viteMode,
        hasApiKey: !!viteApiKey,
        hasHostLocal: !!viteHostLocal,
        hasTmdbKey: !!viteTmdbKey
    });

    // 3. Configuración según entorno
    let urlBackend, urlFront, apiKey, tmdbApiKey;

    if (isDevelopment) {
        // 🔧 DESARROLLO: Usar variables VITE_* completas
        urlBackend = viteHostLocal || 'http://localhost:3000';
        urlFront = viteFrontLocal || 'http://localhost:5173';
        apiKey = viteApiKey || '1ogC7RKV419Y5XssdtcvmuRJ8RcCu451a';
        tmdbApiKey = viteTmdbKey || '';
        
        console.log('🔧 Modo DESARROLLO detectado');
    } else {
        // 🏠 PRODUCCIÓN: URLs relativas + valores por defecto
        urlBackend = '';  // ← CLAVE: URL relativa para que NGINX haga proxy
        urlFront = window.location.origin;  // URL actual del browser
        apiKey = '1ogC7RKV419Y5XssdtcvmuRJ8RcCu451a';  // Valor por defecto
        tmdbApiKey = 'f31b2f3b55906ce54efce57ec7b5c0b7fsdfsd';  // Valor por defecto
        
        console.log('🏠 Modo PRODUCCIÓN detectado');
    }

    // 4. Configuración consolidada
    const config = {
        // URLs principales
        urlFront,
        urlBackend,
        
        // API Keys
        apiKey,
        tmdbApiKey,
        
        // Metadatos del entorno
        environment: isDevelopment ? 'development' : 'production',
        isDevelopment,
        isProduction,
        
        // Utilidades
        getApiUrl: (endpoint) => {
            const baseUrl = urlBackend || '';
            const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
            return `${baseUrl}${cleanEndpoint}`;
        },
        
        // Debug info (solo en desarrollo)
        ...(isDevelopment && {
            _debug: {
                viteVars: {
                    VITE_MODE: viteMode,
                    VITE_API_KEY: viteApiKey,
                    VITE_HOST_LOCAL: viteHostLocal,
                    VITE_TMDB_API_KEY: viteTmdbKey
                }
            }
        })
    };

    console.log('📋 Configuración final:', {
        environment: config.environment,
        urlBackend: config.urlBackend,
        urlFront: config.urlFront,
        hasApiKey: !!config.apiKey,
        hasTmdbKey: !!config.tmdbApiKey
    });

    return config;
}

export { environmentService };