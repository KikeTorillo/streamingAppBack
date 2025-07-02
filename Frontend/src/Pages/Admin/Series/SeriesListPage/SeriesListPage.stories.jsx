// ===== SERIES LIST PAGE STORIES =====
// src/Pages/Admin/Series/SeriesListPage/SeriesListPage.stories.jsx

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SeriesListPage } from './SeriesListPage';
import './SeriesListPage.css';

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
  title: 'Pages/Admin/SeriesListPage',
  component: SeriesListPage,
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
# SeriesListPage

Página de gestión de series con operaciones CRUD completas, homologada con CategoriesListPage y MoviesListPage.

## Componentes integrados
- **AdminLayout**: Layout base con breadcrumbs
- **DataTable**: Tabla con búsqueda, paginación y acciones
- **Button**: Crear serie y acciones

## Funcionalidades
- ✅ Lista de series desde servicios reales
- ✅ Operaciones: Ver, Editar, Eliminar
- ✅ Búsqueda y filtrado por título
- ✅ Estadísticas de series
- ✅ Estados loading/error/empty
- ✅ Confirmaciones de eliminación
- ✅ Navegación a crear/editar series

## Integración con backend
- ✅ Usa \`getSeriesService\` existente
- ✅ Endpoint: \`GET /api/v1/series\`
- ✅ Manejo de sesión expirada
- ✅ Normalización de campos del backend

## Campos mostrados
- **ID**: Identificador único de la serie
- **Título**: Nombre de la serie con badge
- **Categoría**: Categoría asignada (con formato)
- **Año**: Año de lanzamiento
- **Fecha de Creación**: Cuando se agregó al sistema

## Estadísticas mostradas
- Total de series
- Series nuevas (últimos 7 días)  
- Series con categoría asignada
- Series sin categoría
- Estados de carga y error

## Patrón de diseño
- ✅ Sigue exactamente el patrón de CategoriesListPage
- ✅ Mismos estilos y componentes
- ✅ Misma estructura de datos y estados
- ✅ Accesibilidad y responsive design
- ✅ Convenciones de exportación correctas

## Operaciones CRUD
- **Ver**: Modal/página de detalle (pendiente implementar)
- **Editar**: Navegación a \`/admin/series/edit/:id\`
- **Eliminar**: Confirmación + \`deleteSeriesService\`
- **Crear**: Navegación a \`/admin/series/create\`

## Manejo de errores
- Sesión expirada (401)
- Series no encontradas (404)  
- Errores de red y servidor
- Validaciones de eliminación
        `
      }
    }
  }
};

// ========== PÁGINA PRINCIPAL ==========
export const Default = () => <SeriesListPage />;

Default.parameters = {
  docs: {
    description: {
      story: 'Página completa de gestión de series con datos reales desde servicios. Incluye operaciones CRUD, estadísticas específicas de series y navegación integrada.'
    }
  }
};