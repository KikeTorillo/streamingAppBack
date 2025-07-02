// src/hooks/useMovieNavigation.js
import { useNavigate } from 'react-router-dom';

function formatResolutions(resolutions = []) {
  // ✅ No dividir por 10, usar las resoluciones tal como vienen
  return resolutions
    .sort((a, b) => a - b)
    .join(',');
}

function useMovieNavigation() {
  const navigate = useNavigate();

  const buildPlayerParams = (contentData) => {
    console.log('[useMovieNavigation] contentData recibida:', contentData);
    
    const original = contentData?._original || contentData;
    const fileHash = original?.file_hash;
    
    // ✅ Validar que fileHash existe
    if (!fileHash) {
      console.error('[useMovieNavigation] Error: file_hash no encontrado en contentData:', original);
      return null;
    }
    
    const formatted = formatResolutions(original?.available_resolutions || []);
    
    console.log('[useMovieNavigation] fileHash:', fileHash);
    console.log('[useMovieNavigation] resolutions originales:', original?.available_resolutions);
    console.log('[useMovieNavigation] resolutions formateadas:', formatted);
    
    return { 
      path: `/player/${fileHash}`, 
      search: `resolutions=${formatted}` 
    };
  };

  // ✅ NAVEGACIÓN AL REPRODUCTOR (películas y episodios)
  const navigateToPlayer = (contentData) => {
    const params = buildPlayerParams(contentData);
    
    if (!params) {
      console.error('[useMovieNavigation] No se pudo generar URL para:', contentData);
      return;
    }
    
    const { path, search } = params;
    const url = `${path}?${search}`;
    console.log('[useMovieNavigation] to player:', url);
    navigate(url);
  };

  // ✅ NAVEGACIÓN A DETALLES (diferente para movies y series)
  const navigateToDetails = (contentData) => {
    const contentType = contentData.type;
    
    if (contentType === 'series') {
      console.log('[useMovieNavigation] to series details:', contentData.id);
      navigate(`/series/${contentData.id}`);
    } else if (contentType === 'movie') {
      console.log('[useMovieNavigation] to movie details:', contentData.id);
      navigate(`/movies/${contentData.id}`);
    } else {
      console.warn('[useMovieNavigation] Unknown content type:', contentType);
      // Fallback: intentar navegar como película
      navigate(`/movies/${contentData.id}`);
    }
  };

  // ✅ NUEVA: NAVEGACIÓN ESPECÍFICA PARA SERIES
  const navigateToSeries = (seriesData) => {
    console.log('[useMovieNavigation] to series:', seriesData.id);
    navigate(`/series/${seriesData.id}`);
  };

  // ✅ NUEVA: MANEJO INTELIGENTE DE CONTENT CARDS
  const handleContentCardClick = (contentData) => {
    const contentType = contentData.type;
    
    if (contentType === 'series') {
      // Series van a la página de episodios
      navigateToSeries(contentData);
    } else if (contentType === 'movie') {
      // Películas van a detalles (si existe) o directo al reproductor
      navigateToDetails(contentData);
    } else if (contentType === 'episode') {
      // Episodios van directo al reproductor
      navigateToPlayer(contentData);
    } else {
      console.warn('[useMovieNavigation] Unknown content type for click:', contentType);
      // Fallback: intentar ir a detalles
      navigateToDetails(contentData);
    }
  };

  // ✅ NUEVA: MANEJO INTELIGENTE DE BOTÓN PLAY
  const handleContentCardPlay = (contentData) => {
    const contentType = contentData.type;
    
    if (contentType === 'series') {
      // Series: ir a la página de episodios (no tiene play directo)
      navigateToSeries(contentData);
    } else {
      // Movies y episodes: ir al reproductor
      navigateToPlayer(contentData);
    }
  };

  return { 
    // Métodos básicos
    buildPlayerParams, 
    navigateToPlayer, 
    navigateToDetails,
    navigateToSeries,
    
    // Métodos inteligentes para ContentCard
    handleContentCardClick,
    handleContentCardPlay
  };
}

export { useMovieNavigation };