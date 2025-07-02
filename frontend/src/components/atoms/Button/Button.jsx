// src/components/atoms/Button/Button.jsx
import React from 'react';
import './Button.css';

/**
 * Button - ÁTOMO CORREGIDO PARA CUMPLIR REGLAS DEL PROYECTO
 * 
 * ✅ EXPORT CONVENTION: Patrón function + export { Name }
 * ✅ PROPS ESTÁNDAR: 5 tamaños + 4 variantes + props obligatorias
 * ✅ SISTEMA DE DISEÑO: Variables CSS del sistema
 * ✅ ACCESIBILIDAD: ARIA completo, focus management
 * ✅ ATOMIC DESIGN: Átomo independiente y reutilizable
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} [props.children] - Contenido del botón
 * @param {string} [props.text] - Alternativa a children para texto simple
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del botón
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'|'success'|'warning'} [props.variant='primary'] - Variante visual
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='md'] - Radio de bordes
 * @param {boolean} [props.disabled=false] - Si está deshabilitado
 * @param {boolean} [props.loading=false] - Estado de carga con spinner
 * @param {boolean} [props.fullWidth=false] - Ocupa todo el ancho
 * @param {string|React.ReactNode} [props.icon] - Icono del botón
 * @param {'left'|'right'} [props.iconPosition='left'] - Posición del icono
 * @param {boolean} [props.iconOnly=false] - Solo muestra el icono
 * @param {'button'|'submit'|'reset'} [props.type='button'] - Tipo HTML
 * @param {function} [props.onClick] - Handler de click
 * @param {string} [props.ariaLabel] - Label para accesibilidad
 * @param {string} [props.className=''] - Clases CSS adicionales
 */
function Button({
  children,
  text,
  size = 'md',
  variant = 'primary',
  rounded = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  iconOnly = false,
  type = 'button',
  onClick,
  ariaLabel,
  className = '',
  ...restProps
}) {
  // Determinar el contenido del botón
  const buttonContent = children || text;

  // Generar clases CSS
  const buttonClasses = [
    'btn',
    `btn--${size}`,
    `btn--${variant}`,
    `btn--rounded-${rounded}`,
    fullWidth && 'btn--full-width',
    iconOnly && 'btn--icon-only',
    loading && 'btn--loading',
    disabled && 'btn--disabled',
    className
  ].filter(Boolean).join(' ');

  // Props de accesibilidad
  const finalAriaLabel = ariaLabel || (iconOnly && typeof buttonContent === 'string' ? buttonContent : undefined);

  // Función para renderizar iconos
  const renderIcon = (iconProp) => {
    if (!iconProp) return null;
    
    // Si es un string, asumimos que es emoji, clase CSS o texto
    if (typeof iconProp === 'string') {
      return iconProp;
    }
    
    // Si es un componente React, lo renderizamos directamente
    return iconProp;
  };

  // Handler de click
  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button 
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      aria-label={finalAriaLabel}
      {...restProps}
    >
      {/* Icono izquierdo */}
      {icon && iconPosition === 'left' && !iconOnly && (
        <span className="btn__icon btn__icon--left">
          {renderIcon(icon)}
        </span>
      )}
      
      {/* Contenido principal */}
      {!iconOnly && (
        <span className="btn__content">
          {buttonContent}
        </span>
      )}
      
      {/* Solo icono (para botones icon-only) */}
      {iconOnly && icon && (
        <span className="btn__icon">
          {renderIcon(icon)}
        </span>
      )}
      
      {/* Icono derecho */}
      {icon && iconPosition === 'right' && !iconOnly && (
        <span className="btn__icon btn__icon--right">
          {renderIcon(icon)}
        </span>
      )}
      
      {/* Spinner de loading */}
      {loading && (
        <span className="btn__spinner" aria-hidden="true">
          <svg className="btn__spinner-svg" viewBox="0 0 24 24">
            <circle 
              className="btn__spinner-circle" 
              cx="12" 
              cy="12" 
              r="10" 
              strokeWidth="2"
            />
          </svg>
        </span>
      )}
    </button>
  );
}

export { Button };