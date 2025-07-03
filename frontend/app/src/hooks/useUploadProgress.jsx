// src/hooks/useUploadProgress.jsx
import { useState } from "react";
import axios from "axios";
import { environmentService } from "../services/environmentService";

const useUploadProgress = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // 'idle', 'processing', 'transcoding', 'completed', 'failed'
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const monitorProgress = (taskId, contentType, onStatusChange, onFinish) => {
    // ✅ ACTUALIZADO: Usar environmentService en lugar de URL hardcodeada
    const { urlBackend } = environmentService();
    
    let progressEndpoint;
    if (contentType === 'movies') {
      progressEndpoint = `${urlBackend}/api/v1/movies/progress/${taskId}`;
    } else if (contentType === 'episodes') {
      // ✅ NUEVO: Endpoint específico para episodios
      progressEndpoint = `${urlBackend}/api/v1/episodes/progress/${taskId}`;
    } else {
      // Para series y otros tipos
      progressEndpoint = `${urlBackend}/api/v1/series/progress/${taskId}`;
    }

    console.log('🔄 Iniciando monitoreo de progreso:', {
      taskId,
      contentType,
      endpoint: progressEndpoint
    });

    // Reset estados
    setProgress(0);
    setStatus('processing');
    setMessage('Preparando archivos...');
    setError(null);

    const interval = setInterval(async () => {
      try {
        const response = await axios.get(progressEndpoint, {
          withCredentials: true,
          timeout: 10000 // 10 segundos timeout
        });
        
        const { status: taskStatus, progress: currentProgress, error: taskError } = response.data;
        
        console.log('📊 Progreso actualizado:', {
          status: taskStatus,
          progress: currentProgress,
          error: taskError
        });

        // Actualizar estados
        setProgress(currentProgress || 0);
        setStatus(taskStatus);

        // Actualizar mensaje según estado
        if (taskStatus === 'processing') {
          setMessage('Preparando archivos...');
        } else if (taskStatus === 'transcoding') {
          setMessage(`Transcodificando video... ${currentProgress || 0}%`);
        } else if (taskStatus === 'completed') {
          setMessage('¡Procesamiento completado!');
          setProgress(100);
          clearInterval(interval);
          
          console.log('✅ Transcodificación completada');
          onStatusChange?.('Transcodificación completada exitosamente');
          onFinish?.(true, null);
          
        } else if (taskStatus === 'failed') {
          const errorMessage = taskError || 'Error desconocido en el procesamiento';
          setMessage(`Error: ${errorMessage}`);
          setError(errorMessage);
          clearInterval(interval);
          
          console.error('❌ Transcodificación falló:', errorMessage);
          onStatusChange?.(`Error: ${errorMessage}`);
          onFinish?.(false, errorMessage);
        }

        // Callback opcional para cambios de estado
        onStatusChange?.(taskStatus);

      } catch (error) {
        console.error('❌ Error consultando progreso:', error);
        
        const errorMessage = error.response?.status === 404 
          ? 'Tarea no encontrada' 
          : 'Error de conexión consultando progreso';
          
        setMessage(errorMessage);
        setError(errorMessage);
        setStatus('failed');
        clearInterval(interval);
        
        onStatusChange?.(errorMessage);
        onFinish?.(false, errorMessage);
      }
    }, 1000); // Consultar cada segundo

    // Retornar función para cancelar monitoreo
    return () => {
      clearInterval(interval);
      console.log('🛑 Monitoreo de progreso cancelado');
    };
  };

  // Función para resetear estados
  const resetProgress = () => {
    setProgress(0);
    setStatus('idle');
    setMessage('');
    setError(null);
  };

  return { 
    progress, 
    status, 
    message, 
    error,
    monitorProgress,
    resetProgress
  };
};

export { useUploadProgress };