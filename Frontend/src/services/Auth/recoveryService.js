// src/services/Auth/recoveryService.js - VERSIÓN MEJORADA

const recoveryService = async (emailValue) => {
    const { urlBackend, apiKey } = environmentService();
    
    const myHeaders = new Headers();
    myHeaders.append("api", apiKey);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        email: emailValue
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch(`${urlBackend}/api/v1/auth/recovery`, requestOptions);
        const data = await response.json();
        
        console.log('Respuesta del backend recovery:', data);
        
        // ✅ MEJORADO: Respuesta estructurada
        if (response.ok) {
            return {
                success: true,
                message: 'Email de recuperación enviado correctamente'
            };
        } else {
            if (response.status === 404) {
                return {
                    success: false,
                    error: 'Email no encontrado',
                    message: 'No existe una cuenta con ese email'
                };
            } else {
                return {
                    success: false,
                    error: 'Error del servidor',
                    message: data.message || 'Error al enviar email'
                };
            }
        }
    } catch (error) {
        console.error('Error en recoveryService:', error);
        return {
            success: false,
            error: 'Error de conexión',
            message: 'No se pudo conectar con el servidor'
        };
    }
}

export { recoveryService };


