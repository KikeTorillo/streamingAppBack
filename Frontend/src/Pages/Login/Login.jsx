// ===== LOGIN PAGE CORREGIDO =====
// src/Pages/Login/Login.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

// Servicios de autenticación
import { loginService } from "../../services/Auth/loginService";
import { recoveryService } from "../../services/Auth/recoveryService";

// Componente LoginCard del sistema de diseño
import { LoginCard } from "../../components/organism/LoginCard/LoginCard";
import './Login.css';

function Login() {
  // Estados de la UI
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  /**
   * ✅ CORREGIDO: Manejo de respuesta del loginService
   */
  const handleLoginSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await loginService(formData.username, formData.password);
      
      if (response.success && response.user?.sub) {
        // Guardar datos del usuario en sessionStorage
        sessionStorage.setItem('sessionUser', JSON.stringify(response.user));
        
        // Navegar a la página principal
        navigate('/main-page');
        
      } else {
        const errorMessage = response.message || response.error || 'Credenciales incorrectas';
        setError(errorMessage);
      }
      
    } catch (err) {
      console.error('Error en login:', err); // Solo este log es útil para debugging
      
      const errorMessage = err.message || 'Error de conexión. Inténtalo de nuevo.';
      setError(errorMessage);
      
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ✅ MEJORADO: Recovery con mejor manejo de errores
   */
  const handleForgotPassword = async (username) => {
    if (!username || username.trim() === '') {
      setError('Ingresa tu usuario para recuperar la contraseña.');
      return;
    }

    // Validación básica del username
    const userNameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!userNameRegex.test(username)) {
      setError('Usuario inválido. Solo letras, números, puntos, guiones y guiones bajos.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await recoveryService(username);
      setError('✅ Email de recuperación enviado. Revisa tu bandeja de entrada.');
      
    } catch (err) {
      console.error('Error en recovery:', err);
      setError('❌ Error al enviar email de recuperación.');
      
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ✅ NUEVO: Verificar si el usuario ya está logueado
   */
  useEffect(() => {
    const sessionUser = sessionStorage.getItem('sessionUser');
    if (sessionUser) {
      try {
        const user = JSON.parse(sessionUser);
        if (user?.sub) {
          navigate('/main-page');
        }
      } catch (err) {
        sessionStorage.removeItem('sessionUser');
      }
    }
  }, [navigate]);

  return (
    <div className="login-register-container">
      <div className="login-register-content">
        {/* Header con título de la app */}
        <div className="login-register-header">
          <h1 className="app-title">StreamingApp</h1>
          <p className="app-subtitle">Inicia sesión para continuar</p>
        </div>

        {/* LoginCard del sistema de diseño */}
        <LoginCard
          onSubmit={handleLoginSubmit}
          onForgotPassword={handleForgotPassword}
          loading={isLoading}
          error={error}
          size="lg"
          rounded="lg"
        />
      </div>
    </div>
  );
}

export { Login };