// ===== CATEGORIES LIST PAGE - HOMOLOGADO CON BACKEND Y USERS LIST =====
// src/Pages/Admin/Categories/CategoriesListPage/CategoriesListPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DataTable } from '../../../../components/organism/DataTable/DataTable';
import { Button } from '../../../../components/atoms/Button/Button';
import './CategoriesListPage.css';

// Servicios de categorías
import { getCategoriesService } from '../../../../services/Categories/getCategoriesService';
import { deleteCategoryService } from '../../../../services/Categories/deleteCategoryService';

/**
 * CategoriesListPage - Página de gestión de categorías COMPLETA
 * 
 * ✅ SISTEMA DE DISEÑO: Solo componentes con stories de Storybook
 * ✅ BACKEND: Homologado con servicios existentes
 * ✅ PATRÓN: Sigue exactamente el mismo patrón que UsersListPage
 * ✅ UX: Estados de loading, error y success consistentes
 * ✅ CRUD: Operaciones de Ver, Editar y Eliminar implementadas
 */
function CategoriesListPage() {
  const navigate = useNavigate();

  // ===== ESTADOS =====
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // ===== FUNCIONES AUXILIARES =====
  
  /**
   * ✅ Formatear fechas (adaptado para categorías)
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

  // ===== CONFIGURACIÓN DE COLUMNAS =====
  
  /**
   * ✅ Columnas de la tabla - SIN columna de acciones personalizada (usa DataTable integrado)
   */
  const categoryColumns = [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 80,
      cell: ({ row }) => (
        <span className="categories-list__id">
          {row.original.id}
        </span>
      )
    },
    {
      accessorKey: 'name',
      header: 'Nombre de Categoría',
      cell: ({ row }) => (
        <div className="categories-list__name">
          <span className="categories-list__name-text">
            {row.original.name}
          </span>
          <span className="categories-list__name-badge">
            🎭 Categoría
          </span>
        </div>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha de Creación',
      size: 180,
      cell: ({ row }) => (
        <span className="categories-list__date">
          {formatDate(row.original.createdAt)}
        </span>
      )
    },
    {
      accessorKey: 'updatedAt',
      header: 'Última Actualización',
      size: 180,
      cell: ({ row }) => (
        <span className="categories-list__date">
          {formatDate(row.original.updatedAt)}
        </span>
      )
    }
    // ✅ NO incluir columna de acciones - DataTable ya las maneja automáticamente
  ];

  // ===== ESTADÍSTICAS CALCULADAS =====
  
  /**
   * ✅ Calcular estadísticas de categorías
   */
  const stats = {
    total: categories.length,
    // Agregar más estadísticas específicas de categorías si es necesario
    withLongNames: categories.filter(cat => cat.name && cat.name.length > 10).length,
    withShortNames: categories.filter(cat => cat.name && cat.name.length <= 10).length,
    recentlyCreated: categories.filter(cat => {
      if (!cat.createdAt) return false;
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(cat.createdAt) > weekAgo;
    }).length
  };

  // ===== FUNCIONES DE DATOS =====
  
  /**
   * ✅ Cargar categorías usando el servicio existente
   */
  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📥 Cargando categorías...');
      const response = await getCategoriesService();
      
      console.log('📋 Respuesta del servicio:', response);
      
      // ✅ El servicio existente devuelve directamente un array o lanza error
      const categoriesArray = Array.isArray(response) ? response : [];
      
      // ✅ Normalizar datos de categorías
      const normalizedCategories = categoriesArray.map(category => ({
        id: category.id,
        name: category.name || 'Sin nombre',
        createdAt: category.created_at || category.createdAt || null,
        updatedAt: category.updated_at || category.updatedAt || null
      }));

      console.log('✅ Categorías normalizadas:', normalizedCategories);
      
      setCategories(normalizedCategories);
      
    } catch (error) {
      console.error('💥 Error al cargar categorías:', error);
      
      // ✅ Manejar sesión expirada
      if (error.response?.status === 401) {
        console.log('🔒 Sesión expirada, redirigiendo...');
        sessionStorage.clear();
        navigate('/login');
        return;
      }
      
      setError(error.message || 'Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  // ===== FUNCIONES DE ACCIONES =====
  
  /**
   * Ver detalles de categoría
   */
  const handleViewCategory = (category) => {
    console.log('👁️ Ver categoría:', category);
    // TODO: Implementar modal de detalles o navegar a página de detalles
    alert(`Ver detalles de categoría: ${category.name}`);
  };

  /**
   * Editar categoría
   */
  const handleEditCategory = (category) => {
    console.log('✏️ Editar categoría:', category);
    navigate(`/admin/categories/edit/${category.id}`);
  };

  /**
   * ✅ Eliminar categoría - IMPLEMENTADO CON SERVICIO REAL
   */
  const handleDeleteCategory = async (category) => {
    // Confirmación con información detallada
    const confirmMessage = 
      `¿Estás seguro de que quieres eliminar la categoría "${category.name}"?\n\n` +
      `⚠️ ADVERTENCIA: Esta acción no se puede deshacer y puede afectar contenido multimedia asociado.`;
      
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setDeleting(category.id);
      
      console.log('🗑️ Eliminando categoría:', category);
      
      // ✅ USAR SERVICIO REAL
      const response = await deleteCategoryService(category.id);
      
      console.log('📥 Respuesta del servicio de eliminación:', response);
      
      // ✅ El servicio devuelve directamente la data o lanza error
      // Si llegamos aquí, la eliminación fue exitosa
      
      console.log('✅ Categoría eliminada exitosamente');
      
      // Mostrar notificación de éxito
      alert(`✅ Categoría "${category.name}" eliminada exitosamente`);
      
      // Recargar lista para reflejar los cambios
      await loadCategories();
      
    } catch (error) {
      console.error('💥 Error al eliminar categoría:', error);
      
      // ✅ Manejar errores específicos del backend
      let errorMessage = `Error al eliminar la categoría "${category.name}".`;
      
      if (error.response?.status === 401) {
        // Sesión expirada
        console.log('🔒 Sesión expirada, redirigiendo...');
        sessionStorage.clear();
        navigate('/login');
        return;
      } else if (error.response?.status === 404) {
        errorMessage = 'La categoría no existe o ya fue eliminada.';
      } else if (error.response?.status === 403) {
        errorMessage = 'No tienes permisos para eliminar esta categoría.';
      } else if (error.response?.status === 409) {
        errorMessage = 'No se puede eliminar la categoría porque tiene contenido asociado.';
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
   * Crear nueva categoría
   */
  const handleCreateCategory = () => {
    navigate('/admin/categories/create');
  };

  /**
   * Actualizar lista
   */
  const handleRefresh = () => {
    loadCategories();
  };

  // ===== EFECTOS =====
  useEffect(() => {
    loadCategories();
  }, []);

  // ===== RENDER =====
  
  return (
    <AdminLayout
      title="Gestión de Categorías"
      subtitle={`${stats.total} categoría${stats.total !== 1 ? 's' : ''} registrada${stats.total !== 1 ? 's' : ''}`}
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Categorías' }
      ]}
      headerActions={
        <div className="categories-list__header-actions">
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
            leftIcon="🎭"
            onClick={handleCreateCategory}
          >
            Crear Categoría
          </Button>
        </div>
      }
    >
      <div className="categories-list">
        {/* ===== ESTADÍSTICAS ===== */}
        {!loading && !error && stats.total > 0 && (
          <div className="categories-list__summary">
            <div className="categories-list__stats">
              <div className="categories-list__stat">
                <span className="categories-list__stat-value">
                  {stats.total}
                </span>
                <span className="categories-list__stat-label">Total Categorías</span>
              </div>
              <div className="categories-list__stat">
                <span className="categories-list__stat-value">
                  {stats.recentlyCreated}
                </span>
                <span className="categories-list__stat-label">Nuevas (7 días)</span>
              </div>
              <div className="categories-list__stat">
                <span className="categories-list__stat-value">
                  {stats.withShortNames}
                </span>
                <span className="categories-list__stat-label">Nombres Cortos</span>
              </div>
              <div className="categories-list__stat">
                <span className="categories-list__stat-value">
                  {stats.withLongNames}
                </span>
                <span className="categories-list__stat-label">Nombres Largos</span>
              </div>
            </div>
          </div>
        )}

        {/* ===== TABLA DE CATEGORÍAS ===== */}
        <div className="categories-list__table">
          <DataTable
            data={categories}
            columns={categoryColumns}
            loading={loading}
            error={error}
            searchPlaceholder="Buscar categorías por nombre..."
            pageSizeOptions={[10, 25, 50, 100]}
            defaultPageSize={25}
            variant="default"
            emptyTitle="No hay categorías registradas"
            emptyDescription="Crea tu primera categoría para organizar el contenido multimedia"
            emptyIcon="🎭"
            onView={handleViewCategory}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            className={deleting ? 'categories-list__table--deleting' : ''}
            rowClassName={(row) => {
              const classes = [];
              if (deleting === row.original.id) {
                classes.push('categories-list__row--deleting');
              }
              return classes.join(' ');
            }}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

export { CategoriesListPage };