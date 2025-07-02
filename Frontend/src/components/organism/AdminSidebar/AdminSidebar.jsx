// ===== ADMINSIDEBAR COMPONENT =====
// src/components/organism/AdminSidebar/AdminSidebar.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../atoms/Button/Button';
import './AdminSidebar.css';

/**
 * AdminSidebar - Navegación lateral para panel de administración
 * 
 * Características implementadas:
 * - ✅ Navegación colapsible 
 * - ✅ Menús y submenús expandibles
 * - ✅ Estados activos/hover
 * - ✅ Badges con contadores dinámicos
 * - ✅ Responsive (oculto en móvil)
 * - ✅ Consistente con sistema de diseño
 * - ✅ Accesibilidad completa
 */
function AdminSidebar({
  // Estados del sidebar
  isCollapsed = false,
  onToggleCollapse,

  // Datos dinámicos para badges
  userCount = 0,
  movieCount = 0,
  seriesCount = 0,
  categoryCount = 0,
  episodeCount = 0,

  // Props de customización
  className = '',
  variant = 'default', // 'default' | 'dark' | 'minimal'

  // ✅ SEPARAR PROPS PERSONALIZADAS QUE NO VAN AL DOM
  loading, // ← PROP PERSONALIZADA (causa el error)
  error, // ← PROP PERSONALIZADA
  counts, // ← PROP PERSONALIZADA
  currentPath, // ← PROP PERSONALIZADA
  onToggle, // ← PROP PERSONALIZADA (handler de AdminLayout)
  onNavigate, // ← PROP PERSONALIZADA (handler para Storybook)

  // Props adicionales
  ...restProps
}) {

  // ✅ FILTRAR PROPS QUE NO DEBEN IR AL DOM
  const {
    // Props personalizadas a filtrar (evitar error de React)
    loading: _loading,
    error: _error,
    counts: _counts,
    currentPath: _currentPath,
    onToggle: _onToggle,
    onNavigate: _onNavigate,
    variant: _variant,
    userCount: _userCount,
    movieCount: _movieCount,
    seriesCount: _seriesCount,
    categoryCount: _categoryCount,
    episodeCount: _episodeCount,
    onToggleCollapse: _onToggleCollapse,
    className: _className,
    ...domProps // ✅ Solo props válidas para el DOM
  } = restProps;

  // Hooks de router con manejo de errores
  let navigate, location;
  try {
    navigate = useNavigate();
    location = useLocation();
  } catch (error) {
    // Fallback para cuando no hay router (Storybook)
    navigate = onNavigate || ((route) => console.log('Navigate to:', route));
    location = { pathname: '/admin' };
  }

  const [expandedMenus, setExpandedMenus] = useState(new Set(['dashboard']));

  // ===== CONFIGURACIÓN DE MENÚS =====
  const sidebarItems = [
    {
      id: 'dashboard',
      icon: '📊',
      label: 'Dashboard',
      route: '/admin',
      description: 'Panel principal con métricas generales',
      badge: 0
    },
    {
      id: 'users',
      icon: '👥',
      label: 'Usuarios',
      route: '/admin/users',
      description: 'Gestión de usuarios registrados',
      badge: userCount
    },
    {
      id: 'content',
      icon: '🎬',
      label: 'Contenido',
      description: 'Gestión de películas, series y episodios',
      badge: movieCount + seriesCount,
      submenu: [
        {
          icon: '🎭',
          label: 'Películas',
          route: '/admin/movies',
          badge: movieCount
        },
        {
          icon: '📺',
          label: 'Series',
          route: '/admin/series',
          badge: seriesCount
        },
        {
          icon: '📼',
          label: 'Episodios',
          route: '/admin/episodes',
          badge: episodeCount
        },
        {
          icon: '➕',
          label: 'Crear Episodio',
          route: '/admin/episodes/create'
        }
      ]
    },
    {
      id: 'categories',
      icon: '🏷️',
      label: 'Categorías',
      route: '/admin/categories',
      description: 'Organización por géneros y categorías',
      badge: categoryCount
    }
  ];

  // ===== FUNCIONES DEL COMPONENTE =====

  // Verificar si una ruta está activa
  const isRouteActive = (route, exact = false) => {
    if (!route) return false;
    const currentPath = location.pathname;
    return exact ? currentPath === route : currentPath.startsWith(route);
  };

  // Toggle de menús expandibles
  const toggleSubmenu = (menuId) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  };

  // Navegación con manejo de errores
  const handleNavigation = (route, event) => {
    if (!route) return;

    event?.preventDefault();

    try {
      navigate(route);
    } catch (error) {
      console.warn('Navigation error:', error);
      // Fallback para Storybook
      if (onNavigate) {
        onNavigate(route);
      }
    }
  };

  // Toggle del sidebar completo
  const handleSidebarToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else if (onToggle) {
      onToggle();
    }
  };

  // Volver al home
  const handleBackToHome = () => {
    try {
      navigate('/');
    } catch (error) {
      console.warn('Home navigation error:', error);
      window.location.href = '/';
    }
  };

  // ===== CLASSES CSS =====
  const sidebarClasses = [
    'admin-sidebar',
    `admin-sidebar--${variant}`,
    isCollapsed && 'admin-sidebar--collapsed',
    loading && 'admin-sidebar--loading',
    error && 'admin-sidebar--error',
    className
  ].filter(Boolean).join(' ');

  // ===== RENDER PRINCIPAL =====
  return (
    <aside
      className={sidebarClasses}
      role="navigation"
      aria-label="Navegación del panel de administración"
      {...domProps} // ✅ Solo props válidas del DOM
    >

      {/* ===== HEADER DEL SIDEBAR ===== */}
      <div className="admin-sidebar__header">

        {/* Brand */}
        {!isCollapsed && (
          <div className="admin-sidebar__brand">
            <span className="admin-sidebar__logo">⚙️</span>
            <div className="admin-sidebar__brand-text">
              <h2 className="admin-sidebar__title">Admin Panel</h2>
              <p className="admin-sidebar__subtitle">StreamApp</p>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSidebarToggle}
          className="admin-sidebar__toggle"
          aria-label={isCollapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
        >
          {isCollapsed ? '→' : '←'}
        </Button>
      </div>

      {/* ===== NAVEGACIÓN PRINCIPAL ===== */}
      <nav className="admin-sidebar__nav">
        <ul
          className="admin-sidebar__menu"
          role="menu"
          aria-label="Menú principal de administración"
        >
          {sidebarItems.map((item) => {
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isExpanded = expandedMenus.has(item.id);
            const isActive = isRouteActive(item.route, item.route === '/admin');

            return (
              <li
                key={item.id}
                className="admin-sidebar__menu-item"
                role="none"
              >
                <button
                  className={[
                    'admin-sidebar__item',
                    isActive && 'admin-sidebar__item--active',
                    hasSubmenu && 'admin-sidebar__item--expandable'
                  ].filter(Boolean).join(' ')}
                  onClick={hasSubmenu ?
                    () => toggleSubmenu(item.id) :
                    (e) => handleNavigation(item.route, e)
                  }
                  role="menuitem"
                  aria-current={isActive ? 'page' : undefined}
                  aria-expanded={hasSubmenu ? isExpanded : undefined}
                  aria-describedby={!isCollapsed ? `${item.id}-desc` : undefined}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="admin-sidebar__item-icon">
                    {item.icon}
                  </span>

                  {!isCollapsed && (
                    <>
                      <span className="admin-sidebar__item-label">
                        {item.label}
                      </span>

                      {/* Badge con contador */}
                      {item.badge > 0 && (
                        <span
                          className="admin-sidebar__badge"
                          aria-label={`${item.badge} elementos`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Flecha para submenús */}
                      {hasSubmenu && (
                        <span
                          className={[
                            'admin-sidebar__arrow',
                            isExpanded && 'admin-sidebar__arrow--expanded'
                          ].filter(Boolean).join(' ')}
                          aria-hidden="true"
                        >
                          ▼
                        </span>
                      )}
                    </>
                  )}
                </button>

                {/* Descripción para accesibilidad */}
                {!isCollapsed && (
                  <span
                    id={`${item.id}-desc`}
                    className="admin-sidebar__description"
                  >
                    {item.description}
                  </span>
                )}

                {/* Submenú */}
                {hasSubmenu && isExpanded && !isCollapsed && (
                  <ul
                    className="admin-sidebar__submenu"
                    role="menu"
                    aria-label={`Submenú de ${item.label}`}
                  >
                    {item.submenu.map((subitem, index) => (
                      <li
                        key={index}
                        className="admin-sidebar__submenu-item"
                        role="none"
                      >
                        <button
                          className={[
                            'admin-sidebar__subitem',
                            isRouteActive(subitem.route, true) && 'admin-sidebar__subitem--active'
                          ].filter(Boolean).join(' ')}
                          onClick={(e) => handleNavigation(subitem.route, e)}
                          role="menuitem"
                          aria-current={isRouteActive(subitem.route, true) ? 'page' : undefined}
                        >
                          <span className="admin-sidebar__subitem-icon">
                            {subitem.icon}
                          </span>
                          <span className="admin-sidebar__subitem-label">
                            {subitem.label}
                          </span>

                          {/* Badge para subitem */}
                          {subitem.badge > 0 && (
                            <span
                              className="admin-sidebar__badge admin-sidebar__badge--small"
                              aria-label={`${subitem.badge} elementos`}
                            >
                              {subitem.badge}
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ===== FOOTER DEL SIDEBAR ===== */}
      {!isCollapsed && (
        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user-info">
            <div className="admin-sidebar__user-avatar">👤</div>
            <div className="admin-sidebar__user-details">
              <p className="admin-sidebar__user-name">Administrador</p>
              <p className="admin-sidebar__user-role">Panel de Control</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToHome}
            className="admin-sidebar__back-button"
          >
            ← Volver al inicio
          </Button>
        </div>
      )}
    </aside>
  );
}

export { AdminSidebar };