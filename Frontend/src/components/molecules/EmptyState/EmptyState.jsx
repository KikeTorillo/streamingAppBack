// EmptyState.jsx
import React from 'react';
import { Card } from '../../atoms/Card/Card';
import './EmptyState.css';

/**
 * Componente EmptyState - Molecule
 * 
 * Muestra un estado vacío cuando no hay contenido que mostrar.
 * Incluye ícono, título, descripción y acción opcional.
 * Usa el sistema de componentes Card como base.
 */
function EmptyState({
  // Contenido
  icon = '📭',
  title = 'No hay contenido',
  description = 'No se encontraron elementos para mostrar.',
  
  // Acción opcional
  action = null,
  
  // Estilos
  size = 'md',
  variant = 'default',
  
  // Propiedades adicionales
  className = '',
  ...restProps
}) {
  
  // Clases CSS dinámicas
  const emptyStateClasses = [
    'empty-state',
    `empty-state--size-${size}`,
    `empty-state--variant-${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <Card 
      variant="outlined" 
      padding={size === 'sm' ? 'lg' : size === 'lg' ? '2xl' : 'xl'}
      className={emptyStateClasses}
      {...restProps}
    >
      <div className="empty-state__content">
        {/* Ícono */}
        <div className="empty-state__icon">
          {icon}
        </div>
        
        {/* Título */}
        <h3 className="empty-state__title">
          {title}
        </h3>
        
        {/* Descripción */}
        <p className="empty-state__description">
          {description}
        </p>
        
        {/* Acción opcional */}
        {action && (
          <div className="empty-state__action">
            {action}
          </div>
        )}
      </div>
    </Card>
  );
}

export { EmptyState };