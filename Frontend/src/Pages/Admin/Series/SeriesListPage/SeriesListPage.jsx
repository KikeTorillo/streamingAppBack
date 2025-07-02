// ===== SERIES LIST PAGE - HOMOLOGADO CON CATEGORIES Y MOVIES =====
// src/Pages/Admin/Series/SeriesListPage/SeriesListPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DataTable } from '../../../../components/organism/DataTable/DataTable';
import { Button } from '../../../../components/atoms/Button/Button';
import './SeriesListPage.css';

// Servicios de series
import { getSeriesService } from '../../../../services/Series/getSeriesService';
import { deleteSeriesService } from '../../../../services/Series/deleteSeriesService';

/**
 * SeriesListPage - Página de gestión de series COMPLETA
 * 
 * ✅ SISTEMA DE DISEÑO: Solo componentes con stories de Storybook
 * ✅ BACKEND: Homologado con servicios existentes
 * ✅ PATRÓN: Sigue exactamente el mismo patrón que CategoriesListPage y MoviesListPage
 * ✅ UX: Estados de loading, error y success consistentes
 * ✅ CRUD: Operaciones de Ver, Editar y Eliminar implementadas
 */
function SeriesListPage() {
  const navigate = useNavigate();

  // ===== ESTADOS =====
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // ===== FUNCIONES AUXILIARES =====
  
  /**
   * ✅ Formatear fechas (adaptado para series)
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
   * ✅ Formatear año de lanzamiento
   */
  const formatReleaseYear = (year) => {
    if (!year) return 'Sin año';
    return year.toString();
  };

  /**
   * ✅ Formatear nombre de categoría
   */
  const formatCategoryName = (category) => {
    if (!category) return 'Sin categoría';
    return typeof category === 'object' ? category.name : category;
  };

  // ===== CONFIGURACIÓN DE COLUMNAS =====
  
  /**
   * ✅ Columnas de la tabla - SIN columna de acciones personalizada (usa DataTable integrado)
   */
  const seriesColumns = [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 80,
      cell: ({ row }) => (
        <span className="series-list__id">
          {row.original.id}
        </span>
      )
    },
    {
      accessorKey: 'title',
      header: 'Título de Serie',
      cell: ({ row }) => (
        <div className="series-list__title">
          <span className="series-list__title-text">
            {row.original.title}
          </span>
          <span className="series-list__title-badge">
            📺 Serie
          </span>
        </div>
      )
    },
    {
      accessorKey: 'category',
      header: 'Categoría',
      size: 150,
      cell: ({ row }) => (
        <span className="series-list__category">
          {formatCategoryName(row.original.category)}
        </span>
      )
    },
    {
      accessorKey: 'releaseYear',
      header: 'Año',
      size: 100,
      cell: ({ row }) => (
        <span className="series-list__year">
          {formatReleaseYear(row.original.releaseYear)}
        </span>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha de Creación',
      size: 180,
      cell: ({ row }) => (
        <span className="series-list__date">
          {formatDate(row.original.createdAt)}
        </span>
      )
    }
  ];

  // ===== EFECTOS =====
  
  /**
   * ✅ Cargar series al montar el componente
   */
  useEffect(() => {
    loadSeries();
  }, []);

  // ===== FUNCIONES DE CARGA =====
  
  /**
   * ✅ Cargar series desde el backend
   */
  const loadSeries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📺 Cargando lista de series...');
      const response = await getSeriesService();
      
      // Verificar formato de respuesta
      const seriesData = Array.isArray(response) ? response : response.data || [];
      
      console.log(`✅ Series cargadas: ${seriesData.length} elementos`);
      setSeries(seriesData);
      
    } catch (error) {
      console.error('❌ Error al cargar series:', error);
      
      // Manejo específico de errores
      if (error.response?.status === 401) {
        setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
        // Opcional: redirigir al login
        // navigate('/login');
      } else {
        setError('Error al cargar la lista de series. Inténtalo nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ===== ESTADÍSTICAS CALCULADAS =====
  
  /**
   * ✅ Calcular estadísticas de series
   */
  const stats = React.useMemo(() => {
    if (!Array.isArray(series)) return { total: 0, recentlyCreated: 0, withCategory: 0, withoutCategory: 0 };

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

    return {
      total: series.length,
      recentlyCreated: series.filter(serie => {
        const createdAt = new Date(serie.createdAt);
        return createdAt >= sevenDaysAgo;
      }).length,
      withCategory: series.filter(serie => 
        serie.category && (typeof serie.category === 'object' ? serie.category.name : serie.category)
      ).length,
      withoutCategory: series.filter(serie => 
        !serie.category || (typeof serie.category === 'object' && !serie.category.name)
      ).length
    };
  }, [series]);

  // ===== HANDLERS DE ACCIONES =====
  
  /**
   * ✅ Actualizar lista
   */
  const handleRefresh = () => {
    loadSeries();
  };

  /**
   * ✅ Crear nueva serie
   */
  const handleCreateSeries = () => {
    navigate('/admin/series/create');
  };

  /**
   * ✅ Ver serie (navegación a página de detalle)
   */
  const handleViewSeries = (serie) => {
    console.log('👁️ Ver serie:', serie.title);
    // TODO: Implementar cuando exista la página de detalle
    alert(`Ver serie: ${serie.title}\n\nPágina de detalle próximamente...`);
  };

  /**
   * ✅ Editar serie
   */
  const handleEditSeries = (serie) => {
    console.log('✏️ Editar serie:', serie.title);
    navigate(`/admin/series/edit/${serie.id}`);
  };

  /**
   * ✅ Eliminar serie con confirmación
   */
  const handleDeleteSeries = async (serie) => {
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar la serie "${serie.title}"?\n\n` +
      `Esta acción no se puede deshacer y se eliminarán todos los episodios asociados.`
    );

    if (!confirmed) return;

    try {
      setDeleting(serie.id);
      console.log('🗑️ Eliminando serie:', serie.title);
      
      await deleteSeriesService(serie.id);
      
      console.log('✅ Serie eliminada exitosamente');
      
      // Actualizar la lista sin hacer nueva petición
      setSeries(prevSeries => prevSeries.filter(s => s.id !== serie.id));
      
      // Mostrar mensaje de éxito (opcional)
      alert(`La serie "${serie.title}" ha sido eliminada exitosamente.`);
      
    } catch (error) {
      console.error('❌ Error al eliminar serie:', error);
      
      let errorMessage = 'Error al eliminar la serie.';
      
      if (error.response?.status === 404) {
        errorMessage = 'La serie ya no existe.';
        // Actualizar la lista para reflejar el estado real
        setSeries(prevSeries => prevSeries.filter(s => s.id !== serie.id));
      } else if (error.response?.status === 400) {
        errorMessage = 'No se puede eliminar la serie porque tiene episodios asociados.';
      } else if (error.response?.status === 401) {
        errorMessage = 'No tienes permisos para eliminar esta serie.';
      }
      
      alert(errorMessage);
    } finally {
      setDeleting(null);
    }
  };

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Gestión de Series"
      subtitle={`${stats.total} serie${stats.total !== 1 ? 's' : ''} registrada${stats.total !== 1 ? 's' : ''}`}
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Series' }
      ]}
      headerActions={
        <div className="series-list__header-actions">
          <Button
            variant="outline"
            size="sm"
            leftIcon="🔄"
            onClick={handleRefresh}
            loading={loading}
            disabled={loading}
          >
            Actualizar
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon="📺"
            onClick={handleCreateSeries}
          >
            Crear Serie
          </Button>
        </div>
      }
    >
      <div className="series-list">
        {/* ===== ESTADÍSTICAS ===== */}
        {!loading && !error && stats.total > 0 && (
          <div className="series-list__summary">
            <div className="series-list__stats">
              <div className="series-list__stat">
                <span className="series-list__stat-value">
                  {stats.total}
                </span>
                <span className="series-list__stat-label">Total Series</span>
              </div>
              <div className="series-list__stat">
                <span className="series-list__stat-value">
                  {stats.recentlyCreated}
                </span>
                <span className="series-list__stat-label">Nuevas (7 días)</span>
              </div>
              <div className="series-list__stat">
                <span className="series-list__stat-value">
                  {stats.withCategory}
                </span>
                <span className="series-list__stat-label">Con Categoría</span>
              </div>
              <div className="series-list__stat">
                <span className="series-list__stat-value">
                  {stats.withoutCategory}
                </span>
                <span className="series-list__stat-label">Sin Categoría</span>
              </div>
            </div>
          </div>
        )}

        {/* ===== TABLA DE SERIES ===== */}
        <div className="series-list__table">
          <DataTable
            data={series}
            columns={seriesColumns}
            loading={loading}
            error={error}
            searchPlaceholder="Buscar series por título..."
            pageSizeOptions={[10, 25, 50, 100]}
            defaultPageSize={25}
            variant="default"
            emptyTitle="No hay series registradas"
            emptyDescription="Crea tu primera serie para comenzar a organizar episodios y contenido"
            emptyIcon="📺"
            onView={handleViewSeries}
            onEdit={handleEditSeries}
            onDelete={handleDeleteSeries}
            className={deleting ? 'series-list__table--deleting' : ''}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

export { SeriesListPage };