// ===== SERIES CREATE PAGE STORIES =====
// src/Pages/Admin/Series/SeriesCreatePage.stories.jsx

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SeriesCreatePage } from './SeriesCreatePage';
import './SeriesCreatePage.css';

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
  title: 'Pages/Admin/SeriesCreatePage',
  component: SeriesCreatePage,
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
# SeriesCreatePage

Página para crear nuevas series usando DynamicForm del sistema de diseño.

## Componentes integrados
- **AdminLayout**: Layout con breadcrumbs
- **DynamicForm**: Formulario con validaciones
- **Button**: Acciones del header

## Funcionalidades
- ✅ Formulario con validaciones
- ✅ Campos: título, categoría, año, descripción
- ✅ Integración con createSeriesService
- ✅ Estados de loading/success/error
- ✅ Búsqueda en TMDB para autocompletar datos
        `
      }
    }
  }
};

// ========== PÁGINA PRINCIPAL ==========
export const Default = () => <SeriesCreatePage />;

Default.parameters = {
  docs: {
    description: {
      story: "Página completa para crear series con formulario dinámico, validaciones y estados de carga."
    }
  }
};
