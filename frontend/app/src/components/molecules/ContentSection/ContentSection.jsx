// ContentSection.jsx
import React from 'react';
import { Card } from '../../atoms/Card/Card';
import { EmptyState } from '../EmptyState/EmptyState';
import './ContentSection.css';

/**
 * Componente ContentSection - Molecule
 * 
 * Contenedor para secciones de contenido con título, ícono y área de contenido.
 * Maneja automáticamente estados de carga, vacío y error.
 * Usa componentes del sistema de diseño.
 */
function ContentSection({
  // Contenido de la sección
  title = 'Sección de contenido',
  icon = '📺',
  children,
  
  // Estados
  loading = false,
  error = null,
  empty = false,
  
  // Configuración del estado vacío
  emptyIcon = '📭',
  emptyTitle = 'No hay contenido',
  emptyDescription = 'No se encontraron elementos en esta sección.',
  emptyAction = null,
  
  // Estilos y variantes
  variant = 'default',
  size = 'md',
  showDivider = true,
  
  // Configuración del grid
  gridColumns = 'repeat(auto-fit, minmax(200px, 1fr))',
  gridGap = 'var(--space-md)',
  
  // Props adicionales
  className = '',
  id,
  ...restProps
}) {
  
  // Clases CSS dinámicas
  const sectionClasses = [
    'content-section',
    `content-section--variant-${variant}`,
    `content-section--size-${size}`,
    loading && 'content-section--loading',
    error && 'content-section--error',
    className
  ].filter(Boolean).join(' ');

  // Determinar si mostrar estado vacío
  const shouldShowEmpty = empty || (!loading && !error && !children);

  return (
    <section 
      className={sectionClasses}
      id={id}
      {...restProps}
    >
      {/* Header de la sección */}
      <div className="content-section__header">
        <div className="content-section__title-container">
          <div className="content-section__icon">
            {icon}
          </div>
          <h2 className="content-section__title">
            {title}
          </h2>
        </div>
        
        {/* Divider opcional */}
        {showDivider && (
          <div className="content-section__divider" />
        )}
      </div>

      {/* Contenido de la sección */}
      <div className="content-section__content">
        {/* Estado de error */}
        {error && (
          <div className="content-section__error">
            <Card variant="outlined" padding="lg">
              <div className="error-content">
                <span className="error-icon">⚠️</span>
                <div className="error-text">
                  <strong>Error al cargar contenido</strong>
                  <p>{error}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Estado de carga */}
        {loading && (
          <div 
            className="content-section__grid"
            style={{ 
              gridTemplateColumns: gridColumns,
              gap: gridGap 
            }}
          >
            {/* Skeletons de carga */}
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="content-skeleton">
                <Card variant="outlined" padding="md">
                  <div className="skeleton-content">
                    <div className="skeleton-image" />
                    <div className="skeleton-text skeleton-text--title" />
                    <div className="skeleton-text skeleton-text--subtitle" />
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* Estado vacío */}
        {shouldShowEmpty && !loading && !error && (
          <div className="content-section__empty">
            <EmptyState
              icon={emptyIcon}
              title={emptyTitle}
              description={emptyDescription}
              action={emptyAction}
              size={size === 'lg' ? 'lg' : 'md'}
            />
          </div>
        )}

        {/* Contenido normal */}
        {!loading && !error && !shouldShowEmpty && (
          <div 
            className="content-section__grid"
            style={{ 
              gridTemplateColumns: gridColumns,
              gap: gridGap 
            }}
          >
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

export { ContentSection };