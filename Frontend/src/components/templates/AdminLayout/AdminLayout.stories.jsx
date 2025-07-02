// ===== ADMIN LAYOUT STORIES =====
// src/components/templates/AdminLayout/AdminLayout.stories.jsx

import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { Button } from '../../atoms/Button/Button';
import './AdminLayout.css';

// ===== MOCK ADMINLAYOUT PARA STORYBOOK =====
// Versión que no hace llamadas a la API
const MockAdminLayout = ({ children, ...props }) => {
  const [isCollapsed, setIsCollapsed] = useState(props.sidebarCollapsed || false);
  const [user] = useState({
    id: 1,
    email: 'admin@streamapp.com',
    roleId: 1,
    role: 'admin'
  });
  
  // Mock counts estáticos para demo
  const [counts] = useState({
    users: 156,
    movies: 89,
    series: 24,
    categories: 12,
    episodes: 180
  });

  const handleSidebarToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    if (props.onSidebarToggle) {
      props.onSidebarToggle(newCollapsed);
    }
  };

  // Usar la misma estructura del AdminLayout original pero con datos mock
  return (
    <div className={`admin-layout admin-layout--${props.variant || 'default'} ${isCollapsed ? 'admin-layout--sidebar-collapsed' : ''} ${props.className || ''}`}>
      {/* Importar AdminSidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: isCollapsed ? '7.2rem' : '28rem',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-lg)',
        transition: 'all var(--transition-normal)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-family-base)'
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: 'var(--space-lg)',
          borderBottom: '1px solid var(--border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-md)',
          minHeight: '7.2rem'
        }}>
          {!isCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flex: 1 }}>
              <span style={{ fontSize: 'var(--font-size-2xl)' }}>⚙️</span>
              <div>
                <h2 style={{ 
                  margin: 0, 
                  fontSize: 'var(--font-size-lg)', 
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--text-primary)'
                }}>Admin Panel</h2>
                <p style={{ 
                  margin: 0, 
                  fontSize: 'var(--font-size-sm)', 
                  color: 'var(--text-muted)'
                }}>StreamApp</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSidebarToggle}
            style={{ width: '3.2rem', height: '3.2rem' }}
          >
            {isCollapsed ? '→' : '←'}
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-md) 0' }}>
          {[
            { icon: '📊', label: 'Dashboard', badge: null },
            { icon: '👥', label: 'Usuarios', badge: counts.users },
            { icon: '📂', label: 'Categorías', badge: counts.categories },
            { icon: '🎬', label: 'Películas', badge: counts.movies },
            { icon: '📺', label: 'Series', badge: counts.series },
            { icon: '🎞️', label: 'Episodios', badge: counts.episodes }
          ].map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
                padding: 'var(--space-md) var(--space-lg)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-normal)',
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-medium)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--bg-hover)';
                e.target.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--text-secondary)';
              }}
            >
              <span style={{ fontSize: 'var(--font-size-xl)', width: '2.4rem', textAlign: 'center' }}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)',
                      padding: '0 var(--space-xs)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--font-size-xs)',
                      minWidth: '2rem',
                      height: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div style={{
          padding: 'var(--space-lg)',
          borderTop: '1px solid var(--border-default)',
          marginTop: 'auto'
        }}>
          {!isCollapsed && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
              marginBottom: 'var(--space-md)'
            }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--font-size-lg)',
                color: 'var(--color-primary)'
              }}>
                👤
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ 
                  margin: 0, 
                  fontSize: 'var(--font-size-sm)', 
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--text-primary)'
                }}>
                  {user.email}
                </p>
                <p style={{ 
                  margin: 0, 
                  fontSize: 'var(--font-size-xs)', 
                  color: 'var(--text-muted)'
                }}>
                  Administrador
                </p>
              </div>
            </div>
          )}
          <Button variant="outline" size="sm" style={{ width: '100%' }}>
            {isCollapsed ? '🏠' : 'Volver a la app'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-layout__main">
        <header className="admin-layout__header">
          <div className="admin-layout__header-content">
            {/* Breadcrumbs */}
            <nav className="admin-layout__breadcrumbs">
              <ol className="admin-layout__breadcrumb-list">
                <li className="admin-layout__breadcrumb-item">
                  <span className="admin-layout__breadcrumb-link">Admin</span>
                </li>
                <li className="admin-layout__breadcrumb-item">
                  <span className="admin-layout__breadcrumb-current">Dashboard</span>
                </li>
              </ol>
            </nav>

            {/* Title and Actions */}
            <div className="admin-layout__header-row">
              <div className="admin-layout__header-info">
                <h1 className="admin-layout__title">{props.title || 'Panel de Administración'}</h1>
                {props.subtitle && (
                  <p className="admin-layout__subtitle">{props.subtitle}</p>
                )}
              </div>
              
              <div className="admin-layout__user-section">
                {props.headerActions}
                <div className="admin-layout__user-info">
                  <div>
                    <p className="admin-layout__user-name">{user.email}</p>
                    <p className="admin-layout__user-role">Administrador</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="admin-layout__logout-button"
                  title="Cerrar sesión"
                >
                  🚪
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-layout__content">
          <div className="admin-layout__content-wrapper">
            {children}
          </div>
        </main>

        <footer className="admin-layout__footer">
          <div className="admin-layout__footer-content">
            <p className="admin-layout__footer-text">
              StreamApp Admin Panel © 2024
            </p>
            <div className="admin-layout__footer-links">
              <button className="admin-layout__footer-link">
                Volver a la aplicación
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div 
          className="admin-layout__overlay"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </div>
  );
};

// ===== WRAPPER CON ROUTER =====
const RouterWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

export default {
  title: 'Components/Templates/AdminLayout',
  component: AdminLayout,
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
# AdminLayout Template

Template base completo para el panel de administración que integra el AdminSidebar con el área de contenido principal.

## 🎯 Características implementadas

- **✅ Sidebar integrado**: AdminSidebar con contadores dinámicos en tiempo real
- **✅ Header administrativo**: Breadcrumbs automáticos, título de página y acciones
- **✅ Área de contenido responsive**: Se adapta automáticamente al estado del sidebar
- **✅ Autenticación**: Verificación de permisos de administrador (mock en Storybook)
- **✅ Estados de loading**: Para contadores y verificación de usuario
- **✅ CSS completo**: Usando variables del sistema de diseño
- **✅ Responsive design**: Mobile, tablet y desktop
- **✅ Integración completa**: Con todos los servicios implementados

## 🏗️ Arquitectura

\`\`\`
AdminLayout (Template) 📄
├── AdminSidebar (Organism) 🧬
│   ├── Navigation con contadores
│   └── Estados activos automáticos
├── Header Administrativo
│   ├── Breadcrumbs dinámicos
│   ├── Título de página
│   ├── Info de usuario
│   └── Acciones opcionales + logout
├── Área de Contenido Principal
│   └── {children} - Contenido específico
└── Footer Opcional
    └── Links de navegación
\`\`\`

## 🔧 Uso en páginas admin

\`\`\`jsx
import { AdminLayout } from './AdminLayout';
import { DataTable } from '../DataTable';

function UsersListPage() {
  return (
    <AdminLayout 
      title="Gestión de Usuarios"
      subtitle="Administrar cuentas de usuario"
      headerActions={
        <Button onClick={() => navigate('/admin/users/create')}>
          Crear Usuario
        </Button>
      }
    >
      <DataTable 
        data={users}
        columns={userColumns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </AdminLayout>
  );
}
\`\`\`

## 📊 Contadores en tiempo real

El layout se conecta automáticamente a todos los servicios para mostrar contadores actualizados:

- **Usuarios**: getUsersService
- **Películas**: getMoviesService  
- **Series**: getSeriesService
- **Categorías**: getCategoriesService
- **Episodios**: getEpisodesService

## 🛡️ Seguridad

- Verificación automática de permisos de administrador
- Redirección a login si no está autenticado
- Estados de loading durante verificación

## 📱 Responsive

- **Desktop**: Sidebar fijo + contenido amplio
- **Tablet**: Sidebar colapsible + contenido adaptable
- **Mobile**: Sidebar overlay + contenido stack
        `
      }
    }
  },
  argTypes: {
    title: {
      name: 'Título de página',
      description: 'Título principal mostrado en el header',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    subtitle: {
      name: 'Subtítulo',
      description: 'Descripción opcional bajo el título',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    variant: {
      name: 'Variante del layout',
      description: 'Estilo del layout administrativo',
      control: 'select',
      options: ['default', 'compact', 'full'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' }
      }
    },
    sidebarCollapsed: {
      name: 'Sidebar colapsado',
      description: 'Estado inicial del sidebar (expandido/colapsado)',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    className: {
      name: 'Clases CSS',
      description: 'Clases CSS adicionales para personalización',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    }
  }
};

// ===== DATOS MOCK PARA DEMO =====
const MOCK_STATS = {
  users: 156,
  movies: 89,
  series: 24,
  categories: 12,
  episodes: 180
};

// ===== CONTENIDO DE EJEMPLO =====
const DashboardContent = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-xl)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    marginBottom: 'var(--space-xl)'
  }}>
    {Object.entries(MOCK_STATS).map(([key, value]) => (
      <div 
        key={key}
        style={{
          padding: 'var(--space-lg)',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-default)',
          textAlign: 'center'
        }}
      >
        <h3 style={{ 
          fontSize: 'var(--font-size-2xl)',
          margin: '0 0 var(--space-sm) 0',
          color: 'var(--color-primary)',
          fontWeight: 'var(--font-weight-bold)'
        }}>
          {value}
        </h3>
        <p style={{ 
          margin: 0,
          color: 'var(--text-secondary)',
          textTransform: 'capitalize',
          fontSize: 'var(--font-size-sm)'
        }}>
          {key === 'users' ? 'Usuarios' : 
           key === 'movies' ? 'Películas' :
           key === 'series' ? 'Series' :
           key === 'categories' ? 'Categorías' : 'Episodios'}
        </p>
      </div>
    ))}
  </div>
);

const TableContent = () => (
  <div style={{
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-default)',
    overflow: 'hidden'
  }}>
    <div style={{
      padding: 'var(--space-lg)',
      borderBottom: '1px solid var(--border-default)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h3 style={{ 
        margin: 0,
        fontSize: 'var(--font-size-lg)',
        fontWeight: 'var(--font-weight-semibold)',
        color: 'var(--text-primary)'
      }}>
        Lista de Usuarios
      </h3>
      <Button size="sm" variant="primary">
        Crear Usuario
      </Button>
    </div>
    
    <div style={{ padding: 'var(--space-lg)' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1fr 1fr',
        gap: 'var(--space-md)',
        padding: 'var(--space-md) 0',
        borderBottom: '1px solid var(--border-default)',
        fontWeight: 'var(--font-weight-semibold)',
        color: 'var(--text-secondary)',
        fontSize: 'var(--font-size-sm)'
      }}>
        <div>ID</div>
        <div>Email</div>
        <div>Rol</div>
        <div>Acciones</div>
      </div>
      
      {[
        { id: 1, email: 'admin@streamapp.com', role: 'Admin' },
        { id: 2, email: 'editor@streamapp.com', role: 'Editor' },
        { id: 3, email: 'user@streamapp.com', role: 'Usuario' }
      ].map(user => (
        <div 
          key={user.id}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 1fr 1fr',
            gap: 'var(--space-md)',
            padding: 'var(--space-md) 0',
            borderBottom: '1px solid var(--border-light)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text-primary)'
          }}
        >
          <div>{user.id}</div>
          <div>{user.email}</div>
          <div>
            <span style={{
              padding: '0.2rem 0.6rem',
              backgroundColor: user.role === 'Admin' ? 'var(--color-primary-light)' : 'var(--bg-tertiary)',
              color: user.role === 'Admin' ? 'var(--color-primary)' : 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-medium)'
            }}>
              {user.role}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
            <Button size="xs" variant="ghost">✏️</Button>
            <Button size="xs" variant="ghost">🗑️</Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ========== TEMPLATE BASE ==========
const Template = (args) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(args.sidebarCollapsed || false);

  return (
    <MockAdminLayout
      {...args}
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={setSidebarCollapsed}
    >
      {args.children}
    </MockAdminLayout>
  );
};

// ========== HISTORIAS PRINCIPALES ==========

export const Playground = Template.bind({});
Playground.args = {
  title: 'Panel de Administración',
  subtitle: 'Gestiona todos los recursos de tu plataforma',
  variant: 'default',
  sidebarCollapsed: false,
  children: <DashboardContent />
};
Playground.parameters = {
  docs: {
    description: {
      story: 'Usa los controles para personalizar el AdminLayout. El sidebar muestra contadores dinámicos y se adapta automáticamente al contenido.'
    }
  }
};

// ========== DASHBOARD PRINCIPAL ==========
export const Dashboard = () => (
  <MockAdminLayout
    title="Dashboard"
    subtitle="Visión general de tu plataforma de streaming"
  >
    <div style={{ marginBottom: 'var(--space-xl)' }}>
      <DashboardContent />
      
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-default)',
        padding: 'var(--space-lg)'
      }}>
        <h3 style={{ 
          margin: '0 0 var(--space-md) 0',
          fontSize: 'var(--font-size-lg)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--text-primary)'
        }}>
          Actividad Reciente
        </h3>
        <div style={{ 
          color: 'var(--text-secondary)',
          fontSize: 'var(--font-size-sm)',
          lineHeight: 1.6
        }}>
          <p>• Nueva película "Spider-Man" agregada hace 2 horas</p>
          <p>• Serie "Breaking Bad" actualizada hace 4 horas</p>
          <p>• 3 nuevos usuarios registrados hoy</p>
          <p>• Categoría "Documentales" creada ayer</p>
        </div>
      </div>
    </div>
  </MockAdminLayout>
);

Dashboard.parameters = {
  docs: {
    description: {
      story: 'Dashboard principal con estadísticas y actividad reciente. Muestra cómo se integra el AdminLayout con contenido real.'
    }
  }
};

// ========== PÁGINA CON TABLA ==========
export const UsersListPage = () => (
  <MockAdminLayout
    title="Gestión de Usuarios"
    subtitle="Administrar cuentas y permisos de usuario"
    headerActions={
      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        <Button size="sm" variant="outline">
          Exportar CSV
        </Button>
        <Button size="sm" variant="primary">
          Crear Usuario
        </Button>
      </div>
    }
  >
    <TableContent />
  </MockAdminLayout>
);

UsersListPage.parameters = {
  docs: {
    description: {
      story: 'Ejemplo de página de gestión con tabla de datos, breadcrumbs automáticos y acciones en el header.'
    }
  }
};

// ========== VARIANTES ==========
export const CompactVariant = Template.bind({});
CompactVariant.args = {
  title: 'Vista Compacta',
  subtitle: 'Layout optimizado para espacios reducidos',
  variant: 'compact',
  children: <DashboardContent />
};

export const FullVariant = Template.bind({});
FullVariant.args = {
  title: 'Vista Completa',
  subtitle: 'Layout de ancho completo para máximo contenido',
  variant: 'full',
  children: <TableContent />
};

// ========== SIDEBAR COLAPSADO ==========
export const CollapsedSidebar = Template.bind({});
CollapsedSidebar.args = {
  title: 'Sidebar Colapsado',
  subtitle: 'Maximiza el espacio de trabajo',
  sidebarCollapsed: true,
  children: <TableContent />
};

// ========== BREADCRUMBS PERSONALIZADOS ==========
export const CustomBreadcrumbs = () => (
  <MockAdminLayout
    title="Editar Película"
    subtitle="Modificar información de Spider-Man"
    breadcrumbs={[
      { label: 'Admin', href: '/admin' },
      { label: 'Películas', href: '/admin/movies' },
      { label: 'Spider-Man', href: '/admin/movies/1' },
      { label: 'Editar' }
    ]}
    headerActions={
      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        <Button size="sm" variant="outline">
          Cancelar
        </Button>
        <Button size="sm" variant="primary">
          Guardar Cambios
        </Button>
      </div>
    }
  >
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-default)',
      padding: 'var(--space-xl)',
      maxWidth: '600px'
    }}>
      <h3 style={{ 
        margin: '0 0 var(--space-lg) 0',
        fontSize: 'var(--font-size-lg)',
        fontWeight: 'var(--font-weight-semibold)',
        color: 'var(--text-primary)'
      }}>
        Formulario de Edición
      </h3>
      <div style={{ 
        display: 'grid',
        gap: 'var(--space-md)',
        color: 'var(--text-secondary)'
      }}>
        <div>Título: Spider-Man: No Way Home</div>
        <div>Categoría: Acción</div>
        <div>Año: 2021</div>
        <div>Duración: 148 min</div>
        <div>Estado: Activo</div>
      </div>
    </div>
  </MockAdminLayout>
);

CustomBreadcrumbs.parameters = {
  docs: {
    description: {
      story: 'Ejemplo con breadcrumbs personalizados y acciones específicas en el header para formularios de edición.'
    }
  }
};

// ========== ESTADOS DE LOADING (SIMULADO) ==========
export const LoadingState = () => {
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return (
      <div className="admin-layout__loading">
        <div className="admin-layout__loading-content">
          <div className="admin-layout__spinner"></div>
          <p>Verificando acceso de administrador...</p>
        </div>
      </div>
    );
  }

  return (
    <MockAdminLayout
      title="Datos Cargados"
      subtitle="Información obtenida del servidor"
    >
      <DashboardContent />
    </MockAdminLayout>
  );
};

LoadingState.parameters = {
  docs: {
    description: {
      story: 'Estado de loading mientras se cargan los contadores y datos del servidor.'
    }
  }
};