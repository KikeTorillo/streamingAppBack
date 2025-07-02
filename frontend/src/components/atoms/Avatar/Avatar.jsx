// src/components/atoms/Avatar/Avatar.jsx
import React from 'react';
import './Avatar.css';

/**
 * Avatar - ÁTOMO CORREGIDO PARA CUMPLIR REGLAS DEL PROYECTO
 * 
 * ✅ EXPORT CONVENTION: Patrón function + export { Name }
 * ✅ TAMAÑOS ESTÁNDAR: 5 tamaños (xs, sm, md, lg, xl)
 * ✅ VARIANTES DE CONTENIDO: 4 variantes de presentación apropiadas
 * ✅ SISTEMA DE DISEÑO: Variables CSS del sistema
 * ✅ ATOMIC DESIGN: Átomo independiente y reutilizable
 * ✅ ACCESIBILIDAD: ARIA completo, focus management
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.src] - URL de la imagen del avatar
 * @param {string} [props.name] - Nombre del usuario (para generar iniciales)
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del avatar
 * @param {'default'|'elevated'|'bordered'|'minimal'} [props.variant='default'] - Variante de presentación
 * @param {'circle'|'rounded'|'square'} [props.shape='circle'] - Forma del avatar
 * @param {'online'|'offline'|'away'|'busy'} [props.status] - Estado de actividad
 * @param {string|number} [props.badge] - Insignia/contador a mostrar
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {function} [props.onClick] - Función a ejecutar al hacer clic
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {string} [props.alt] - Texto alternativo personalizado
 * @param {string} [props.fallbackIcon='👤'] - Icono cuando no hay imagen ni nombre
 * @param {boolean} [props.disabled=false] - Si está deshabilitado
 * @param {string} [props.ariaLabel] - Label para accesibilidad
 */
function Avatar({
  src,
  name,
  size = 'md',
  variant = 'default',
  shape = 'circle',
  status,
  badge,
  className = '',
  onClick,
  loading = false,
  alt,
  fallbackIcon = '👤',
  disabled = false,
  ariaLabel,
  ...restProps
}) {
  // Generar iniciales del nombre
  const getInitials = (fullName) => {
    if (!fullName) return '';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    
    return names
      .slice(0, 2) // Solo primeros dos nombres
      .map(name => name[0])
      .join('')
      .toUpperCase();
  };

  // Construir clases CSS dinámicamente
  const avatarClasses = [
    'avatar',
    `avatar--${size}`,
    `avatar--${variant}`,
    `avatar--${shape}`,
    onClick && 'avatar--clickable',
    loading && 'avatar--loading',
    disabled && 'avatar--disabled',
    status && 'avatar--has-status',
    badge && 'avatar--has-badge',
    className
  ].filter(Boolean).join(' ');

  // Determinar qué mostrar
  const initials = getInitials(name);
  const finalAlt = alt || name || 'Avatar';
  const finalAriaLabel = ariaLabel || (name ? `Avatar de ${name}` : 'Avatar');

  // Manejar click
  const handleClick = (e) => {
    if (loading || disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  // Manejar teclado para accesibilidad
  const handleKeyDown = (e) => {
    if (!onClick || loading || disabled) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(e);
    }
  };

  // Manejar error de imagen
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const fallback = e.target.nextSibling;
    if (fallback) {
      fallback.style.display = 'flex';
    }
  };

  const isInteractive = Boolean(onClick && !disabled && !loading);

  return (
    <div 
      className={avatarClasses}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={finalAriaLabel}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...restProps}
    >
      {/* Contenedor principal */}
      <div className="avatar__container">
        {/* Imagen del avatar */}
        {src && (
          <img
            className="avatar__image"
            src={src}
            alt={finalAlt}
            onError={handleImageError}
          />
        )}
        
        {/* Fallback con iniciales o icono */}
        <div 
          className="avatar__fallback"
          style={{ display: src ? 'none' : 'flex' }}
        >
          {initials || fallbackIcon}
        </div>
        
        {/* Spinner de loading */}
        {loading && (
          <div className="avatar__loading-spinner">
            <svg className="avatar__spinner-svg" viewBox="0 0 24 24">
              <circle 
                className="avatar__spinner-circle" 
                cx="12" 
                cy="12" 
                r="10" 
                strokeWidth="2"
              />
            </svg>
          </div>
        )}
      </div>
      
      {/* Indicador de estado */}
      {status && (
        <div className={`avatar__status avatar__status--${status}`} />
      )}
      
      {/* Badge */}
      {badge && (
        <div className="avatar__badge">
          {badge}
        </div>
      )}
    </div>
  );
}

export { Avatar };