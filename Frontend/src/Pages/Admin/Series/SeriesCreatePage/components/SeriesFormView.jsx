// ===== SERIES FORM VIEW - BASADO EN MOVIEFORMVIEW =====
// src/Pages/Admin/Series/SeriesCreatePage/components/SeriesFormView.jsx

import React, { useState, useEffect } from 'react';
import { DynamicForm } from '../../../../../components/molecules/DynamicForm/DynamicForm';
import { Card, CardHeader, CardBody, CardTitle } from '../../../../../components/atoms/Card/Card';
import { Button } from '../../../../../components/atoms/Button/Button';
import { ContentImage } from '../../../../../components/atoms/ContentImage/ContentImage';
import './SeriesFormView.css';

/**
 * SeriesFormView - VERSIÓN ACTUALIZADA CON FILTRO DE CAMPOS VACÍOS
 * ✅ FILTRO AUTOMÁTICO: Solo envía campos con valores válidos al backend
 * ✅ VALIDACIÓN: Verifica que campos requeridos tengan valores
 * ✅ OPTIMIZACIÓN: Elimina campos vacíos, null o undefined de la petición
 * ✅ UX MEJORADA: Información clara sobre campos opcionales
 */
function SeriesFormView({
  fields = [],
  initialData = {},
  onSubmit,
  categoryOptions = [],
  loading = false,
  error = null,
  success = false,
  hasChanges = false,
  onChange,
  selectedItem = null,
  showBackButton = false,
  onBackToSearch
}) {
  // ===== ESTADOS =====
  const [currentFormData, setCurrentFormData] = useState(initialData);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageType, setImageType] = useState(null);
  const [formLoading, setFormLoading] = useState(loading);

  // ===== EFECTOS =====
  useEffect(() => {
    setCurrentFormData(initialData);
  }, [initialData]);

  useEffect(() => {
    setFormLoading(loading);
  }, [loading]);

  /**
   * ✅ NUEVO: Gestión automática de preview de imagen
   */
  useEffect(() => {
    const { coverImageUrl, coverImageFile, coverImage } = currentFormData;

    // Prioridad: archivo > URL > TMDB
    if (coverImageFile && coverImageFile instanceof File) {
      setImageType('file');
      try {
        const previewUrl = URL.createObjectURL(coverImageFile);
        setImagePreview(previewUrl);

        // Cleanup para evitar memory leaks
        return () => URL.revokeObjectURL(previewUrl);
      } catch (error) {
        console.error('❌ Error creando preview del archivo:', error);
        setImagePreview(null);
      }
    } else if ((coverImageUrl && typeof coverImageUrl === 'string' && coverImageUrl.trim()) || (typeof coverImage === 'string' && coverImage.trim())) {
      const urlToCheck = coverImageUrl || coverImage;
      if (urlToCheck.includes('image.tmdb.org')) {
        setImageType('tmdb');
      } else {
        setImageType('url');
      }
      setImagePreview(urlToCheck);
    } else {
      setImageType(null);
      setImagePreview(null);
    }
  }, [currentFormData.coverImageUrl, currentFormData.coverImageFile, currentFormData.coverImage]);

  // ===== FUNCIONES AUXILIARES =====

  const getFormTitle = () => {
    return selectedItem ? 'Confirmar Información de TMDB' : 'Información del Contenido';
  };

  const getFormDescription = () => {
    return selectedItem ?
      'Revisa y completa los datos obtenidos de TMDB. Los campos se rellenan automáticamente pero puedes modificarlos.' :
      'Completa todos los campos requeridos para agregar la película o serie al catálogo.';
  };

  /**
   * ✅ NUEVO: Obtener información descriptiva del tipo de imagen
   */
  const getImageTypeInfo = () => {
    switch (imageType) {
      case 'tmdb':
        return {
          badge: '🌐 TMDB',
          description: 'Imagen de alta calidad desde TMDB',
          bgClass: 'series-form-view__image-info--tmdb'
        };
      case 'file':
        return {
          badge: '📁 Archivo',
          description: `Archivo subido: ${currentFormData.coverImageFile?.name || currentFormData.coverImage?.name || 'Unknown'}`,
          bgClass: 'series-form-view__image-info--file'
        };
      case 'url':
        return {
          badge: '🔗 URL Externa',
          description: 'Imagen desde enlace externo',
          bgClass: 'series-form-view__image-info--url'
        };
      default:
        return null;
    }
  };

  /**
   * ✅ NUEVA FUNCIÓN: Filtrar campos vacíos antes del envío
   */
  const filterEmptyFields = (formData) => {
    const filteredData = {};
    
    Object.keys(formData).forEach(key => {
      const value = formData[key];
      
      // Solo incluir el campo si tiene un valor válido
      if (value !== null && value !== undefined && value !== '') {
        // Para archivos, verificar que sea un File válido
        if (value instanceof File) {
          filteredData[key] = value;
        }
        // Para strings, verificar que no estén vacíos después de trim
        else if (typeof value === 'string' && value.trim() !== '') {
          filteredData[key] = value.trim();
        }
        // Para números, verificar que sean válidos
        else if (typeof value === 'number' && !isNaN(value)) {
          filteredData[key] = value;
        }
        // Para booleans y otros tipos válidos
        else if (typeof value !== 'string') {
          filteredData[key] = value;
        }
      }
    });
    
    return filteredData;
  };

  /**
   * ✅ ACTUALIZADO: Manejar envío del formulario con filtrado de campos vacíos
   */
  const handleFormSubmit = (formData) => {
    console.log('📝 Datos del formulario (originales):', formData);
    
    // Filtrar campos vacíos
    const filteredData = filterEmptyFields(formData);
    console.log('📝 Datos del formulario (filtrados):', filteredData);

    // Preparar datos para el servicio con nombres correctos
    const seriesData = {
      title: filteredData.title,
      categoryId: filteredData.categoryId || filteredData.category_id,
      releaseYear: filteredData.releaseYear || filteredData.year,
      description: filteredData.description,
      coverImage: filteredData.coverImage || filteredData.coverImageFile || filteredData.coverImageUrl,
      // Solo incluir email si tiene valor
      ...(filteredData.email && { email: filteredData.email }),
      // Solo incluir tmdb_id si tiene valor
      ...(filteredData.tmdb_id && { tmdb_id: filteredData.tmdb_id }),
      // Solo incluir media_type si tiene valor
      ...(filteredData.media_type && { media_type: filteredData.media_type })
    };

    // Filtrar una vez más para asegurar que no hay campos undefined
    const finalData = filterEmptyFields(seriesData);
    
    console.log('📤 Datos finales para el servicio:', finalData);
    onSubmit?.(finalData);
  };

  /**
   * Manejar cambios en el formulario
   */
  const handleFormChange = (fieldName, value) => {
    setCurrentFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    onChange?.();
  };

  /**
   * ✅ NUEVO: Renderizar información de la imagen actual
   */
  const renderImageInfo = () => {
    const imageInfo = getImageTypeInfo();
    if (!imageInfo) return null;

    return (
      <div className={`series-form-view__image-info ${imageInfo.bgClass}`}>
        <span className="series-form-view__image-badge">{imageInfo.badge}</span>
        <span className="series-form-view__image-description">{imageInfo.description}</span>
      </div>
    );
  };

  // ===== RESOLUCIÓN DE CAMPOS CON OPCIONES DINÁMICAS =====
  const resolvedFields = fields.map(field => {
    if (field.name === 'categoryId' && categoryOptions.length > 0) {
      return {
        ...field,
        options: categoryOptions
      };
    }
    return field;
  });

  // ===== RENDER =====
  return (
    <div className="series-form-view">
      {/* ===== TARJETA DE VISTA PREVIA DE TMDB ===== */}
      {selectedItem && (
        <Card className="series-form-view__preview">
          <CardHeader>
            <CardTitle>🎬 Vista Previa de TMDB</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="series-form-view__preview-content">
              {selectedItem.poster_path && (
                <div className="series-form-view__preview-image">
                  <ContentImage
                    src={selectedItem.poster_path}
                    alt={selectedItem.title || selectedItem.name}
                    fallbackIcon="📺"
                  />
                </div>
              )}

              <div className="series-form-view__preview-info">
                <h3 className="series-form-view__preview-title">
                  {selectedItem.title || selectedItem.name}
                </h3>

                <div className="series-form-view__preview-meta">
                  <span className="series-form-view__preview-type">
                    {selectedItem.type === 'tv' || selectedItem.media_type === 'tv' || selectedItem.name ? '📺 Serie' : '🎬 Película'}
                  </span>
                  {selectedItem.year && <span>📅 {selectedItem.year}</span>}
                  {selectedItem.rating && <span>⭐ {selectedItem.rating}</span>}
                </div>

                {selectedItem.overview && (
                  <p className="series-form-view__preview-overview">
                    {selectedItem.overview}
                  </p>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ===== FORMULARIO PRINCIPAL ===== */}
      <Card>
        <CardHeader>
          <div className="series-form-view__form-header">
            <CardTitle>{getFormTitle()}</CardTitle>
            {!selectedItem && showBackButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBackToSearch}
                disabled={formLoading}
                leftIcon="←"
              >
                Volver a Búsqueda
              </Button>
            )}
          </div>
        </CardHeader>
        <CardBody>
          <p className="series-form-view__form-description">
            {getFormDescription()}
          </p>

          {/* ===== VISTA PREVIA DE IMAGEN ACTUAL ===== */}
          {imagePreview && (
            <div className="series-form-view__current-image">
              <h4>🖼️ Imagen de Portada Actual</h4>

              {renderImageInfo()}

              <div className="series-form-view__image-preview">
                <ContentImage
                  src={imagePreview}
                  alt="Vista previa de la portada"
                  fallbackIcon="📺"
                  className="series-form-view__preview-image"
                />
              </div>
            </div>
          )}

          {/* ===== FORMULARIO DINÁMICO ===== */}
          <div className="series-form-view__form">
            <DynamicForm
              fields={resolvedFields}
              onSubmit={handleFormSubmit}
              onChange={handleFormChange}
              initialData={currentFormData}
              columnsPerRow={2}
              submitText={success ? "✅ Guardado Exitosamente" : "💾 Guardar Contenido"}
              submitVariant={success ? "success" : "primary"}
              submitSize="lg"
              loading={formLoading}
              disabled={formLoading || success}
              fieldSize="md"
              validateOnChange={true}
            />
          </div>

          {/* ===== MENSAJE DE ÉXITO ===== */}
          {success && (
            <div className="series-form-view__success">
              <div className="series-form-view__success-icon">✅</div>
              <h4 className="series-form-view__success-title">
                ¡Contenido creado exitosamente!
              </h4>
              <p className="series-form-view__success-message">
                El contenido ha sido agregado al catálogo y estará disponible después del procesamiento.
              </p>
            </div>
          )}

          {/* ===== INFORMACIÓN ADICIONAL ===== */}
          {!success && (
            <div className="series-form-view__info">
              <h4>💡 Información importante:</h4>
              <ul>
                <li><strong>Campos opcionales:</strong> Los campos como "Correo Electrónico" son opcionales y no se enviarán si están vacíos.</li>
                <li><strong>Portada:</strong> Puedes usar una URL externa o subir un archivo. El archivo tendrá prioridad.</li>
                <li><strong>Categoría:</strong> Selecciona la categoría que mejor describa la serie.</li>
                <li><strong>Datos optimizados:</strong> Solo se envían al servidor los campos que tienen valores válidos.</li>
              </ul>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export { SeriesFormView };
