// Container.jsx - VERSIÓN CORREGIDA
import React from 'react';
import PropTypes from 'prop-types';
import './Container.css';

/**
 * Componente Container unificado que implementa el sistema de contenedores estandarizado
 * Reemplaza el uso directo de clases CSS por un componente reutilizable
 * 
 * ✅ CORREGIDO: Ahora se ajusta al contenido correctamente
 * ✅ NUEVAS VARIANTES: fullheight y centered para casos específicos
 */
function Container({ 
  size = 'md',
  variant = 'default',
  debug = false,
  children,
  className = '',
  as = 'div',
  ...props 
}) {
  // Generar clase base del contenedor
  const baseClass = `container-${size}`;
  
  // Generar clase de variante si no es default
  const variantClass = variant !== 'default' ? `container-${size}--${variant}` : '';
  
  // Clase de debug si está activado
  const debugClass = debug ? 'debug-containers' : '';
  
  // Combinar todas las clases
  const containerClass = [baseClass, variantClass, debugClass, className]
    .filter(Boolean)
    .join(' ');
  
  // Crear elemento dinámico
  const Element = as;
  
  return (
    <Element className={containerClass} {...props}>
      {children}
    </Element>
  );
}

Container.propTypes = {
  /**
   * Tamaño del contenedor - define el ancho máximo
   */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'full']),
  
  /**
   * Variante visual del contenedor
   */
  variant: PropTypes.oneOf([
    'default',    // Con estilos de card, ancho fijo consistente
    'simple',     // Sin estilos de card, ancho fijo consistente  
    'compact',    // Menos padding, ancho fijo consistente
    'flexible',   // Ancho variable que se ajusta al contenido (con límites)
    'fullheight', // Con estilos de card + altura mínima de pantalla
    'centered'    // Centrado vertical y horizontal + altura de pantalla
  ]),
  
  /**
   * Activar modo debug para visualizar límites
   */
  debug: PropTypes.bool,
  
  /**
   * Contenido del componente
   */
  children: PropTypes.node.isRequired,
  
  /**
   * Clases CSS adicionales
   */
  className: PropTypes.string,
  
  /**
   * Elemento HTML a renderizar
   */
  as: PropTypes.string
};

Container.defaultProps = {
  size: 'md',
  variant: 'default',
  debug: false,
  className: '',
  as: 'div'
};

// ===== EXPORTS ACTUALIZADOS =====

export { Container };

// Tamaños disponibles
export const CONTAINER_SIZES = {
  XS: 'xs',    // ≤480px - Modales, formularios login
  SM: 'sm',    // ≤640px - Artículos, detalles
  MD: 'md',    // ≤800px - Páginas estándar
  LG: 'lg',    // ≤1200px - Dashboards, admin
  XL: 'xl',    // ≤1440px - Layout principal
  FULL: 'full' // Sin límite - Páginas wide
};

// Variantes disponibles (ACTUALIZADAS)
export const CONTAINER_VARIANTS = {
  DEFAULT: 'default',      // Card style + ancho fijo consistente
  SIMPLE: 'simple',        // Sin card style + ancho fijo consistente
  COMPACT: 'compact',      // Menos padding + ancho fijo consistente
  FLEXIBLE: 'flexible',    // Ancho variable que se ajusta al contenido
  FULLHEIGHT: 'fullheight', // Card style + altura mínima de pantalla
  CENTERED: 'centered'     // Centrado + altura de pantalla
};