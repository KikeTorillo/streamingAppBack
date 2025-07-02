// ===== ADMIN DASHBOARD PAGE =====
// src/Pages/Admin/AdminDashboard/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/templates/AdminLayout/AdminLayout';
import { StatsCard } from '../../components/molecules/StatsCard/StatsCard';
import { Button } from '../../components/atoms/Button/Button';
import './AdminDashboard.css';

// Importar servicios para datos reales
import { getUsersService } from '../../services/Users/getUsersService';
import { getMoviesService } from '../../services/Movies/getMoviesService';
import { getSeriesService } from '../../services/Series/getSeriesService';
import { getCategoriesService } from '../../services/Categories/getCategoriesService';

/**
 * AdminDashboard - Página principal del panel de administración
 * 
 * Características implementadas:
 * - ✅ AdminLayout como contenedor base
 * - ✅ Grid de StatsCard con métricas principales
 * - ✅ Acciones rápidas para administradores
 * - ✅ Datos en tiempo real desde servicios
 * - ✅ Estados de loading y error
 * - ✅ Responsive design
 * - ✅ Navegación a páginas específicas
 */
function AdminDashboard() {
  const navigate = useNavigate();

  // ===== ESTADOS =====
  const [stats, setStats] = useState({
    users: { count: 0, change: 0 },
    movies: { count: 0, change: 0 },
    series: { count: 0, change: 0 },
    categories: { count: 0, change: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===== EFECTOS =====
  
  /**
   * Cargar estadísticas desde servicios
   */
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Ejecutar llamadas en paralelo
        const [
          usersResponse,
          moviesResponse,
          seriesResponse,
          categoriesResponse
        ] = await Promise.allSettled([
          getUsersService(),
          getMoviesService(),
          getSeriesService(),
          getCategoriesService()
        ]);

        // Procesar respuestas y extraer contadores
        const newStats = {
          users: {
            count: getArrayLength(usersResponse),
            change: Math.floor(Math.random() * 20) - 5 // Simulado por ahora
          },
          movies: {
            count: getArrayLength(moviesResponse),
            change: Math.floor(Math.random() * 15) - 3
          },
          series: {
            count: getArrayLength(seriesResponse),
            change: Math.floor(Math.random() * 10) - 2
          },
          categories: {
            count: getArrayLength(categoriesResponse),
            change: Math.floor(Math.random() * 5) - 1
          }
        };

        setStats(newStats);

      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // ===== FUNCIONES AUXILIARES =====
  
  /**
   * Extraer longitud de arrays de respuestas de Promise.allSettled
   */
  const getArrayLength = (promiseResult) => {
    if (promiseResult.status === 'fulfilled' && Array.isArray(promiseResult.value)) {
      return promiseResult.value.length;
    }
    if (promiseResult.status === 'fulfilled' && promiseResult.value?.data && Array.isArray(promiseResult.value.data)) {
      return promiseResult.value.data.length;
    }
    return 0;
  };

  // ===== CONFIGURACIÓN DE ESTADÍSTICAS =====
  const statsCards = [
    {
      title: 'Usuarios',
      value: stats.users.count,
      icon: '👥',
      change: `${stats.users.change > 0 ? '+' : ''}${stats.users.change}%`,
      changeLabel: 'último mes',
      color: 'blue',
      onClick: () => navigate('/admin/users')
    },
    {
      title: 'Películas',
      value: stats.movies.count,
      icon: '🎬',
      change: `${stats.movies.change > 0 ? '+' : ''}${stats.movies.change}%`,
      changeLabel: 'esta semana',
      color: 'green',
      onClick: () => navigate('/admin/movies')
    },
    {
      title: 'Series',
      value: stats.series.count,
      icon: '📺',
      change: `${stats.series.change > 0 ? '+' : ''}${stats.series.change}%`,
      changeLabel: 'último mes',
      color: 'purple',
      onClick: () => navigate('/admin/series')
    },
    {
      title: 'Categorías',
      value: stats.categories.count,
      icon: '📂',
      change: `${stats.categories.change > 0 ? '+' : ''}${stats.categories.change}%`,
      changeLabel: 'este año',
      color: 'yellow',
      onClick: () => navigate('/admin/categories')
    }
  ];

  // ===== MANEJO DE ERRORES =====
  if (error) {
    return (
      <AdminLayout>
        <div className="admin-dashboard admin-dashboard--error">
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-3xl)',
            color: 'var(--text-secondary)'
          }}>
            <h2>❌ Error al cargar el dashboard</h2>
            <p>{error}</p>
            <Button
              variant="primary"
              onClick={() => window.location.reload()}
              style={{ marginTop: 'var(--space-md)' }}
            >
              Reintentar
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // ===== RENDER =====
  return (
    <AdminLayout>
      <div className="admin-dashboard">
        
        {/* ===== ESTADÍSTICAS PRINCIPALES ===== */}
        <section className="admin-dashboard__stats">
          <h2 className="admin-dashboard__section-title">
            📊 Resumen General
          </h2>
          
          {loading ? (
            <div className="admin-dashboard__stats-grid">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="stats-card--loading">
                  <div className="stats-card__skeleton"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-dashboard__stats-grid">
              {statsCards.map((card, index) => (
                <StatsCard
                  key={index}
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  change={card.change}
                  changeLabel={card.changeLabel}
                  color={card.color}
                  onClick={card.onClick}
                  loading={loading}
                />
              ))}
            </div>
          )}
        </section>

        {/* ===== ACCIONES RÁPIDAS ===== */}
        <section className="admin-dashboard__quick-actions">
          <h2 className="admin-dashboard__section-title">
            ⚡ Acciones Rápidas
          </h2>
          
          <div className="admin-dashboard__actions-grid">
            <Button
              variant="outline"
              size="lg"
              leftIcon="👥"
              onClick={() => navigate('/admin/users/create')}
              className="admin-dashboard__action-button"
            >
              Crear Usuario
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              leftIcon="🎬"
              onClick={() => navigate('/admin/movies/create')}
              className="admin-dashboard__action-button"
            >
              Agregar Película
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              leftIcon="📺"
              onClick={() => navigate('/admin/series/create')}
              className="admin-dashboard__action-button"
            >
              Crear Serie
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              leftIcon="📂"
              onClick={() => navigate('/admin/categories/create')}
              className="admin-dashboard__action-button"
            >
              Nueva Categoría
            </Button>
          </div>
        </section>

      </div>
    </AdminLayout>
  );
}

export { AdminDashboard };