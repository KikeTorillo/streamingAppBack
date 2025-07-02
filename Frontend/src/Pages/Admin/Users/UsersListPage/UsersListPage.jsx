// ===== USERS LIST PAGE - HOMOLOGADO CON BACKEND =====
// src/Pages/Admin/Users/UsersListPage/UsersListPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DataTable } from '../../../../components/organism/DataTable/DataTable';
import { Button } from '../../../../components/atoms/Button/Button';
import './UsersListPage.css';

// Servicios de usuarios
import { getUsersService } from '../../../../services/Users/getUsersService';
import { deleteUserService } from '../../../../services/Users/deleteUserService';

/**
 * UsersListPage - Página de gestión de usuarios HOMOLOGADA
 * 
 * ✅ CORREGIDO: Mapeo correcto de campos del backend
 * ✅ CORREGIDO: Manejo de respuestas estructuradas
 * ✅ CORREGIDO: Estados y roles correctos
 * ✅ AÑADIDO: Logs de debugging
 * ✅ AÑADIDO: Manejo de sesión expirada
 */
function UsersListPage() {
  const navigate = useNavigate();

  // ===== ESTADOS =====
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // ===== FUNCIONES AUXILIARES =====
  
  /**
   * ✅ CORREGIDO: Formatear fechas
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
   * ✅ NUEVO: Verificar si es el usuario actual
   */
  const isCurrentUser = (userId) => {
    try {
      const sessionUser = JSON.parse(sessionStorage.getItem('sessionUser') || '{}');
      return sessionUser.sub === userId;
    } catch {
      return false;
    }
  };

  // ===== FUNCIONES DE DATOS =====
  
  /**
   * ✅ CORREGIDO: Cargar usuarios con SOLO campos reales del backend
   */
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📥 Cargando usuarios...');
      const response = await getUsersService();
      
      // ✅ MANEJAR respuesta estructurada
      if (response.message === 'session expired' && response.error) {
        console.log('🔒 Sesión expirada, redirigiendo...');
        sessionStorage.clear();
        navigate('/login');
        return;
      }

      if (!response.success) {
        throw new Error(response.error || 'Error al cargar usuarios');
      }

      const rawUsers = Array.isArray(response.data) ? response.data : [];
      // ✅ MAPEAR SOLO CAMPOS QUE EXISTEN EN EL BACKEND
      const mappedUsers = rawUsers.map(user => ({
        createdAt: user.createdAt,
        email: user.email,
        id: user.id,
        roleId: user.roleId,  
        roleName: user.roleName,
        updatedAt: user.updated_at,
        userName: user.userName,
      }));

      setUsers(mappedUsers);
      
    } catch (error) {
      console.error('💥 Error loading users:', error);
      setError(error.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  // ===== EFECTOS =====
  useEffect(() => {
    loadUsers();
  }, []);

  // ===== FUNCIONES DE MANEJO =====
  
  /**
   * ✅ CORREGIDO: Ver usuario
   */
  const handleViewUser = async (user) => {
    console.log('👁️ Ver usuario:', user);
    // TODO: Implementar modal de detalles o navegar a página de detalle
    alert(`Ver detalles de ${user.userName}\n\nID: ${user.id}\nEmail: ${user.email}\nRol: ${user.roleName}\nEstado: ${user.status}`);
  };

  /**
   * ✅ CORREGIDO: Editar usuario
   */
  const handleEditUser = (user) => {
    console.log('✏️ Editar usuario:', user);
    navigate(`/admin/users/${user.id}/edit`);
  };

  /**
   * ✅ CORREGIDO: Eliminar usuario con validaciones
   */
  const handleDeleteUser = async (user) => {
    console.log('🗑️ Eliminar usuario:', user);
    
    // ✅ VERIFICAR: No eliminar usuario actual
    if (isCurrentUser(user.id)) {
      alert('❌ No puedes eliminar tu propia cuenta.');
      return;
    }

    // ✅ VERIFICAR: No eliminar último admin
    const adminCount = users.filter(u => u.roleId === 1).length;
    if (user.roleId === 1 && adminCount <= 1) {
      alert('❌ No puedes eliminar el último administrador del sistema.');
      return;
    }

    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar el usuario "${user.userName}"?\n\n` +
      `Email: ${user.email}\n` +
      `Rol: ${user.roleName}\n\n` +
      `Esta acción no se puede deshacer.`
    );

    if (!confirmDelete) return;

    try {
      setDeleting(user.id);
      console.log('🔄 Eliminando usuario:', user.id);
      
      const response = await deleteUserService(user.id);
      
      // ✅ MANEJAR respuesta estructurada
      if (response.message === 'session expired' && response.error) {
        sessionStorage.clear();
        navigate('/login');
        return;
      }

      if (!response.success) {
        throw new Error(response.error || 'Error al eliminar usuario');
      }

      // ✅ ACTUALIZAR lista local
      setUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
      
      console.log('✅ Usuario eliminado exitosamente');
      alert(`✅ Usuario "${user.userName}" eliminado correctamente.`);
      
    } catch (err) {
      console.error('💥 Error deleting user:', err);
      alert(`❌ Error al eliminar el usuario: ${err.message}`);
    } finally {
      setDeleting(null);
    }
  };

  /**
   * Crear nuevo usuario
   */
  const handleCreateUser = () => {
    navigate('/admin/users/create');
  };

  /**
   * Refrescar lista
   */
  const handleRefresh = () => {
    loadUsers();
  };

  // ===== CONFIGURACIÓN DE COLUMNAS (SOLO CAMPOS REALES) =====
  const userColumns = [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 80,
      cell: ({ getValue }) => (
        <span className="users-list__id">
          #{getValue()}
        </span>
      )
    },
    {
      accessorKey: 'userName',
      header: 'Usuario',
      cell: ({ getValue }) => (
        <div className="users-list__user-info">
          <span className="users-list__username" title={getValue()}>
            {getValue()}
          </span>
        </div>
      )
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ getValue }) => (
        <span className="users-list__email" title={getValue() || 'Sin email'}>
          {getValue() || <em style={{ color: 'var(--text-muted)' }}>Sin email</em>}
        </span>
      )
    },
    {
      accessorKey: 'roleName',
      header: 'Rol',
      size: 120,
      cell: ({ getValue, row }) => {
        const role = getValue();
        const roleId = row.original.roleId;
        const badgeClass = 
          roleId === 1 ? 'info' :     // Administrador
          roleId === 2 ? 'warning' :  // Editor
          'success';                  // Usuario
        
        return (
          <span className={`data-table__badge data-table__badge--${badgeClass}`}>
            {role}
          </span>
        );
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha de Registro',
      size: 150,
      cell: ({ getValue }) => (
        <span className="users-list__date">
          {formatDate(getValue())}
        </span>
      )
    },
  ];

  // ===== ESTADÍSTICAS (SOLO DATOS REALES) =====
  const stats = {
    total: users.length,
    admins: users.filter(u => u.roleId === 1).length,
    editors: users.filter(u => u.roleId === 2).length,
    regularUsers: users.filter(u => u.roleId === 3).length,
    withEmail: users.filter(u => u.email).length,
    withoutEmail: users.filter(u => !u.email).length
  };

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Gestión de Usuarios"
      subtitle={`${stats.total} usuario${stats.total !== 1 ? 's' : ''} registrado${stats.total !== 1 ? 's' : ''}`}
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Usuarios' }
      ]}
      headerActions={
        <div className="users-list__header-actions">
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
            leftIcon="➕"
            onClick={handleCreateUser}
          >
            Crear Usuario
          </Button>
        </div>
      }
    >
      <div className="users-list">
        {/* ===== ESTADÍSTICAS (SOLO DATOS REALES) ===== */}
        {!loading && !error && stats.total > 0 && (
          <div className="users-list__summary">
            <div className="users-list__stats">
              <div className="users-list__stat">
                <span className="users-list__stat-value">
                  {stats.admins}
                </span>
                <span className="users-list__stat-label">Administradores</span>
              </div>
              <div className="users-list__stat">
                <span className="users-list__stat-value">
                  {stats.editors}
                </span>
                <span className="users-list__stat-label">Editores</span>
              </div>
              <div className="users-list__stat">
                <span className="users-list__stat-value">
                  {stats.regularUsers}
                </span>
                <span className="users-list__stat-label">Usuarios</span>
              </div>
              <div className="users-list__stat">
                <span className="users-list__stat-value">
                  {stats.withEmail}
                </span>
                <span className="users-list__stat-label">Con Email</span>
              </div>
              <div className="users-list__stat">
                <span className="users-list__stat-value">
                  {stats.withoutEmail}
                </span>
                <span className="users-list__stat-label">Sin Email</span>
              </div>
            </div>
          </div>
        )}

        {/* ===== TABLA DE USUARIOS ===== */}
        <div className="users-list__table">
          <DataTable
            data={users}
            columns={userColumns}
            loading={loading}
            error={error}
            searchPlaceholder="Buscar por usuario, email o rol..."
            pageSizeOptions={[10, 25, 50, 100]}
            defaultPageSize={25}
            variant="default"
            emptyTitle="No hay usuarios registrados"
            emptyDescription="Crea tu primer usuario para comenzar a gestionar tu plataforma"
            emptyIcon="👥"
            onView={handleViewUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            className={deleting ? 'users-list__table--deleting' : ''}
            rowClassName={(row) => {
              const classes = [];
              if (deleting === row.original.id) classes.push('users-list__row--deleting');
              if (isCurrentUser(row.original.id)) classes.push('users-list__row--current');
              return classes.join(' ');
            }}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

export { UsersListPage };