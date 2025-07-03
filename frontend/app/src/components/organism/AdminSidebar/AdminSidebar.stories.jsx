// ===== ADMIN SIDEBAR STORIES =====
// src/components/organism/AdminSidebar/AdminSidebar.stories.jsx

import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import './AdminSidebar.css';

// ===== WRAPPER CON ROUTER =====
const RouterWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

export default {
  title: 'Components/Organism/AdminSidebar',
  component: AdminSidebar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <RouterWrapper>
        <Story />
      </RouterWrapper>
    )
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# AdminSidebar Organism

Navegación lateral completa para el panel de administración. Combina múltiples elementos para crear una experiencia de navegación profesional tipo dashboard.

## 🎯 Características principales

- **Navegación jerárquica**: Menús principales y submenús organizados
- **Estados dinámicos**: Contadores en tiempo real y badges informativos
- **Colapsible**: Expandir/contraer para maximizar espacio de trabajo
- **Responsive**: Adaptación automática para desktop, tablet y móvil
- **Accesibilidad completa**: ARIA, navegación por teclado, lectores de pantalla
- **Integración con Router**: Estados activos automáticos según la ruta
- **Design System**: Usa todas las variables CSS del sistema existente

## 🏗️ Arquitectura

\`\`\`
AdminSidebar (Organism) 🧬
├── Header
│   ├── Brand (logo + título)
│   └── Toggle Button (Átomo) ⚛️
├── Navigation
│   └── Menu Items
│       ├── Icon + Label + Badge
│       ├── Arrow (para submenús)
│       └── Submenu (lista anidada)
└── Footer
    ├── User Info
    └── Back Button (Átomo) ⚛️
\`\`\`

## 🔧 Uso en AdminLayout

\`\`\`jsx
import { AdminSidebar } from './AdminSidebar';

// Datos de contadores (desde servicios)
const [counts, setCounts] = useState({
  users: 156,
  movies: 89,
  series: 24,
  categories: 12,
  episodes: 180
});

// Estado de colapso
const [isCollapsed, setIsCollapsed] = useState(false);

<AdminSidebar
  isCollapsed={isCollapsed}
  onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
  userCount={counts.users}
  movieCount={counts.movies}
  seriesCount={counts.series}
  categoryCount={counts.categories}
  episodeCount={counts.episodes}
/>
\`\`\`

## 📱 Estados responsive

- **Desktop (1200px+)**: Sidebar fijo expandido por defecto
- **Tablet (768-1199px)**: Sidebar más estrecho, colapsible
- **Mobile (<768px)**: Sidebar como overlay con backdrop

## ♿ Accesibilidad

- **ARIA**: Roles, labels y estados apropiados
- **Navegación por teclado**: Tab, Enter, Escape, flechas
- **Lectores de pantalla**: Descripciones y anuncios de estado
- **Reduced motion**: Respeta preferencias del usuario
        `
      }
    }
  },
  argTypes: {
    isCollapsed: {
      control: 'boolean',
      description: 'Estado colapsado del sidebar'
    },
    variant: {
      control: 'select',
      options: ['default', 'dark', 'minimal'],
      description: 'Variante visual del sidebar'
    },
    userCount: {
      control: 'number',
      description: 'Número de usuarios para el badge'
    },
    movieCount: {
      control: 'number', 
      description: 'Número de películas para el badge'
    },
    seriesCount: {
      control: 'number',
      description: 'Número de series para el badge'
    },
    categoryCount: {
      control: 'number',
      description: 'Número de categorías para el badge'
    },
    episodeCount: {
      control: 'number',
      description: 'Número de episodios para el badge'
    }
  }
};

// ===== DATOS DE EJEMPLO =====
const MOCK_COUNTS = {
  users: 156,
  movies: 89,
  series: 24,
  categories: 12,
  episodes: 180
};

// ===== STORIES PRINCIPALES =====

// ========== DEFAULT ==========
export const Default = {
  args: {
    isCollapsed: false,
    variant: 'default',
    ...MOCK_COUNTS
  }
};

// ========== COLAPSADO ==========
export const Collapsed = {
  args: {
    isCollapsed: true,
    variant: 'default',
    ...MOCK_COUNTS
  }
};

// ========== SIN CONTADORES ==========
export const WithoutCounts = {
  args: {
    isCollapsed: false,
    variant: 'default',
    userCount: 0,
    movieCount: 0,
    seriesCount: 0,
    categoryCount: 0,
    episodeCount: 0
  }
};

// ========== VARIANTES ==========
export const Variants = () => (
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
    gap: 'var(--space-lg)',
    height: '600px'
  }}>
    <div style={{ border: '1px solid var(--border-default)' }}>
      <h3 style={{ textAlign: 'center', margin: 'var(--space-md)' }}>Default</h3>
      <AdminSidebar 
        variant="default" 
        {...MOCK_COUNTS}
        style={{ position: 'relative' }}
      />
    </div>
    
    <div style={{ border: '1px solid var(--border-default)' }}>
      <h3 style={{ textAlign: 'center', margin: 'var(--space-md)' }}>Dark</h3>
      <AdminSidebar 
        variant="dark" 
        {...MOCK_COUNTS}
        style={{ position: 'relative' }}
      />
    </div>
    
    <div style={{ border: '1px solid var(--border-default)' }}>
      <h3 style={{ textAlign: 'center', margin: 'var(--space-md)' }}>Minimal</h3>
      <AdminSidebar 
        variant="minimal" 
        {...MOCK_COUNTS}
        style={{ position: 'relative' }}
      />
    </div>
  </div>
);

// ========== INTERACTIVO ==========
export const Interactive = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [counts, setCounts] = useState(MOCK_COUNTS);

  const incrementCount = (type) => {
    setCounts(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        {...counts}
        style={{ position: 'relative' }}
      />
      
      {/* Panel de controles */}
      <div style={{
        position: 'absolute',
        top: 'var(--space-lg)',
        right: 'var(--space-lg)',
        background: 'var(--bg-primary)',
        padding: 'var(--space-lg)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-default)',
        minWidth: '250px'
      }}>
        <h4 style={{ margin: '0 0 var(--space-md) 0' }}>Controles de Demo</h4>
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            width: '100%',
            padding: 'var(--space-sm)',
            marginBottom: 'var(--space-sm)',
            background: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer'
          }}
        >
          {isCollapsed ? 'Expandir' : 'Colapsar'} Sidebar
        </button>

        <div style={{ display: 'grid', gap: 'var(--space-xs)' }}>
          <button onClick={() => incrementCount('userCount')}>
            + Usuario ({counts.userCount})
          </button>
          <button onClick={() => incrementCount('movieCount')}>
            + Película ({counts.movieCount})
          </button>
          <button onClick={() => incrementCount('seriesCount')}>
            + Serie ({counts.seriesCount})
          </button>
          <button onClick={() => incrementCount('categoryCount')}>
            + Categoría ({counts.categoryCount})
          </button>
          <button onClick={() => incrementCount('episodeCount')}>
            + Episodio ({counts.episodeCount})
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== RESPONSIVE DEMO ==========
export const ResponsiveDemo = () => (
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr 1fr', 
    gap: 'var(--space-lg)',
    height: '500px'
  }}>
    {/* Desktop */}
    <div style={{ border: '1px solid var(--border-default)' }}>
      <h3 style={{ textAlign: 'center', margin: 'var(--space-md)' }}>
        Desktop (1200px+)
      </h3>
      <div style={{ width: '280px', height: '100%' }}>
        <AdminSidebar 
          {...MOCK_COUNTS}
          style={{ position: 'relative', width: '280px' }}
        />
      </div>
    </div>

    {/* Tablet */}
    <div style={{ border: '1px solid var(--border-default)' }}>
      <h3 style={{ textAlign: 'center', margin: 'var(--space-md)' }}>
        Tablet (768-1199px)
      </h3>
      <div style={{ width: '240px', height: '100%' }}>
        <AdminSidebar 
          {...MOCK_COUNTS}
          style={{ position: 'relative', width: '240px' }}
        />
      </div>
    </div>

    {/* Mobile */}
    <div style={{ border: '1px solid var(--border-default)' }}>
      <h3 style={{ textAlign: 'center', margin: 'var(--space-md)' }}>
        Mobile (menos de 768px)
      </h3>
      <div style={{ width: '100%', height: '100%', maxWidth: '320px' }}>
        <AdminSidebar 
          {...MOCK_COUNTS}
          style={{ position: 'relative', width: '100%' }}
        />
      </div>
    </div>
  </div>
);

// ========== CONTADORES ALTOS ==========
export const HighCounts = {
  args: {
    isCollapsed: false,
    variant: 'default',
    userCount: 1847,
    movieCount: 2156,
    seriesCount: 543,
    categoryCount: 67,
    episodeCount: 12847
  }
};

// ========== LAYOUT COMPLETO SIMULADO ==========
export const FullLayoutSimulation = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh',
      fontFamily: 'var(--font-family-base)'
    }}>
      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        {...MOCK_COUNTS}
      />
      
      {/* Contenido principal simulado */}
      <div style={{
        flex: 1,
        marginLeft: isCollapsed ? '72px' : '280px',
        transition: 'margin-left var(--transition-normal)',
        padding: 'var(--space-xl)',
        backgroundColor: 'var(--bg-primary)',
        overflow: 'auto'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h1 style={{ 
            fontSize: 'var(--font-size-3xl)',
            marginBottom: 'var(--space-lg)',
            color: 'var(--text-primary)'
          }}>
            Panel de Administración
          </h1>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-lg)',
            marginBottom: 'var(--space-xl)'
          }}>
            {Object.entries(MOCK_COUNTS).map(([key, value]) => (
              <div key={key} style={{
                padding: 'var(--space-lg)',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-default)',
                textAlign: 'center'
              }}>
                <h3 style={{ 
                  fontSize: 'var(--font-size-2xl)',
                  margin: '0 0 var(--space-sm) 0',
                  color: 'var(--color-primary)'
                }}>
                  {value}
                </h3>
                <p style={{ 
                  margin: 0,
                  color: 'var(--text-secondary)',
                  textTransform: 'capitalize'
                }}>
                  {key.replace('Count', '')}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            padding: 'var(--space-xl)',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-default)'
          }}>
            <h2 style={{ 
              fontSize: 'var(--font-size-xl)',
              marginBottom: 'var(--space-md)',
              color: 'var(--text-primary)'
            }}>
              Contenido Principal
            </h2>
            <p style={{ 
              color: 'var(--text-secondary)',
              lineHeight: 1.6
            }}>
              Esta es una simulación de cómo se vería el AdminSidebar integrado 
              en un layout completo. El sidebar se adapta automáticamente cuando 
              se colapsa, y el contenido principal se ajusta en consecuencia.
            </p>
            
            <p style={{ 
              color: 'var(--text-muted)',
              fontSize: 'var(--font-size-sm)',
              marginTop: 'var(--space-md)'
            }}>
              📱 Tip: Cambia el tamaño de la ventana para ver el comportamiento responsive.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};