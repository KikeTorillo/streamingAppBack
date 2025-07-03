// ===== SERIES LIST PAGE - COLUMNAS CORREGIDAS PARA BACKEND REAL =====
// src/Pages/Admin/Series/SeriesListPage/SeriesListPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DataTable } from '../../../../components/organism/DataTable/DataTable';
import { Button } from '../../../../components/atoms/Button/Button';
import { Badge } from '../../../../components/atoms/Badge/Badge';
import './SeriesListPage.css';

// Servicios de series
import { getSeriesService } from '../../../../services/Series/getSeriesService';
import { deleteSeriesService } from '../../../../services/Series/deleteSeriesService';

/**
 * SeriesListPage - CORREGIDO con columnas reales del backend
 * 
 * ✅ COLUMNAS REALES: Solo campos que existen en la base de datos
 * ✅ BACKEND COMPATIBLE: Usa estructura real de series table
 * ✅ INFORMACIÓN CORRECTA: No muestra datos que no vienen del servidor
 * ✅ FECHAS CORREGIDAS: Misma lógica que MoviesListPage
 */
function SeriesListPage() {
  const navigate = useNavigate();

  // ===== ESTADOS =====
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // ===== CONFIGURACIÓN DE COLUMNAS CORREGIDAS =====
  const seriesColumns = [
    {
      id: 'id',
      accessorKey: 'id',
      header: 'ID',
      size: 60,
      cell: ({ getValue }) => (
        <span style={{ 
          fontFamily: 'var(--font-mono)', 
          fontSize: 'var(--font-size-sm)' 
        }}>
          #{getValue()}
        </span>
      )
    },
    {
      id: 'poster',
      accessorKey: 'cover_image',
      header: 'Portada',
      enableSorting: false,
      size: 80,
      cell: ({ getValue, row }) => {
        const coverImage = getValue();
        const title = row.original.title;
        
        return (
          <div style={{ 
            width: '60px', 
            height: '90px', 
            borderRadius: 'var(--radius-md)', 
            overflow: 'hidden',
            backgroundColor: 'var(--bg-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {coverImage ? (
              <img 
                src={coverImage} 
                alt={`Portada de ${title}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'var(--bg-muted)',
                display: coverImage ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--font-size-xl)',
                color: 'var(--text-secondary)'
              }}
            >
              📺
            </div>
          </div>
        );
      }
    },
    {
      id: 'title',
      accessorKey: 'title',
      header: 'Título',
      size: 250,
      cell: ({ getValue }) => {
        const title = getValue();
        
        return (
          <div>
            <div style={{ 
              fontWeight: 'var(--font-weight-semibold)',
              marginBottom: 'var(--space-xs)'
            }}>
              {title}
            </div>
            <Badge 
              variant="warning"
              size="xs"
              style="soft"
            >
              📺 Serie
            </Badge>
          </div>
        );
      }
    },
    {
      id: 'category',
      accessorKey: 'category_id',
      header: 'Categoría',
      size: 120,
      cell: ({ getValue }) => {
        const categoryId = getValue();
        
        // Si tienes las categorías cargadas, puedes hacer el mapeo
        // Por ahora mostramos el ID hasta que implementes la carga de categorías
        return (
          <Badge 
            variant="outline"
            size="sm"
            style="soft"
          >
            📂 Cat #{categoryId}
          </Badge>
        );
      }
    },
    {
      id: 'release_year',
      accessorKey: 'release_year',
      header: 'Año',
      size: 100,
      cell: ({ getValue }) => (
        <span style={{ 
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-mono)'
        }}>
          {getValue()}
        </span>
      )
    },
    {
      id: 'description',
      accessorKey: 'description',
      header: 'Descripción',
      size: 200,
      cell: ({ getValue }) => {
        const description = getValue();
        
        if (!description) {
          return (
            <span style={{ 
              color: 'var(--text-muted)',
              fontStyle: 'italic'
            }}>
              Sin descripción
            </span>
          );
        }
        
        // Truncar descripción larga
        const truncated = description.length > 80 
          ? description.substring(0, 80) + '...' 
          : description;
          
        return (
          <span 
            style={{ 
              color: 'var(--text-secondary)',
              fontSize: 'var(--font-size-sm)'
            }}
            title={description} // Tooltip con descripción completa
          >
            {truncated}
          </span>
        );
      }
    },
    {
      id: 'episodes_count',
      accessorKey: 'episodes_count',
      header: 'Episodios',
      size: 100,
      cell: ({ getValue }) => {
        const count = getValue() || 0;
        
        return (
          <Badge 
            variant={count > 0 ? 'success' : 'neutral'}
            size="sm"
            style="soft"
          >
            📹 {count}
          </Badge>
        );
      }
    },
    {
      id: 'created_at',
      accessorKey: 'created_at',
      header: 'Fecha Agregada',
      size: 140,
      cell: ({ getValue }) => {
        const date = new Date(getValue());
        const now = new Date();
        
        // ✅ CORREGIDO: Comparar solo las fechas (año, mes, día) ignorando horas
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const createdDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        
        // Calcular diferencia en días de forma correcta
        const diffTime = today.getTime() - createdDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        let timeDisplay;
        let badgeVariant = 'neutral';
        
        if (diffDays === 0) {
          // Mismo día = HOY
          timeDisplay = 'Hoy';
          badgeVariant = 'success';
        } else if (diffDays === 1) {
          // 1 día de diferencia = AYER
          timeDisplay = 'Ayer';
          badgeVariant = 'warning';
        } else if (diffDays === -1) {
          // Fecha futura (edge case)
          timeDisplay = 'Mañana';
          badgeVariant = 'info';
        } else if (diffDays > 1 && diffDays <= 7) {
          // Entre 2-7 días
          timeDisplay = `${diffDays} días`;
          badgeVariant = 'info';
        } else if (diffDays > 7 && diffDays <= 30) {
          // Entre 1-4 semanas
          const weeks = Math.floor(diffDays / 7);
          timeDisplay = weeks === 1 ? '1 sem' : `${weeks} sem`;
        } else if (diffDays > 30 && diffDays <= 365) {
          // Entre 1-12 meses
          const months = Math.floor(diffDays / 30);
          timeDisplay = months === 1 ? '1 mes' : `${months} meses`;
        } else if (diffDays > 365) {
          // Más de 1 año
          const years = Math.floor(diffDays / 365);
          timeDisplay = years === 1 ? '1 año' : `${years} años`;
        } else {
          // Fecha muy reciente (menos de 1 día)
          timeDisplay = date.toLocaleDateString('es-ES', { 
            month: 'short', 
            day: 'numeric'
          });
        }
        
        return (
          <div>
            <Badge 
              variant={badgeVariant}
              size="xs"
              style="soft"
            >
              {timeDisplay}
            </Badge>
            <div style={{ 
              fontSize: 'var(--font-size-xs)',
              color: 'var(--text-muted)',
              marginTop: 'var(--space-xs)'
            }}>
              {date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit', 
                year: 'numeric'
              })} {date.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        );
      }
    }
  ];

  // ===== FUNCIONES =====
  
  const loadSeries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const seriesData = await getSeriesService();
      
      console.log('📥 Datos recibidos del backend (series):', seriesData);
      
      setSeries(seriesData || []);
    } catch (err) {
      console.error('Error loading series:', err);
      setError('Error al cargar las series');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSeries = () => {
    navigate('/admin/series/create');
  };

  const handleEditSeries = (seriesItem) => {
    navigate(`/admin/series/edit/${seriesItem.id}`);
  };

  const handleViewSeries = (seriesItem) => {
    navigate(`/series/${seriesItem.id}`);
  };

  const handleDeleteSeries = async (seriesItem) => {
    const confirmMessage = 
      `¿Estás seguro de que quieres eliminar "${seriesItem.title}"?\n\n` +
      `⚠️ ADVERTENCIA: Esta acción eliminará permanentemente:\n` +
      `• Todos los episodios y videos asociados\n` +
      `• La imagen de portada\n` +
      `• Todos los datos de la serie\n\n` +
      `Esta acción NO se puede deshacer.`;
      
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setDeleting(seriesItem.id);
      
      console.log('🗑️ Eliminando serie:', seriesItem);
      
      const response = await deleteSeriesService(seriesItem.id);
      
      console.log('📥 Respuesta del servicio de eliminación:', response);
      
      console.log('✅ Serie eliminada exitosamente');
      
      alert(`✅ Serie "${seriesItem.title}" eliminada exitosamente`);
      
      await loadSeries();
      
    } catch (error) {
      console.error('💥 Error al eliminar serie:', error);
      
      let errorMessage = `Error al eliminar la serie "${seriesItem.title}".`;
      
      if (error.response?.status === 401) {
        console.log('🔒 Sesión expirada, redirigiendo...');
        sessionStorage.clear();
        navigate('/login');
        return;
      } else if (error.response?.status === 404) {
        errorMessage = 'La serie no existe o ya fue eliminada.';
      } else if (error.response?.status === 403) {
        errorMessage = 'No tienes permisos para eliminar esta serie.';
      } else if (error.response?.status === 409) {
        errorMessage = 'No se puede eliminar la serie porque tiene episodios asociados.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`❌ ${errorMessage}`);
      
    } finally {
      setDeleting(null);
    }
  };

  const handleImportFromTMDB = () => {
    navigate('/admin/series/create');
  };

  // ===== EFECTOS =====
  useEffect(() => {
    loadSeries();
  }, []);

  // ===== ESTADÍSTICAS MEJORADAS =====
  const getSeriesStats = () => {
    const total = series.length;
    const thisWeek = series.filter(seriesItem => {
      const createdDate = new Date(seriesItem.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdDate >= weekAgo;
    }).length;
    
    const withCategory = series.filter(seriesItem => seriesItem.category_id).length;
    const withEpisodes = series.filter(seriesItem => (seriesItem.episodes_count || 0) > 0).length;
    const totalEpisodes = series.reduce((sum, seriesItem) => sum + (seriesItem.episodes_count || 0), 0);
    
    return { total, thisWeek, withCategory, withEpisodes, totalEpisodes };
  };

  const stats = getSeriesStats();

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Gestión de Series"
      subtitle={(() => {
        if (loading) return 'Cargando series...';
        if (error) return 'Error al cargar series';
        if (stats.total === 0) return 'No hay series registradas';
        
        return `${stats.total} series | ${stats.totalEpisodes} episodios | ${stats.thisWeek} nuevas esta semana | ${stats.withEpisodes} con episodios`;
      })()}
      headerActions={
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleImportFromTMDB}
            leftIcon="🔍"
          >
            Buscar en TMDB
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleCreateSeries}
            leftIcon="➕"
          >
            Agregar Serie
          </Button>
        </div>
      }
    >
      <div className="series-list">
        {error && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            padding: 'var(--space-lg)' 
          }}>
            <Badge 
              variant="danger" 
              size="lg"
              icon="❌"
              style="soft"
            >
              {error}
            </Badge>
          </div>
        )}

        <DataTable
          data={series}
          columns={seriesColumns}
          loading={loading}
          onEdit={handleEditSeries}
          onView={handleViewSeries}
          onDelete={handleDeleteSeries}
          deleting={deleting}
          emptyTitle="No hay series registradas"
          emptyDescription="Comienza agregando tu primera serie"
          emptyIcon="📺"
          emptyAction={
            <Button 
              variant="primary" 
              onClick={handleCreateSeries}
              leftIcon="➕"
            >
              Agregar Primera Serie
            </Button>
          }
          searchable
          searchPlaceholder="Buscar por título, categoría o año..."
          pageSize={10}
          pageSizeOptions={[5, 10, 25, 50]}
          variant="striped"
        />
      </div>
    </AdminLayout>
  );
}

export { SeriesListPage };