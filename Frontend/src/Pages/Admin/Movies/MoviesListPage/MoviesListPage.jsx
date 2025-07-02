// ===== MOVIES LIST PAGE - ADMIN PANEL (CON BORRADO IMPLEMENTADO) =====
// src/Pages/Admin/Movies/MoviesListPage/MoviesListPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DataTable } from '../../../../components/organism/DataTable/DataTable';
import { Button } from '../../../../components/atoms/Button/Button';
import { Badge } from '../../../../components/atoms/Badge/Badge';
import './MoviesListPage.css';

// Importar servicios
import { getMoviesService } from '../../../../services/Movies/getMoviesService';
import { deleteMovieService } from '../../../../services/Movies/deleteMovieService';

/**
 * MoviesListPage - Página de listado de películas para el admin panel
 * 
 * ✅ SISTEMA DE DISEÑO: AdminLayout + DataTable + componentes del sistema
 * ✅ PATRÓN: Mismo flujo que UsersListPage/CategoriesListPage
 * ✅ FUNCIONALIDADES: CRUD completo, filtros, búsqueda
 * ✅ UX: Estados de loading, error y success consistentes
 * ✅ BORRADO: Implementado con deleteMovieService
 * ✅ COMPONENTES: Solo componentes con stories de Storybook
 */
function MoviesListPage() {
  const navigate = useNavigate();

  // ===== ESTADOS =====
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null); // ID de la película siendo eliminada

  // ===== CONFIGURACIÓN DE COLUMNAS PARA DATATABLE =====
  const movieColumns = [
    {
      id: 'poster',
      accessorKey: 'poster',
      header: 'Poster',
      enableSorting: false,
      size: 80,
      cell: ({ getValue, row }) => {
        const posterUrl = getValue();
        const title = row.original.title;
        
        return (
          <div style={{ width: '60px', height: '90px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            {posterUrl ? (
              <img 
                src={posterUrl} 
                alt={`Poster de ${title}`}
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
                display: posterUrl ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.0rem'
              }}
            >
              🎬
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
      cell: ({ getValue, row }) => {
        const title = getValue();
        const year = row.original.year;
        return (
          <div>
            <div style={{ 
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-xs)'
            }}>
              {title}
            </div>
            {year && (
              <div style={{ 
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-muted)'
              }}>
                {year}
              </div>
            )}
          </div>
        );
      }
    },
    {
      id: 'category',
      accessorKey: 'category',
      header: 'Categoría',
      size: 130,
      cell: ({ getValue }) => {
        const category = getValue();
        return category ? (
          <Badge 
            variant="neutral"
            style="soft"
            size="sm"
          >
            {category}
          </Badge>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>Sin categoría</span>
        );
      }
    },
    {
      id: 'type',
      accessorKey: 'type',
      header: 'Tipo',
      size: 100,
      cell: ({ getValue }) => {
        const type = getValue();
        const isMovie = type === 'movie';
        return (
          <Badge 
            variant={isMovie ? 'primary' : 'secondary'}
            style="soft"
            size="sm"
            icon={isMovie ? '🎬' : '📺'}
          >
            {isMovie ? 'Película' : 'Serie'}
          </Badge>
        );
      }
    },
    {
      id: 'duration',
      accessorKey: 'duration',
      header: 'Duración',
      size: 100,
      cell: ({ getValue, row }) => {
        const duration = getValue();
        const type = row.original.type;
        
        if (!duration) {
          return <span style={{ color: 'var(--text-muted)' }}>--</span>;
        }
        
        if (type === 'series') {
          return `${duration} ep.`;
        }
        
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
      }
    },
    {
      id: 'rating',
      accessorKey: 'rating',
      header: 'Rating',
      size: 100,
      cell: ({ getValue }) => {
        const rating = getValue();
        return rating ? (
          <Badge 
            variant="warning" 
            style="soft"
            icon="⭐"
            size="sm"
          >
            {rating}
          </Badge>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>Sin rating</span>
        );
      }
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Estado',
      size: 100,
      cell: ({ getValue }) => {
        const status = getValue();
        return (
          <Badge 
            variant={status === 'active' ? 'success' : 'neutral'}
            style="soft"
            size="sm"
          >
            {status === 'active' ? 'Activo' : 'Inactivo'}
          </Badge>
        );
      }
    }
  ];

  // ===== FUNCIONES =====
  
  /**
   * Cargar lista de películas
   */
  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const moviesData = await getMoviesService();
      setMovies(moviesData || []);
    } catch (err) {
      console.error('Error loading movies:', err);
      setError('Error al cargar las películas');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Crear nueva película
   */
  const handleCreateMovie = () => {
    navigate('/admin/movies/create');
  };

  /**
   * Editar película
   */
  const handleEditMovie = (movie) => {
    navigate(`/admin/movies/edit/${movie.id}`);
  };

  /**
   * Ver película (navegar al reproductor)
   */
  const handleViewMovie = (movie) => {
    navigate(`/movie/${movie.id}`);
  };

  /**
   * ✅ ELIMINAR PELÍCULA - IMPLEMENTACIÓN COMPLETA CON DELETEMOVIESERVICE
   * Sigue el mismo patrón que CategoriesListPage
   */
  const handleDeleteMovie = async (movie) => {
    // Confirmación con información detallada
    const confirmMessage = 
      `¿Estás seguro de que quieres eliminar "${movie.title}"?\n\n` +
      `⚠️ ADVERTENCIA: Esta acción eliminará permanentemente:\n` +
      `• El archivo de video y todos sus archivos asociados\n` +
      `• La imagen de portada\n` +
      `• Todos los datos de la película\n\n` +
      `Esta acción NO se puede deshacer.`;
      
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setDeleting(movie.id);
      
      console.log('🗑️ Eliminando película:', movie);
      
      // ✅ USAR SERVICIO REAL - deleteMovieService
      const response = await deleteMovieService(movie.id);
      
      console.log('📥 Respuesta del servicio de eliminación:', response);
      
      // ✅ Si llegamos aquí, la eliminación fue exitosa
      console.log('✅ Película eliminada exitosamente');
      
      // Mostrar notificación de éxito usando alert (se puede mejorar con toast)
      alert(`✅ Película "${movie.title}" eliminada exitosamente`);
      
      // Recargar lista para reflejar los cambios
      await loadMovies();
      
    } catch (error) {
      console.error('💥 Error al eliminar película:', error);
      
      // ✅ Manejar errores específicos del backend
      let errorMessage = `Error al eliminar la película "${movie.title}".`;
      
      if (error.response?.status === 401) {
        // Sesión expirada
        console.log('🔒 Sesión expirada, redirigiendo...');
        sessionStorage.clear();
        navigate('/login');
        return;
      } else if (error.response?.status === 404) {
        errorMessage = 'La película no existe o ya fue eliminada.';
      } else if (error.response?.status === 403) {
        errorMessage = 'No tienes permisos para eliminar esta película.';
      } else if (error.response?.status === 409) {
        errorMessage = 'No se puede eliminar la película porque tiene datos asociados.';
      } else if (error.response?.data?.message) {
        // Mensaje específico del backend
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Mostrar error al usuario
      alert(`❌ ${errorMessage}`);
      
    } finally {
      setDeleting(null);
    }
  };

  /**
   * Importar desde TMDB
   */
  const handleImportFromTMDB = () => {
    navigate('/admin/movies/create');
  };

  // ===== EFECTOS =====
  useEffect(() => {
    loadMovies();
  }, []);

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Gestión de Películas y Series"
      subtitle={`${movies.length} contenidos registrados en el sistema`}
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
            onClick={handleCreateMovie}
            leftIcon="➕"
          >
            Agregar Contenido
          </Button>
        </div>
      }
    >
      <div className="movies-list-container">
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
          data={movies}
          columns={movieColumns}
          loading={loading}
          onEdit={handleEditMovie}
          onView={handleViewMovie}
          onDelete={handleDeleteMovie}
          deleting={deleting} // Estado de eliminación para UI
          emptyTitle="No hay películas registradas"
          emptyDescription="Comienza agregando tu primera película o serie"
          emptyIcon="🎬"
          emptyAction={
            <Button 
              variant="primary" 
              onClick={handleCreateMovie}
              leftIcon="➕"
            >
              Agregar Primera Película
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

export { MoviesListPage };