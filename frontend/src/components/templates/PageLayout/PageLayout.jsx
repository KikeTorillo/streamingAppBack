// PageLayout.jsx
import React from 'react';
import './PageLayout.css';

/**
 * Componente PageLayout - Template
 * 
 * Layout principal para páginas de la aplicación.
 * Estructura: Header + Filters + Content
 */
function PageLayout({
  // Secciones del layout
  header = null,
  filters = null,
  children,
  
  // Configuración del contenido
  containerMaxWidth = '144rem', // 1440px
  contentPadding = 'var(--space-xl)',
  
  // Estilos
  variant = 'default',
  
  // Props adicionales
  className = '',
  ...restProps
}) {
  
  // Clases CSS dinámicas
  const layoutClasses = [
    'page-layout',
    `page-layout--variant-${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={layoutClasses} {...restProps}>
      {/* Header */}
      {header && (
        <div className="page-layout__header">
          {header}
        </div>
      )}

      {/* Filters */}
      {filters && (
        <div className="page-layout__filters">
          {filters}
        </div>
      )}

      {/* Main Content */}
      <main 
        className="page-layout__content"
        style={{
          maxWidth: containerMaxWidth,
          padding: contentPadding
        }}
      >
        {children}
      </main>
    </div>
  );
}

export { PageLayout };