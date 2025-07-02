const resetPassService = async (token, newPasswordValue) => {
    const { urlBackend, apiKey } = environmentService();
    
    const myHeaders = new Headers();
    myHeaders.append("api", apiKey);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        newPassword: newPasswordValue,
        token: token
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch(`${urlBackend}/api/v1/auth/change-password`, requestOptions);
        const data = await response.json();
        
        console.log('Respuesta del backend resetPass:', data);
        
        // ✅ MEJORADO: Respuesta estructurada
        if (response.ok) {
            return {
                success: true,
                message: 'Contraseña cambiada exitosamente'
            };
        } else {
            if (response.status === 401) {
                return {
                    success: false,
                    error: 'Token inválido',
                    message: 'El enlace ha expirado o es inválido'
                };
            } else if (response.status === 400) {
                return {
                    success: false,
                    error: 'Contraseña inválida',
                    message: 'La contraseña no cumple los requisitos'
                };
            } else {
                return {
                    success: false,
                    error: 'Error del servidor',
                    message: data.message || 'Error al cambiar contraseña'
                };
            }
        }
    } catch (error) {
        console.error('Error en resetPassService:', error);
        return {
            success: false,
            error: 'Error de conexión',
            message: 'No se pudo conectar con el servidor'
        };
    }
}

export { resetPassService };
