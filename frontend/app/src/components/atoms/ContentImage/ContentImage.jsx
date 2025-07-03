// atoms/ContentImage/ContentImage.jsx
import React, { useState } from 'react';
import './ContentImage.css';

/**
 * Componente ContentImage - Átomo para imágenes de contenido multimedia
 * Especializado en carátulas de películas/series con aspect ratios y fallbacks
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.src - URL de la imagen
 * @param {string} props.alt - Texto alternativo para accesibilidad
 * @param {'1/1'|'4/3'|'3/2'|'16/9'|'2/3'|'3/4'|'auto'} [props.aspectRatio='2/3'] - Proporción de aspecto
 * @param {'cover'|'contain'|'fill'|'scale-down'|'none'} [props.objectFit='cover'] - Comportamiento de ajuste
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='md'] - Border radius
 * @param {'eager'|'lazy'} [props.loading='lazy'] - Estrategia de carga
 * @param {'high'|'low'|'auto'} [props.fetchPriority='auto'] - Prioridad de descarga
 * @param {function} [props.onLoad] - Callback cuando la imagen carga
 * @param {function} [props.onError] - Callback cuando la imagen falla
 * @param {string} [props.placeholder] - Texto para placeholder (emoji o texto corto)
 * @param {'movie'|'series'|'generic'} [props.contentType='generic'] - Tipo de contenido para fallback
 * @param {boolean} [props.showFallback=true] - Si mostrar fallback en error
 * @param {boolean} [props.blur=false] - Si aplicar blur (para loading progresivo)
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {React.CSSProperties} [props.style] - Estilos inline
 */
const ContentImage = ({
  src,
  alt,
  aspectRatio = '2/3',
  objectFit = 'cover',
  rounded = 'md',
  loading = 'lazy',
  fetchPriority = 'auto',
  onLoad,
  onError,
  placeholder,
  contentType = 'generic',
  showFallback = true,
  blur = false,
  className = '',
  style,
  ...restProps
}) => {
  const [imageState, setImageState] = useState('loading'); // 'loading' | 'loaded' | 'error'
  const [imageSrc, setImageSrc] = useState(src);

  // Generar placeholder SVG según tipo de contenido
  const generateFallbackSvg = () => {
    const icons = {
      movie: '🎬',
      series: '📺',
      generic: '🖼️'
    };
    
    const icon = placeholder || icons[contentType] || icons.generic;
    
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'%3E%3Crect width='300' height='450' fill='%23f3f4f6'/%3E%3Ctext x='150' y='200' text-anchor='middle' fill='%23374151' font-family='Arial, sans-serif' font-size='24'%3E${icon}%3C/text%3E%3Ctext x='150' y='250' text-anchor='middle' fill='%23374151' font-family='Arial, sans-serif' font-size='12'%3ESin imagen%3C/text%3E%3C/svg%3E`;
  };

  // Handlers
  const handleImageLoad = (e) => {
    setImageState('loaded');
    onLoad?.(e);
  };

  const handleImageError = (e) => {
    setImageState('error');
    
    if (showFallback) {
      setImageSrc(generateFallbackSvg());
    }
    
    onError?.(e);
  };

  // Construir clases CSS
  const imageClasses = [
    'content-image',
    `content-image--aspect-${aspectRatio.replace('/', '-')}`,
    `content-image--fit-${objectFit}`,
    rounded !== 'md' && `content-image--rounded-${rounded}`,
    blur && 'content-image--blur',
    imageState === 'loading' && 'content-image--loading',
    imageState === 'error' && 'content-image--error',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={imageClasses}
      style={style}
      {...restProps}
    >
      {/* Skeleton de carga */}
      {imageState === 'loading' && (
        <div className="content-image__skeleton">
          <div className="content-image__skeleton-icon">
            {placeholder || '⏳'}
          </div>
        </div>
      )}

      {/* Imagen principal */}
      <img
        src={imageSrc}
        alt={alt}
        className="content-image__img"
        loading={loading}
        fetchPriority={fetchPriority}
        onLoad={handleImageLoad}
        onError={handleImageError}
        draggable={false}
      />

      {/* Indicador de error (opcional) */}
      {imageState === 'error' && !showFallback && (
        <div className="content-image__error-state">
          <span className="content-image__error-icon">⚠️</span>
          <span className="content-image__error-text">Error al cargar</span>
        </div>
      )}
    </div>
  );
};

export { ContentImage };