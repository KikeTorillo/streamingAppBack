// ===== ADMIN DASHBOARD STORIES =====
// src/Pages/Admin/AdminDashboard/AdminDashboard.stories.jsx

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AdminDashboard } from './AdminDashboard';
import './AdminDashboard.css';

// ===== WRAPPER CON ROUTER Y MOCK USER =====
const RouterWrapper = ({ children }) => {
  // Mock user para Storybook
  React.useEffect(() => {
    if (!sessionStorage.getItem('sessionUser')) {
      sessionStorage.setItem('sessionUser', JSON.stringify({
        id: 1,
        email: 'admin@streamapp.com',
        roleId: 1,
        role: 'admin'
      }));
    }
    
    return () => {
      sessionStorage.removeItem('sessionUser');
    };
  }, []);

  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

export default {
  title: 'Pages/AdminDashboard',
  component: AdminDashboard,
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
# AdminDashboard Page

Página principal del panel de administración simplificada sin datos mock.

## Componentes integrados
- **AdminLayout**: Template base
- **StatsCard**: Métricas principales  
- **Button**: Acciones rápidas

## Funcionalidades
- ✅ Estadísticas en tiempo real desde servicios
- ✅ Navegación a páginas específicas
- ✅ Acciones rápidas para administradores
- ✅ Estados de loading y error
- ✅ Responsive design
- ✅ Enfoque en datos reales solamente

## Filosofía de simplicidad
- ❌ Sin datos mock o simulados
- ✅ Solo funcionalidades con datos reales
- ✅ Código limpio y mantenible
        `
      }
    }
  }
};

// ========== DASHBOARD PRINCIPAL ==========
export const Default = () => <AdminDashboard />;

Default.parameters = {
  docs: {
    description: {
      story: 'Dashboard principal simplificado. Muestra únicamente estadísticas reales desde los servicios y acciones rápidas para administradores.'
    }
  }
};