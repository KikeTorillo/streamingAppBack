// ===== CATEGORIES LIST PAGE STORIES =====
// src/Pages/Admin/Categories/CategoriesListPage/CategoriesListPage.stories.jsx

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CategoriesListPage } from './CategoriesListPage';
import './CategoriesListPage.css';

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
  title: 'Pages/Admin/CategoriesListPage',
  component: CategoriesListPage,
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
# CategoriesListPage

Página de gestión de categorías con operaciones CRUD completas, homologada con UsersListPage.

## Componentes integrados
- **AdminLayout**: Layout base con breadcrumbs
- **DataTable**: Tabla con búsqueda, paginación y acciones
- **Button**: Crear categoría y acciones

## Funcionalidades
- ✅ Lista de categorías desde servicios reales
- ✅ Operaciones: Ver, Editar, Eliminar
- ✅ Búsqueda y filtrado por nombre
- ✅ Estadísticas de categorías
- ✅ Estados loading/error/empty
- ✅ Confirmaciones de eliminación
- ✅ Navegación a crear/editar categorías

## Integración con backend
- ✅ Usa \`getCategoriesService\` existente
- ✅ Endpoint: \`GET /api/v1/category\`
- ✅ Manejo de sesión expirada
- ✅ Normalización de campos del backend

## Patrón de diseño
- ✅ Sigue exactamente el patrón de UsersListPage
- ✅ Mismos estilos y componentes
- ✅ Misma estructura de datos y estados
- ✅ Accesibilidad y responsive design

## Estadísticas mostradas
- Total de categorías
- Categorías nuevas (últimos 7 días)  
- Categorías con nombres cortos/largos
- Estados de carga y error
        `
      }
    }
  }
};

// ========== PÁGINA PRINCIPAL ==========
export const Default = () => <CategoriesListPage />;

Default.parameters = {
  docs: {
    description: {
      story: 'Página completa de gestión de categorías con datos reales desde servicios. Incluye operaciones CRUD y estadísticas específicas de categorías.'
    }
  }
};