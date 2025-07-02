// molecules/ContentCard/ContentCard.jsx
import React from 'react';
import { Card, CardBody, CardTitle, CardSubtitle } from '../../atoms/Card/Card';
import { Button } from '../../atoms/Button/Button';
import { Badge } from '../../atoms/Badge/Badge';
import { ContentImage } from '../../atoms/ContentImage/ContentImage';
import './ContentCard.css';

/**
 * Componente ContentCard - Molécula para mostrar carátulas de películas/series
 * Sigue Atomic Design: combina Card + Badge + Button + elementos personalizados
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.content - Datos del contenido
 * @param {string} props.content.id - ID único del contenido
 * @param {string} props.content.title - Título de la película/serie
 * @param {string} props.content.cover - URL de la imagen de carátula
 * @param {string} props.content.category - Categoría/género
 * @param {number} props.content.year - Año de lanzamiento
 * @param {number} props.content.rating - Puntuación (ej: 8.5)
 * @param {string} props.content.type - Tipo: 'movie' | 'series'
 * @param {string} [props.content.duration] - Duración (películas)
 * @param {number} [props.content.seasons] - Temporadas (series)
 * @param {number} [props.content.episodes] - Episodios (series)
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño de la card
 * @param {function} [props.onClick] - Callback al hacer click en la card
 * @param {function} [props.onPlay] - Callback al hacer click en reproducir
 * @param {function} [props.onFavorite] - Callback para agregar a favoritos
 * @param {boolean} [props.showRating=true] - Mostrar rating
 * @param {boolean} [props.showMeta=true] - Mostrar metadatos (duración/temporadas)
 * @param {boolean} [props.showCategory=true] - Mostrar categoría
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {boolean} [props.disabled=false] - Estado deshabilitado
 * @param {'elevated'|'outlined'|'default'} [props.variant='elevated'] - Variante visual
 * @param {'sm'|'md'|'lg'|'xl'} [props.rounded='lg'] - Border radius
 * @param {string} [props.className=''] - Clases CSS adicionales
 */
const ContentCard = ({
  content,
  size = 'md',
  onClick,
  onPlay,
  onFavorite,
  showRating = true,
  showMeta = true,
  showCategory = true,
  loading = false,
  disabled = false,
  variant = 'elevated',
  rounded = 'lg',
  className = '',
  ...restProps
}) => {
  // Validación de datos requeridos
  if (!content) {
    console.warn('ContentCard: content prop is required');
    return null;
  }

  const {
    id,
    title,
    cover,
    category,
    year,
    rating,
    type,
    duration,
    seasons,
    episodes
  } = content;

  // ✅ FILTRAR PROPS PERSONALIZADAS QUE NO DEBEN IR AL DOM
  const {
    // Props personalizados que podrían venir del padre
    content: _content,
    size: _size,
    onPlay: _onPlay,
    onFavorite: _onFavorite,
    showRating: _showRating,
    showMeta: _showMeta,
    showCategory: _showCategory,
    
    ...domProps // ✅ Solo props válidas para el DOM
  } = restProps;

  // Construir clases CSS
  const cardClasses = [
    'content-card',
    `content-card--${size}`,
    loading && 'content-card--loading',
    disabled && 'content-card--disabled',
    className
  ].filter(Boolean).join(' ');

  // Metadatos según el tipo de contenido
  const getMetaText = () => {
    if (type === 'movie' && duration) {
      return duration;
    }
    if (type === 'series') {
      if (seasons && episodes) {
        return `${seasons} temporada${seasons > 1 ? 's' : ''} • ${episodes} episodios`;
      }
      if (seasons) {
        return `${seasons} temporada${seasons > 1 ? 's' : ''}`;
      }
    }
    return year.toString();
  };

  // Handlers
  const handleCardClick = () => {
    if (disabled || loading) return;
    onClick?.(content);
  };

  const handlePlayClick = (e) => {
    e.stopPropagation(); // Evitar que se active el onClick de la card
    if (disabled || loading) return;
    onPlay?.(content);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (disabled || loading) return;
    onFavorite?.(content);
  };

  const handleImageError = (e) => {
    // ContentImage ya maneja los errores automáticamente
    console.log('Image error handled by ContentImage atom');
  };

  return (
    <Card
      variant={variant}
      shadow="md"
      rounded={rounded}
      hoverable
      clickable
      onClick={handleCardClick}
      className={cardClasses}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label={`${type === 'movie' ? 'Película' : 'Serie'}: ${title}`}
      aria-disabled={disabled}
      {...domProps} // ✅ Solo props válidas del DOM
    >
      {/* Contenedor de imagen */}
      <div className="content-card__image-container">
        <ContentImage
          src={cover}
          alt={`Carátula de ${title}`}
          aspectRatio="2/3"
          contentType={type}
          loading={loading ? "eager" : "lazy"}
          onLoad={() => console.log(`${title} loaded`)}
          onError={handleImageError}
          rounded="none" // El contenedor ya maneja el border radius
          className="content-card__image"
        />
        
        {/* Overlay con controles */}
        <div className="content-card__overlay">
          <div className="content-card__controls">
            <Button
              variant="primary"
              size={size === 'sm' ? 'xs' : 'sm'}
              leftIcon="▶️"
              onClick={handlePlayClick}
              className="content-card__play-button"
              disabled={disabled || loading}
            >
              {type === 'movie' ? 'Ver' : 'Reproducir'}
            </Button>
            
            {onFavorite && (
              <Button
                variant="ghost"
                size={size === 'sm' ? 'xs' : 'sm'}
                leftIcon="❤️"
                onClick={handleFavoriteClick}
                className="content-card__favorite-button"
                disabled={disabled || loading}
                aria-label="Agregar a favoritos"
              />
            )}
          </div>
        </div>

        {/* Badge de tipo en esquina superior */}
        <div className="content-card__type-badge">
          <Badge
            variant={type === 'movie' ? 'primary' : 'secondary'}
            size="xs"
            style="soft"
          >
            {type === 'movie' ? '🎬' : '📺'}
          </Badge>
        </div>
      </div>

      {/* Información del contenido */}
      <CardBody className="content-card__info">
        <CardTitle className="content-card__title">
          {title}
        </CardTitle>
        
        {showCategory && category && (
          <CardSubtitle className="content-card__subtitle">
            {category} • {year}
          </CardSubtitle>
        )}

        {/* Metadatos y rating */}
        <div className="content-card__details">
          <div className="content-card__meta">
            {showMeta && (
              <span className="content-card__duration">
                {getMetaText()}
              </span>
            )}
          </div>
          
          {showRating && rating && (
            <div className="content-card__rating">
              <Badge
                variant="warning"
                size="xs"
                style="soft"
                icon="⭐"
              >
                {rating}
              </Badge>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export { ContentCard };