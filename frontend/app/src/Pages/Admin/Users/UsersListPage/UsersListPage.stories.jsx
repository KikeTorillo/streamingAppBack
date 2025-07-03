// ===== USERS LIST PAGE STORIES =====
// src/Pages/Admin/Users/UsersListPage.stories.jsx

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { UsersListPage } from './UsersListPage';
import './UsersListPage.css';

// ===== WRAPPER CON ROUTER Y MOCK USER =====
const RouterWrapper = ({ children }) => {
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
  title: 'Pages/Admin/UsersListPage',
  component: UsersListPage,
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
# UsersListPage

Página de gestión de usuarios con operaciones CRUD completas.

## Componentes integrados
- **AdminLayout**: Layout base con breadcrumbs
- **DataTable**: Tabla con búsqueda, paginación y acciones
- **Button**: Crear usuario y acciones

## Funcionalidades
- ✅ Lista de usuarios desde servicios reales
- ✅ Operaciones: Ver, Editar, Eliminar
- ✅ Búsqueda y filtrado
- ✅ Estadísticas por rol
- ✅ Estados loading/error/empty
- ✅ Confirmaciones de eliminación
        `
      }
    }
  }
};

// ========== PÁGINA PRINCIPAL ==========
export const Default = () => <UsersListPage />;

Default.parameters = {
  docs: {
    description: {
      story: 'Página completa de gestión de usuarios con datos reales desde servicios. Incluye operaciones CRUD y estadísticas.'
    }
  }
};