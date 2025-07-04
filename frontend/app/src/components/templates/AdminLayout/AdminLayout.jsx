// ===== ADMIN LAYOUT COMPONENT =====
// src/components/templates/AdminLayout/AdminLayout.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminSidebar } from '../../organism/AdminSidebar/AdminSidebar';
import { Button } from '../../atoms/Button/Button';
import './AdminLayout.css';

// Importar servicios para obtener contadores en tiempo real
import { getUsersService } from '../../../services/Users/getUsersService';
import { getMoviesService } from '../../../services/Movies/getMoviesService';
import { getSeriesService } from '../../../services/Series/getSeriesService';
import { getCategoriesService } from '../../../services/Categories/getCategoriesService';
// ❌ ELIMINADO: import { getEpisodesService } from '../../../services/Episodes/getEpisodesService';

/**
 * AdminLayout - Template base para el panel de administración
 * 
 * Características implementadas:
 * - ✅ Sidebar integrado con contadores dinámicos
 * - ✅ Header administrativo con breadcrumbs
 * - ✅ Área de contenido principal responsive
 * - ✅ Estados de loading para contadores
 * - ✅ Manejo de autenticación admin
 * - ✅ Responsive design completo
 * - ✅ Integración con servicios (SIN episodios)
 */
function AdminLayout({
  // Contenido principal
  children,

  // Configuración del header
  title,
  subtitle,
  breadcrumbs = [],

  // Acciones del header
  headerActions,

  // Props del layout
  sidebarCollapsed = false,
  onSidebarToggle,

  // Props de customización
  className = '',
  variant = 'default', // 'default' | 'compact' | 'full'

  // Props adicionales
  ...restProps
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // ===== ESTADOS =====
  const [isCollapsed, setIsCollapsed] = useState(sidebarCollapsed);
  const [user, setUser] = useState(null);
  const [counts, setCounts] = useState({
    users: 0,
    movies: 0,
    series: 0,
    categories: 0
    // ❌ ELIMINADO: episodes: 0
  });
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [countsError, setCountsError] = useState(null);

  // ===== VERIFICAR AUTENTICACIÓN ADMIN =====
  useEffect(() => {
    const sessionUser = sessionStorage.getItem('sessionUser');
    if (!sessionUser) {
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(sessionUser);

      // Verificar que sea admin (ajustar según tu sistema de roles)
      const isAdmin = userData.role === 'admin' ||
        userData.roleId === 1 ||
        userData.isAdmin === true;

      if (!isAdmin) {
        // Si no es admin, redirigir al inicio
        navigate('/');
        return;
      }

      setUser(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  // ===== CARGAR CONTADORES EN TIEMPO REAL (SIN EPISODIOS) =====
  useEffect(() => {
    if (!user) return;

    const loadCounts = async () => {
      try {
        setLoadingCounts(true);
        setCountsError(null);

        // Cargar contadores en paralelo (SIN episodios)
        const [
          usersResponse,
          moviesResponse,
          seriesResponse,
          categoriesResponse
          // ❌ ELIMINADO: episodesResponse
        ] = await Promise.allSettled([
          getUsersService().catch(() => []),
          getMoviesService().catch(() => []),
          getSeriesService().catch(() => []),
          getCategoriesService().catch(() => [])
          // ❌ ELIMINADO: getEpisodesService().catch(() => [])
        ]);

        // Procesar respuestas y extraer contadores (SIN episodios)
        const newCounts = {
          users: getArrayLength(usersResponse),
          movies: getArrayLength(moviesResponse),
          series: getArrayLength(seriesResponse),
          categories: getArrayLength(categoriesResponse)
          // ❌ ELIMINADO: episodes: getArrayLength(episodesResponse)
        };

        setCounts(newCounts);
      } catch (error) {
        console.error('Error loading counts:', error);
        setCountsError('Error al cargar contadores');
      } finally {
        setLoadingCounts(false);
      }
    };

    loadCounts();
  }, [user]);

  // ===== FUNCIÓN AUXILIAR PARA EXTRAER LONGITUD DE ARRAYS =====
  const getArrayLength = (promiseResult) => {
    if (promiseResult.status === 'fulfilled' && Array.isArray(promiseResult.value)) {
      return promiseResult.value.length;
    }
    return 0;
  };

  // ===== MANEJAR TOGGLE DEL SIDEBAR =====
  const handleSidebarToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    if (onSidebarToggle) {
      onSidebarToggle(newCollapsed);
    }
  };

  // ===== MANEJAR LOGOUT =====
  const handleLogout = () => {
    sessionStorage.removeItem('sessionUser');
    navigate('/login');
  };

  // ===== GENERAR BREADCRUMBS AUTOMÁTICOS =====
  const generateBreadcrumbs = () => {
    if (breadcrumbs.length > 0) return breadcrumbs;

    // Generar breadcrumbs automáticos basados en la ruta
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const autoBreadcrumbs = [];

    pathSegments.forEach((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);

      autoBreadcrumbs.push({
        label,
        href: index === pathSegments.length - 1 ? undefined : href
      });
    });

    return autoBreadcrumbs;
  };

  // ===== CLASSES CSS =====
  const layoutClasses = [
    'admin-layout',
    `admin-layout--${variant}`,
    isCollapsed ? 'admin-layout--collapsed' : '',
    className
  ].filter(Boolean).join(' ');

  // ===== SI NO HAY USUARIO, MOSTRAR LOADING =====
  if (!user) {
    return (
      <div className="admin-layout__loading">
        <div className="admin-layout__loading-content">
          <div className="admin-layout__spinner"></div>
          <p>Verificando acceso de administrador...</p>
        </div>
      </div>
    );
  }

  // ===== RENDER PRINCIPAL =====
  return (
    <div className={layoutClasses} {...restProps}>

      {/* ===== SIDEBAR ===== */}
      <AdminSidebar
        isCollapsed={isCollapsed}  // Usar el prop correcto
        onToggleCollapse={handleSidebarToggle}
        counts={counts}
        loading={loadingCounts}
        error={countsError}
        currentPath={location.pathname}
      />

      {/* ===== ÁREA PRINCIPAL ===== */}
      <div className="admin-layout__main">

        {/* ===== HEADER ===== */}
        <header className="admin-layout__header">

          {/* Breadcrumbs */}
          {(breadcrumbs.length > 0 || location.pathname !== '/admin') && (
            <nav className="admin-layout__breadcrumbs">
              {generateBreadcrumbs().map((crumb, index) => (
                <span key={index} className="admin-layout__breadcrumb">
                  {crumb.href ? (
                    <button
                      onClick={() => navigate(crumb.href)}
                      className="admin-layout__breadcrumb-link"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className="admin-layout__breadcrumb-current">
                      {crumb.label}
                    </span>
                  )}
                  {index < generateBreadcrumbs().length - 1 && (
                    <span className="admin-layout__breadcrumb-separator">→</span>
                  )}
                </span>
              ))}
            </nav>
          )}

          {/* Título de página */}
          <div className="admin-layout__header-content">
            <div className="admin-layout__header-text">
              {title && <h1 className="admin-layout__title">{title}</h1>}
              {subtitle && <p className="admin-layout__subtitle">{subtitle}</p>}
            </div>

            {/* Acciones del header */}
            <div className="admin-layout__header-actions">
              {headerActions}

              {/* Info de usuario y logout */}
              <div className="admin-layout__user-menu">
                <div className="admin-layout__user-info">
                  <span className="admin-layout__user-email">{user.email}</span>
                  <span className="admin-layout__user-role">{user.role}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  title="Cerrar sesión"
                >
                  🚪
                </Button>
              </div>
            </div>
          </div>
        </header>
        <main className="admin-layout__content">
          {children}
        </main>
      </div>
    </div>
  );
}

export { AdminLayout };