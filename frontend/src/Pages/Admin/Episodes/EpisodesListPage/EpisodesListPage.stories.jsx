// ===== EPISODES LIST PAGE STORIES - ACTUALIZADAS CON SELECTOR DE SERIES =====
// src/Pages/Admin/Episodes/EpisodesListPage/EpisodesListPage.stories.jsx

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { EpisodesListPage } from './EpisodesListPage';
import './EpisodesListPage.css';

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
  title: 'Pages/Admin/EpisodesListPage',
  component: EpisodesListPage,
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
# EpisodesListPage con Selector de Series

Página de gestión de episodios que incluye un selector de series para filtrar episodios.

## 🆕 Cambios Implementados

### Selector de Series
- **Solución simple**: Select HTML nativo para elegir la serie
- **Carga automática**: Las series se cargan al montar el componente
- **Filtrado**: Solo muestra episodios de la serie seleccionada
- **Estados de carga**: Maneja loading, error y vacío para las series

### Backend Integration
- **getSeriesService**: Carga todas las series disponibles
- **getEpisodesService**: Recibe \`{ serieId }\` como parámetro requerido
- **Filtrado en backend**: El endpoint espera el serieId para devolver episodios

## Componentes integrados
- **AdminLayout**: Layout base con breadcrumbs
- **DataTable**: Tabla con búsqueda, paginación y acciones
- **Button**: Crear episodio y acciones
- **🆕 Select nativo**: Selector de series simple y funcional

## Funcionalidades
- ✅ Selector de series con carga dinámica
- ✅ Lista de episodios filtrada por serie seleccionada  
- ✅ Operaciones: Ver, Editar, Eliminar (sin cambios)
- ✅ Búsqueda y filtrado por título (sin cambios)
- ✅ Estadísticas de episodios (mostradas solo si hay serie seleccionada)
- ✅ Estados loading/error/empty mejorados
- ✅ Confirmaciones de eliminación (sin cambios)
- ✅ Navegación a crear/editar episodios (sin cambios)

## Integración con backend
- ✅ Usa \`getSeriesService\` para cargar series disponibles
- ✅ Usa \`getEpisodesService({ serieId })\` con filtro obligatorio
- ✅ Endpoint: \`GET /api/v1/episodes?serieId=:id\`
- ✅ Manejo de sesión expirada (sin cambios)
- ✅ Normalización de campos del backend (sin cambios)

## Estados del selector
- **Cargando**: "⏳ Cargando series..."
- **Error**: "❌ Error al cargar series" 
- **Vacío**: "📺 No hay series disponibles"
- **Normal**: "-- Selecciona una serie --"

## Empty States
- **Sin serie seleccionada**: "Selecciona una serie / Elige una serie del selector..."
- **Serie sin episodios**: "No hay episodios / La serie seleccionada no tiene episodios..."

## Estadísticas mostradas
- Solo se muestran cuando hay una serie seleccionada
- Total de episodios de la serie
- Episodios nuevos (últimos 7 días)  
- Episodios con serie asignada
- Episodios sin serie asignada

## Patrón de diseño
- ✅ Sigue convención de exports: \`function NombreComponente() {} export { NombreComponente }\`
- ✅ Solución simple antes que compleja
- ✅ Componentes del sistema de diseño con stories
- ✅ Variables CSS centralizadas en \`app.css\`
- ✅ Legibilidad y mantenibilidad

## Responsive Design
- ✅ Selector responsive en móviles
- ✅ Estadísticas adaptables a pantalla pequeña
- ✅ Grid de estadísticas: 4 columnas → 2 columnas → 1 columna

## Accesibilidad
- ✅ Label asociado al select con \`htmlFor\`
- ✅ Estados de disabled correctos
- ✅ Focus management en el selector
- ✅ Textos descriptivos para screen readers
        `
      }
    }
  }
};

// ========== PÁGINA PRINCIPAL ==========
export const Default = () => <EpisodesListPage />;

Default.parameters = {
  docs: {
    description: {
      story: 'Página completa de gestión de episodios con selector de series. Incluye carga dinámica de series, filtrado de episodios por serie seleccionada y operaciones CRUD.'
    }
  }
};

// ========== ESTADOS DEL SELECTOR ==========

export const LoadingSeries = () => {
  // Mock del estado de carga de series
  React.useEffect(() => {
    const originalGetSeries = window.getSeriesService;
    window.getSeriesService = () => new Promise(resolve => {
      setTimeout(() => resolve({ data: [] }), 5000);
    });
    
    return () => {
      window.getSeriesService = originalGetSeries;
    };
  }, []);

  return <EpisodesListPage />;
};

LoadingSeries.parameters = {
  docs: {
    description: {
      story: 'Estado mientras se cargan las series disponibles desde el backend. El selector muestra "⏳ Cargando series..." y está deshabilitado.'
    }
  }
};

export const NoSeriesAvailable = () => {
  // Mock sin series disponibles
  React.useEffect(() => {
    const originalGetSeries = window.getSeriesService;
    window.getSeriesService = () => Promise.resolve({ data: [] });
    
    return () => {
      window.getSeriesService = originalGetSeries;
    };
  }, []);

  return <EpisodesListPage />;
};

NoSeriesAvailable.parameters = {
  docs: {
    description: {
      story: 'Estado cuando no hay series disponibles en el sistema. El selector muestra "📺 No hay series disponibles" y la tabla muestra mensaje para crear series primero.'
    }
  }
};

export const WithSeriesButNoSelection = () => {
  // Mock con series disponibles pero sin selección
  React.useEffect(() => {
    const originalGetSeries = window.getSeriesService;
    window.getSeriesService = () => Promise.resolve({
      data: [
        { id: 1, title: 'Breaking Bad', release_year: 2008 },
        { id: 2, title: 'Game of Thrones', release_year: 2011 },
        { id: 3, title: 'The Office', release_year: 2005 },
        { id: 4, title: 'Stranger Things', release_year: 2016 }
      ]
    });
    
    return () => {
      window.getSeriesService = originalGetSeries;
    };
  }, []);

  return <EpisodesListPage />;
};

WithSeriesButNoSelection.parameters = {
  docs: {
    description: {
      story: 'Estado con series cargadas pero sin seleccionar ninguna. El selector muestra "-- Selecciona una serie --" y la tabla muestra mensaje para seleccionar una serie.'
    }
  }
};

export const SeriesWithEpisodes = () => {
  // Mock con series y episodios
  React.useEffect(() => {
    const originalGetSeries = window.getSeriesService;
    const originalGetEpisodes = window.getEpisodesService;
    
    // Mock series
    window.getSeriesService = () => Promise.resolve({
      data: [
        { id: 1, title: 'Breaking Bad', release_year: 2008 },
        { id: 2, title: 'Game of Thrones', release_year: 2011 }
      ]
    });
    
    // Mock episodios para Breaking Bad
    window.getEpisodesService = ({ serieId }) => {
      if (serieId === 1) {
        return Promise.resolve({
          data: [
            {
              id: 1,
              title: 'Pilot',
              serie: { id: 1, title: 'Breaking Bad' },
              season: 1,
              episodeNumber: 1,
              duration: 2760, // 46 minutos
              createdAt: '2024-01-15T10:30:00Z'
            },
            {
              id: 2,
              title: 'Cat\'s in the Bag...',
              serie: { id: 1, title: 'Breaking Bad' },
              season: 1,
              episodeNumber: 2,
              duration: 2820, // 47 minutos
              createdAt: '2024-01-16T11:00:00Z'
            },
            {
              id: 3,
              title: '...And the Bag\'s in the River',
              serie: { id: 1, title: 'Breaking Bad' },
              season: 1,
              episodeNumber: 3,
              duration: 2880, // 48 minutos
              createdAt: '2024-01-17T09:45:00Z'
            }
          ]
        });
      }
      return Promise.resolve({ data: [] });
    };
    
    return () => {
      window.getSeriesService = originalGetSeries;
      window.getEpisodesService = originalGetEpisodes;
    };
  }, []);

  return <EpisodesListPage />;
};

SeriesWithEpisodes.parameters = {
  docs: {
    description: {
      story: 'Estado normal con series disponibles y episodios cargados. Muestra la funcionalidad completa: selector, estadísticas y tabla de episodios con datos de Breaking Bad.'
    }
  }
};

export const SeriesWithoutEpisodes = () => {
  // Mock con series pero sin episodios
  React.useEffect(() => {
    const originalGetSeries = window.getSeriesService;
    const originalGetEpisodes = window.getEpisodesService;
    
    window.getSeriesService = () => Promise.resolve({
      data: [
        { id: 1, title: 'Breaking Bad', release_year: 2008 },
        { id: 2, title: 'Game of Thrones', release_year: 2011 }
      ]
    });
    
    // Siempre devolver array vacío
    window.getEpisodesService = () => Promise.resolve({ data: [] });
    
    return () => {
      window.getSeriesService = originalGetSeries;
      window.getEpisodesService = originalGetEpisodes;
    };
  }, []);

  return <EpisodesListPage />;
};

SeriesWithoutEpisodes.parameters = {
  docs: {
    description: {
      story: 'Estado cuando se selecciona una serie que no tiene episodios. Muestra estadísticas en cero y empty state con opción para crear episodio.'
    }
  }
};

export const ErrorLoadingSeries = () => {
  // Mock error al cargar series
  React.useEffect(() => {
    const originalGetSeries = window.getSeriesService;
    window.getSeriesService = () => Promise.reject(new Error('Error de conexión'));
    
    return () => {
      window.getSeriesService = originalGetSeries;
    };
  }, []);

  return <EpisodesListPage />;
};

ErrorLoadingSeries.parameters = {
  docs: {
    description: {
      story: 'Estado de error al cargar las series desde el backend. El selector muestra "❌ Error al cargar series" y está deshabilitado.'
    }
  }
};