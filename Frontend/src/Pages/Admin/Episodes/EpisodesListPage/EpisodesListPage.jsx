// ===== EPISODES LIST PAGE - FIX: AGREGAR SELECT DE SERIES =====
// src/Pages/Admin/Episodes/EpisodesListPage/EpisodesListPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DataTable } from '../../../../components/organism/DataTable/DataTable';
import { Button } from '../../../../components/atoms/Button/Button';
import './EpisodesListPage.css';

// Servicios de episodios y series
import { getEpisodesService } from '../../../../services/Episodes/getEpisodesService';
import { deleteEpisodeService } from '../../../../services/Episodes/deleteEpisodeService';
import { getSeriesService } from '../../../../services/Series/getSeriesService';

/**
 * EpisodesListPage - Página de gestión de episodios con select de series
 * 
 * ✅ FIX: Agregado select de series para obtener serieId requerido
 * ✅ SOLUCIÓN SIMPLE: Usa select nativo de HTML
 * ✅ PATRÓN: Mantiene la estructura existente
 */
function EpisodesListPage() {
  const navigate = useNavigate();

  // ===== ESTADOS =====
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  
  // 🆕 Estados para series
  const [series, setSeries] = useState([]);
  const [selectedSerieId, setSelectedSerieId] = useState('');
  const [seriesLoading, setSeriesLoading] = useState(true);
  const [seriesError, setSeriesError] = useState(null);

  // ===== FUNCIONES AUXILIARES =====
  
  /**
   * ✅ Formatear fechas (sin cambios)
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  /**
   * ✅ Formatear temporada y episodio (sin cambios)
   */
  const formatSeasonEpisode = (season, episodeNumber) => {
    if (!season && !episodeNumber) return 'Sin especificar';
    if (!season) return `Ep. ${episodeNumber}`;
    if (!episodeNumber) return `T${season}`;
    return `T${season}E${episodeNumber}`;
  };

  /**
   * ✅ Formatear nombre de serie (sin cambios)
   */
  const formatSerieName = (serie) => {
    if (!serie) return 'Sin serie';
    return typeof serie === 'object' ? serie.title || serie.name : serie;
  };

  /**
   * ✅ Formatear duración (sin cambios)
   */
  const formatDuration = (duration) => {
    if (!duration) return 'Sin especificar';
    
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // ===== CONFIGURACIÓN DE COLUMNAS (sin cambios) =====
  
  const episodesColumns = [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 80,
      cell: ({ row }) => (
        <span className="episodes-list__id">
          {row.original.id}
        </span>
      )
    },
    {
      accessorKey: 'title',
      header: 'Título de Episodio',
      cell: ({ row }) => (
        <div className="episodes-list__title">
          <span className="episodes-list__title-text">
            {row.original.title || 'Sin título'}
          </span>
          <span className="episodes-list__title-badge">
            📺 Episodio
          </span>
        </div>
      )
    },
    {
      accessorKey: 'serie',
      header: 'Serie',
      size: 200,
      cell: ({ row }) => (
        <span className="episodes-list__serie">
          {formatSerieName(row.original.serie)}
        </span>
      )
    },
    {
      accessorKey: 'seasonEpisode',
      header: 'T/E',
      size: 100,
      cell: ({ row }) => (
        <span className="episodes-list__season-episode">
          {formatSeasonEpisode(row.original.season, row.original.episodeNumber)}
        </span>
      )
    },
    {
      accessorKey: 'duration',
      header: 'Duración',
      size: 120,
      cell: ({ row }) => (
        <span className="episodes-list__duration">
          {formatDuration(row.original.duration)}
        </span>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha de Creación',
      size: 180,
      cell: ({ row }) => (
        <span className="episodes-list__date">
          {formatDate(row.original.createdAt)}
        </span>
      )
    }
  ];

  // ===== EFECTOS =====
  
  /**
   * 🆕 Cargar series al montar el componente
   */
  useEffect(() => {
    loadSeries();
  }, []);

  /**
   * 🆕 Cargar episodios cuando se selecciona una serie
   */
  useEffect(() => {
    if (selectedSerieId) {
      loadEpisodes();
    } else {
      setEpisodes([]);
    }
  }, [selectedSerieId]);

  // ===== FUNCIONES DE CARGA =====
  
  /**
   * 🆕 Cargar series disponibles
   */
  const loadSeries = async () => {
    try {
      setSeriesLoading(true);
      setSeriesError(null);
      
      console.log('📺 Cargando series disponibles...');
      const response = await getSeriesService();
      const seriesData = Array.isArray(response) ? response : response.data || [];
      
      console.log(`✅ Series cargadas: ${seriesData.length} elementos`);
      setSeries(seriesData);
      
    } catch (error) {
      console.error('❌ Error al cargar series:', error);
      setSeriesError('Error al cargar las series');
    } finally {
      setSeriesLoading(false);
    }
  };

  /**
   * 🔄 Cargar episodios de la serie seleccionada
   */
  const loadEpisodes = async () => {
    if (!selectedSerieId) return;

    try {
      setLoading(true);
      setError(null);
      
      console.log(`📺 Cargando episodios de la serie ${selectedSerieId}...`);
      
      // 🆕 Pasar serieId como filtro requerido
      const response = await getEpisodesService({ serieId: selectedSerieId });
      const episodesData = Array.isArray(response) ? response : response.data || [];
      
      console.log(`✅ Episodios cargados: ${episodesData.length} elementos`);
      setEpisodes(episodesData);
      
    } catch (error) {
      console.error('❌ Error al cargar episodios:', error);
      
      if (error.response?.status === 401) {
        setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
      } else {
        setError('Error al cargar la lista de episodios. Inténtalo nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ===== HANDLERS DE ACCIONES (sin cambios) =====
  
  const handleViewEpisode = (episode) => {
    console.log('👁️ Ver episodio:', episode);
    // TODO: Implementar modal o página de detalle
    alert(`Ver episodio: ${episode.title || `T${episode.season}E${episode.episodeNumber}`}`);
  };

  const handleEditEpisode = (episode) => {
    console.log('✏️ Editar episodio:', episode);
    navigate(`/admin/episodes/edit/${episode.id}`);
  };

  const handleCreateEpisode = () => {
    navigate('/admin/episodes/create');
  };

  const handleDeleteEpisode = async (episode) => {
    const confirmMessage = `¿Estás seguro de que deseas eliminar el episodio "${episode.title || `T${episode.season}E${episode.episodeNumber}`}"?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setDeleting(episode.id);
      console.log('🗑️ Eliminando episodio:', episode);
      
      await deleteEpisodeService(episode.id);
      console.log('✅ Episodio eliminado exitosamente');
      
      alert(`Episodio "${episode.title || `T${episode.season}E${episode.episodeNumber}`}" eliminado exitosamente.`);
      loadEpisodes(); // Recargar lista
      
    } catch (error) {
      console.error('❌ Error al eliminar episodio:', error);
      
      if (error.response?.status === 404) {
        alert('El episodio no existe o ya fue eliminado.');
        loadEpisodes();
      } else if (error.response?.status === 401) {
        alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
      } else {
        alert('Error al eliminar el episodio. Inténtalo nuevamente.');
      }
    } finally {
      setDeleting(null);
    }
  };

  // ===== HANDLERS DEL SELECT =====
  
  /**
   * 🆕 Manejar cambio de serie seleccionada
   */
  const handleSerieChange = (event) => {
    const serieId = event.target.value;
    setSelectedSerieId(serieId);
  };

  // ===== CONFIGURACIÓN DEL LAYOUT =====
  
  const breadcrumbs = [
    { label: 'Inicio', href: '/admin' },
    { label: 'Episodios', href: '/admin/episodes' }
  ];

  const headerActions = (
    <Button
      variant="primary"
      size="md"
      onClick={handleCreateEpisode}
      disabled={loading}
    >
      + Crear Episodio
    </Button>
  );

  /**
   * 🔄 Estadísticas actualizadas
   */
  const calculateEpisodeStats = () => {
    if (!episodes.length) {
      return {
        total: 0,
        newEpisodes: 0,
        withSeries: 0,
        withoutSeries: 0
      };
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const newEpisodes = episodes.filter(episode => {
      if (!episode.createdAt) return false;
      const createdDate = new Date(episode.createdAt);
      return createdDate >= sevenDaysAgo;
    }).length;

    const withSeries = episodes.filter(episode => episode.serie && episode.serie.id).length;
    const withoutSeries = episodes.length - withSeries;

    return {
      total: episodes.length,
      newEpisodes,
      withSeries,
      withoutSeries
    };
  };

  const stats = calculateEpisodeStats();

  // ===== CONFIGURACIÓN DE DATATABLES =====
  
  const dataTableProps = {
    data: episodes,
    columns: episodesColumns,
    loading,
    error,
    searchable: true,
    searchPlaceholder: "Buscar episodios por título...",
    pageSize: 10,
    onView: handleViewEpisode,
    onEdit: handleEditEpisode,
    onDelete: handleDeleteEpisode,
    deleting,
    emptyTitle: selectedSerieId ? "No hay episodios" : "Selecciona una serie",
    emptyDescription: selectedSerieId
      ? "La serie seleccionada no tiene episodios registrados."
      : "Elige una serie del selector para ver sus episodios.",
    emptyIcon: "📺",
    emptyAction: selectedSerieId ? (
      <Button variant="primary" size="sm" onClick={handleCreateEpisode}>
        Crear Episodio
      </Button>
    ) : null
  };

  // ===== RENDER =====
  
  return (
    <AdminLayout
      title="Gestión de Episodios"
      breadcrumbs={breadcrumbs}
      actions={headerActions}
    >
      <div className="episodes-list-page">
        <div className="episodes-list-page__content">
          
          {/* 🆕 SELECTOR DE SERIES */}
          <div className="episodes-list-page__filters">
            <div className="episodes-list-page__filter-group">
              <label htmlFor="serie-select" className="episodes-list-page__filter-label">
                📺 Seleccionar Serie:
              </label>
              <select
                id="serie-select"
                value={selectedSerieId}
                onChange={handleSerieChange}
                disabled={seriesLoading}
                className="episodes-list-page__serie-select"
              >
                <option value="">
                  {seriesLoading 
                    ? '⏳ Cargando series...' 
                    : seriesError 
                    ? '❌ Error al cargar series'
                    : series.length === 0
                    ? '📺 No hay series disponibles'
                    : '-- Selecciona una serie --'
                  }
                </option>
                {series.map(serie => (
                  <option key={serie.id} value={serie.id}>
                    {serie.title} ({serie.release_year || 'Sin año'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ESTADÍSTICAS (solo si hay serie seleccionada) */}
          {selectedSerieId && (
            <div className="episodes-list-page__stats">
              <div className="episodes-list-page__stat-card">
                <h3>📊 Estadísticas de Episodios</h3>
                <div className="episodes-list-page__stat-grid">
                  <div className="episodes-list-page__stat-item">
                    <span className="episodes-list-page__stat-number">{stats.total}</span>
                    <span className="episodes-list-page__stat-label">Total de episodios</span>
                  </div>
                  <div className="episodes-list-page__stat-item">
                    <span className="episodes-list-page__stat-number">{stats.newEpisodes}</span>
                    <span className="episodes-list-page__stat-label">Nuevos (7 días)</span>
                  </div>
                  <div className="episodes-list-page__stat-item">
                    <span className="episodes-list-page__stat-number">{stats.withSeries}</span>
                    <span className="episodes-list-page__stat-label">Con serie asignada</span>
                  </div>
                  <div className="episodes-list-page__stat-item">
                    <span className="episodes-list-page__stat-number">{stats.withoutSeries}</span>
                    <span className="episodes-list-page__stat-label">Sin serie asignada</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TABLA DE EPISODIOS */}
          <DataTable {...dataTableProps} />
        </div>
      </div>
    </AdminLayout>
  );
}

export { EpisodesListPage };