// ===== EPISODES CREATE PAGE - CON SISTEMA DE PROGRESO =====
// src/Pages/Admin/Episodes/EpisodesCreatePage/EpisodesCreatePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { Container } from '../../../../components/atoms/Container/Container';
import { DynamicForm } from '../../../../components/molecules/DynamicForm/DynamicForm';
import { Button } from '../../../../components/atoms/Button/Button';
import { UploadProgress } from "../../../../components/atoms/UploadProgress/UploadProgress";
import { useUploadProgress } from "../../../../hooks/useUploadProgress";
import './EpisodesCreatePage.css';

// Servicios
import { createEpisodeService } from '../../../../services/Episodes/createEpisodeService';
import { getSeriesService } from '../../../../services/Series/getSeriesService';

/**
 * EpisodesCreatePage - CON SISTEMA DE PROGRESO DE CARGA
 * 
 * ✅ SISTEMA DE DISEÑO: Solo componentes con stories de Storybook
 * ✅ PATRÓN: Sigue el mismo patrón que MovieCreatePage
 * ✅ PROGRESO: Sistema completo de monitoreo de transcodificación
 * ✅ BACKEND: Homologado con createEpisodeService existente
 * ✅ CONVENCIONES: Export con función nombrada según reglas del proyecto
 * ✅ FILOSOFÍA: Solución simple y directa sin over-engineering
 */
function EpisodesCreatePage() {
  const navigate = useNavigate();

  // ===== ESTADOS =====
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Estados para series (requeridas para episodios)
  const [series, setSeries] = useState([]);
  const [seriesLoading, setSeriesLoading] = useState(true);
  const [seriesError, setSeriesError] = useState(null);

  // ===== HOOK DE PROGRESO DE UPLOAD =====
  const { progress, status, message, error: progressError, monitorProgress, resetProgress } = useUploadProgress();

  // ===== CARGAR SERIES AL MONTAR COMPONENTE =====
  useEffect(() => {
    loadSeries();
  }, []);

  /**
   * Cargar lista de series disponibles
   */
  const loadSeries = async () => {
    try {
      setSeriesLoading(true);
      setSeriesError(null);
      
      console.log('📺 Cargando series disponibles...');
      const response = await getSeriesService();
      const seriesData = response?.data || response || [];
      
      console.log(`✅ Series cargadas: ${seriesData.length} elementos`);
      setSeries(seriesData);
      
    } catch (err) {
      console.error('❌ Error al cargar series:', err);
      setSeriesError('Error al cargar las series disponibles');
    } finally {
      setSeriesLoading(false);
    }
  };

  // ===== CONFIGURACIÓN DEL FORMULARIO =====
  
  /**
   * Campos del formulario según schema del backend
   * Basado en: serieId, season, episodeNumber, title, description, video
   */
  const episodeFormFields = [
    {
      name: 'serieId',
      type: 'select',
      label: (() => {
        if (seriesLoading) return '⏳ Cargando series...';
        if (seriesError) return '❌ Error al cargar series';
        if (series.length === 0) return '📺 Sin series disponibles - Ve a Administrar > Series para crear una.';
        return `📺 Serie * (${series.length} disponibles)`;
      })(),
      placeholder: seriesLoading ? 'Cargando series...' : 'Selecciona la serie',
      required: true,
      leftIcon: '📺',
      options: series.map(serie => ({
        value: serie.id,
        label: `${serie.title} (${serie.release_year || 'Sin año'})`
      })),
      disabled: seriesLoading || series.length === 0,
      helperText: seriesError || 'Serie a la que pertenece este episodio',
      validation: {
        required: { value: true, message: 'Debes seleccionar una serie' }
      }
    },
    {
      name: 'season',
      type: 'number',
      label: 'Temporada *',
      placeholder: 'Ej: 1, 2, 3...',
      required: true,
      min: 1,
      max: 99,
      leftIcon: '🎬',
      helperText: 'Número de temporada (debe ser mayor a 0)',
      validation: {
        required: { value: true, message: 'La temporada es obligatoria' },
        min: { value: 1, message: 'La temporada debe ser mayor a 0' },
        max: { value: 99, message: 'Máximo 99 temporadas' }
      }
    },
    {
      name: 'episodeNumber',
      type: 'number',
      label: 'Número de Episodio *',
      placeholder: 'Ej: 1, 2, 3...',
      required: true,
      min: 1,
      max: 999,
      leftIcon: '🎭',
      helperText: 'Número del episodio dentro de la temporada',
      validation: {
        required: { value: true, message: 'El número de episodio es obligatorio' },
        min: { value: 1, message: 'El episodio debe ser mayor a 0' },
        max: { value: 999, message: 'Máximo 999 episodios por temporada' }
      }
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título del Episodio',
      placeholder: 'Ej: Piloto, El comienzo, La venganza...',
      leftIcon: '🏷️',
      helperText: 'Título específico del episodio (opcional)',
      maxLength: 255,
      validation: {
        maxLength: { value: 255, message: 'Máximo 255 caracteres' }
      }
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción',
      placeholder: 'Describe brevemente lo que sucede en este episodio...',
      rows: 4,
      leftIcon: '📝',
      helperText: 'Descripción opcional del episodio',
      validation: {
        maxLength: { value: 1000, message: 'Máximo 1000 caracteres' }
      }
    },
    {
      name: 'video',
      type: 'file',
      label: 'Archivo de Video *',
      accept: 'video/*',
      required: true,
      leftIcon: '🎥',
      helperText: 'Archivo de video del episodio (formatos: MP4, AVI, MKV, etc.)',
      validation: {
        required: { value: true, message: 'El archivo de video es obligatorio' }
      }
    }
  ];

  /**
   * Datos iniciales del formulario
   */
  const initialData = {
    serieId: '',
    season: 1,
    episodeNumber: 1,
    title: '',
    description: '',
    video: null
  };

  // ===== FUNCIONES =====

  /**
   * Limpiar errores
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Navegar de vuelta
   */
  const handleGoBack = () => {
    if (hasChanges && !success) {
      const confirmed = window.confirm(
        '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.'
      );
      if (!confirmed) return;
    }
    
    navigate('/admin/episodes');
  };

  /**
   * Detectar cambios en el formulario
   */
  const handleFormChange = (formData) => {
    const hasData = Object.values(formData).some(value => {
      if (value instanceof File) return true;
      return value && value.toString().trim() !== '';
    });
    setHasChanges(hasData);
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) {
      clearError();
    }
  };

  /**
   * Enviar formulario con sistema de progreso
   */
  const handleSubmit = async (formData) => {
    setError(null);
    setLoading(true);
    resetProgress(); // Resetear progreso anterior

    try {
      console.log('📤 Enviando datos del episodio:', formData);

      // Preparar datos para el backend
      const episodeData = {
        serieId: parseInt(formData.serieId),
        season: parseInt(formData.season),
        episodeNumber: parseInt(formData.episodeNumber),
        title: formData.title?.trim() || '',
        description: formData.description?.trim() || '',
        video: formData.video
      };

      console.log('📤 Datos procesados:', episodeData);

      const result = await createEpisodeService(episodeData);

      console.log('✅ Respuesta del backend:', result);

      // ===== MANEJO DE PROGRESO =====
      if (result?.taskId) {
        console.log('🔄 TaskId recibido, iniciando monitoreo:', result.taskId);
        
        // Iniciar monitoreo del progreso
        const cancelMonitoring = monitorProgress(
          result.taskId,
          'episodes', // Tipo de contenido
          (newStatus) => {
            console.log('📊 Cambio de estado:', newStatus);
          },
          (success, error) => {
            console.log('🏁 Proceso terminado:', { success, error });
            setLoading(false);
            
            if (success) {
              setSuccess(true);
              setHasChanges(false);
              
              // Redireccionar después de 3 segundos
              setTimeout(() => {
                navigate('/admin/episodes');
              }, 3000);
            } else {
              setError(error || 'Error en el procesamiento del video');
            }
          }
        );

        // Limpiar el monitoreo cuando el componente se desmonte
        return () => {
          if (cancelMonitoring) {
            cancelMonitoring();
          }
        };

      } else {
        // Si no hay taskId, el episodio se creó directamente
        console.log('✅ Episodio creado exitosamente sin transcodificación');
        setSuccess(true);
        setHasChanges(false);
        setLoading(false);

        // Redireccionar después de 3 segundos
        setTimeout(() => {
          navigate('/admin/episodes');
        }, 3000);
      }

    } catch (err) {
      console.error('❌ Error al crear episodio:', err);
      setLoading(false);
      
      // Formatear error para el usuario
      let errorMessage = 'Error inesperado al crear el episodio';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      // Manejo específico de errores comunes
      if (errorMessage.includes('duplicate') || errorMessage.includes('ya existe')) {
        errorMessage = 'Ya existe un episodio con esa temporada y número en la serie seleccionada.';
      } else if (errorMessage.includes('validation')) {
        errorMessage = 'Los datos ingresados no son válidos. Revisa el formulario.';
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        errorMessage = 'Error de conexión. Verifica tu internet e inténtalo de nuevo.';
      } else if (errorMessage.includes('file') || errorMessage.includes('video')) {
        errorMessage = 'Error al procesar el archivo de video. Verifica el formato y tamaño.';
      }
      
      setError(errorMessage);
    }
  };

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Crear Nuevo Episodio"
      subtitle="Agregar un nuevo episodio a una serie existente"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Episodios', href: '/admin/episodes' },
        { label: 'Crear Episodio' }
      ]}
    >
      {/* CONTENEDOR PRINCIPAL */}
      <Container 
        size="lg" 
        variant="default"
        className={`${status !== 'idle' ? 'episodes-create--loading' : ''}`}
      >
        
        {/* Header Actions */}
        <div className="page-header-actions">
          <Button
            variant="outline"
            size="sm"
            leftIcon="←"
            onClick={handleGoBack}
            disabled={loading || status !== 'idle'}
          >
            Volver a Episodios
          </Button>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="status-message status-message--error">
            <span className="status-message__icon">⚠️</span>
            <div className="status-message__content">
              <strong>Error al crear episodio</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Mensaje de Éxito */}
        {success && (
          <div className="status-message status-message--success">
            <span className="status-message__icon">✅</span>
            <div className="status-message__content">
              <strong>¡Episodio creado exitosamente!</strong>
              <span>Redirigiendo al listado en unos segundos...</span>
            </div>
          </div>
        )}

        {/* Header del Formulario */}
        <div className="form-header">
          <h2 className="form-title">
            🎬 Nuevo Episodio
          </h2>
          <p className="form-description">
            Los episodios deben estar asociados a una serie existente. 
            Cada episodio se identifica por su temporada y número dentro de la serie.
            El archivo de video se procesará automáticamente después de la creación.
          </p>
        </div>

        {/* Formulario Dinámico */}
        <DynamicForm
          id="episode-create-form"
          fields={episodeFormFields}
          initialData={initialData}
          onSubmit={handleSubmit}
          onChange={handleFormChange}
          loading={loading || status !== 'idle'}
          disabled={loading || success || status !== 'idle'}
          columnsPerRow={2}
          tabletColumns={1}
          mobileColumns={1}
          fieldSize="md"
          fieldRounded="md"
          submitText={
            status === 'processing' ? "Procesando..." :
            status === 'transcoding' ? "Transcodificando..." :
            loading ? "Creando Episodio..." : 
            "Crear Episodio"
          }
          submitVariant="primary"
          submitSize="md"
          submitIcon="🎬"
          validateOnBlur={true}
          validateOnChange={false}
          showSubmit={!success && status !== 'completed'}
          className={`episode-form ${success ? 'form--success' : ''}`}
        />

        {/* Información adicional sobre episodios */}
        <div className="form-footer">
          <div className="info-card">
            <h4>💡 Consejos para crear episodios</h4>
            <ul>
              <li><strong>Orden correcto:</strong> Asegúrate de que la temporada y número de episodio sean correctos</li>
              <li><strong>Títulos descriptivos:</strong> Usa títulos únicos para cada episodio cuando sea posible</li>
              <li><strong>Archivos de calidad:</strong> Usa archivos de video en buena calidad (HD recomendado)</li>
              <li><strong>Formatos compatibles:</strong> MP4, AVI, MKV, MOV son los más recomendados</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h4>📊 Datos técnicos</h4>
            <ul>
              <li><strong>Serie:</strong> Debe existir una serie antes de crear episodios</li>
              <li><strong>Temporada:</strong> Número entero positivo (1-99)</li>
              <li><strong>Episodio:</strong> Número entero positivo (1-999)</li>
              <li><strong>Título:</strong> Opcional, máximo 255 caracteres</li>
              <li><strong>Video:</strong> Archivo requerido, se procesará automáticamente</li>
            </ul>
          </div>
        </div>

      </Container>

      {/* ===== BARRA DE PROGRESO FLOTANTE ===== */}
      {status !== 'idle' && (
        <div className="episodes-create-page__progress">
          <UploadProgress
            progress={progress}
            status={status}
            message={progressError || message}
            size="md"
          />
        </div>
      )}
    </AdminLayout>
  );
}

export { EpisodesCreatePage };