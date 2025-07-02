// atoms/Card.jsx
import React from 'react';
import './Card.css';

/**
 * Componente Card - Átomo base para contenedores
 * Siguiendo el sistema de diseño establecido y principios de Atomic Design
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido de la card
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {'xs'|'sm'|'md'|'lg'|'xl'|'2xl'} [props.padding='lg'] - Padding interno
 * @param {'sm'|'md'|'lg'|'xl'|'none'} [props.shadow='md'] - Sombra de la card
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='lg'] - Radio de bordes
 * @param {'default'|'elevated'|'outlined'} [props.variant='default'] - Variante visual
 * @param {boolean} [props.hoverable=false] - Si tiene efecto hover
 * @param {boolean} [props.clickable=false] - Si es clickeable (alternativa a onClick)
 * @param {function} [props.onClick] - Función a ejecutar al hacer clic
 * @param {string} [props.maxWidth] - Ancho máximo de la card
 * @param {boolean} [props.fullWidth=false] - Si ocupa todo el ancho disponible
 * @param {boolean} [props.loading=false] - Estado de carga con shimmer effect
 * @param {string} [props.ariaLabel] - Label para accesibilidad
 * @param {string} [props.role] - Rol ARIA (se define automáticamente si es clickeable)
 * @param {number} [props.tabIndex] - Tab index (se define automáticamente si es clickeable)
 */
const Card = ({
  children,
  className = '',
  padding = 'lg',
  shadow = 'md',
  rounded = 'lg',
  variant = 'default',
  hoverable = false,
  clickable = false,
  onClick,
  maxWidth,
  fullWidth = false,
  loading = false,
  ariaLabel,
  role,
  tabIndex,
  ...restProps
}) => {
  // Determinar si la card es interactiva
  const isInteractive = !!(onClick || clickable);
  
  // Construir clases CSS dinámicamente
  const cardClasses = [
    'card',
    `card--${variant}`,
    `card--padding-${padding}`,
    shadow !== 'none' && `card--shadow-${shadow}`,
    `card--rounded-${rounded}`,
    (hoverable || isInteractive) && 'card--hoverable',
    isInteractive && 'card--clickable',
    fullWidth && 'card--full-width',
    loading && 'card--loading',
    className
  ].filter(Boolean).join(' ');

  // Estilos inline dinámicos
  const cardStyles = {
    maxWidth: maxWidth || undefined,
    width: fullWidth ? '100%' : undefined
  };

  // Props de accesibilidad
  const accessibilityProps = {
    role: role || (isInteractive ? 'button' : undefined),
    tabIndex: tabIndex !== undefined ? tabIndex : (isInteractive ? 0 : undefined),
    'aria-label': ariaLabel,
    'aria-disabled': loading ? 'true' : undefined
  };

  // Handler de click
  const handleClick = (e) => {
    if (loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  // Handler de teclado para accesibilidad
  const handleKeyDown = (e) => {
    if (!isInteractive || loading) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(e);
    }
  };

  return (
    <div 
      className={cardClasses}
      style={cardStyles}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      {...accessibilityProps}
      {...restProps}
    >
      {children}
    </div>
  );
};

// Componentes auxiliares para estructura de la card
const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`card__header ${className}`} {...props}>
    {children}
  </div>
);

const CardBody = ({ children, className = '', ...props }) => (
  <div className={`card__body ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`card__footer ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', as: Component = 'h3', ...props }) => (
  <Component className={`card__title ${className}`} {...props}>
    {children}
  </Component>
);

const CardSubtitle = ({ children, className = '', as: Component = 'p', ...props }) => (
  <Component className={`card__subtitle ${className}`} {...props}>
    {children}
  </Component>
);

const CardDescription = ({ children, className = '', as: Component = 'p', ...props }) => (
  <Component className={`card__description ${className}`} {...props}>
    {children}
  </Component>
);

// Exportar componente principal y auxiliares
export { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter, 
  CardTitle, 
  CardSubtitle, 
  CardDescription 
};