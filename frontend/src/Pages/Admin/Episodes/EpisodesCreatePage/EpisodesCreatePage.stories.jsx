// ===== EPISODES CREATE PAGE STORIES =====
// src/Pages/Admin/Episodes/EpisodesCreatePage/EpisodesCreatePage.stories.jsx

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { EpisodesCreatePage } from './EpisodesCreatePage';
import './EpisodesCreatePage.css';

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
  title: 'Pages/Admin/EpisodesCreatePage',
  component: EpisodesCreatePage,
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
# EpisodesCreatePage

Página para crear nuevos episodios usando DynamicForm del sistema de diseño.

## Componentes integrados
- **AdminLayout**: Layout con breadcrumbs y header
- **Container**: Contenedor responsive para el formulario
- **DynamicForm**: Formulario con validaciones específicas para episodios
- **Button**: Acciones del header y navegación

## Funcionalidades
- ✅ Formulario completo con validaciones específicas para episodios
- ✅ Campos: serie, temporada, número, título, descripción, video
- ✅ Integración con createEpisodeService y getSeriesService
- ✅ Estados de loading/success/error con mensajes específicos
- ✅ Carga dinámica de series disponibles
- ✅ Validaciones de frontend y backend integradas
- ✅ Navegación consistente con breadcrumbs

## Integración con backend
- ✅ Usa \`createEpisodeService\` para crear episodios
- ✅ Usa \`getSeriesService\` para cargar series disponibles
- ✅ Endpoint: \`POST /api/v1/episodes\` con FormData
- ✅ Manejo de archivos de video con multipart/form-data
- ✅ Validación según schema: serieId, season, episodeNumber, title, description, video

## Campos del formulario
- **Serie**: Lista desplegable de series disponibles (requerido)
- **Temporada**: Número entero 1-99 (requerido)
- **Número de Episodio**: Número entero 1-999 (requerido)
- **Título**: Texto opcional hasta 255 caracteres
- **Descripción**: Textarea opcional hasta 1000 caracteres
- **Video**: Archivo de video requerido (MP4, AVI, MKV, etc.)

## Validaciones implementadas
- **Serie**: Requerida, debe existir en el sistema
- **Temporada y Episodio**: Números positivos en rango válido
- **Combinación única**: Temporada + Episodio debe ser única por serie
- **Archivo de video**: Requerido, formatos de video válidos
- **Título y descripción**: Longitud máxima controlada

## Estados de la página
- **Carga inicial**: Obtiene series disponibles del backend
- **Sin series**: Muestra mensaje y enlace para crear series
- **Error de carga**: Manejo de errores de conexión o permisos
- **Formulario activo**: Validaciones en tiempo real
- **Enviando**: Estado de loading con botón deshabilitado
- **Éxito**: Confirmación y redirección automática
- **Error de envío**: Mensajes específicos según el tipo de error

## Manejo de errores específicos
- **Episodio duplicado**: "Ya existe un episodio con esa temporada y número"
- **Serie no válida**: Validación de que la serie existe
- **Archivo de video**: Errores de formato, tamaño o corrupción
- **Conexión**: Problemas de red con reintentos
- **Permisos**: Sesión expirada o sin permisos de administrador

## Patrón de diseño
- ✅ Sigue exactamente el patrón de CategoryCreatePage y SeriesCreatePage
- ✅ Mismos estilos y componentes base
- ✅ Container con tamaño "lg" para formularios complejos
- ✅ DynamicForm con 2 columnas en desktop, 1 en móvil
- ✅ Mensajes de estado consistentes
- ✅ Accesibilidad y responsive design
- ✅ Convenciones de exportación correctas

## Casos de uso principales
- **Crear episodio nuevo**: Flujo completo con serie existente
- **Múltiples episodios**: Crear episodios secuenciales de una temporada
- **Series sin episodios**: Primer episodio de una serie nueva
- **Errores de usuario**: Validaciones y mensajes de ayuda
- **Archivos grandes**: Manejo de uploads de video extensos

## Características específicas de episodios
- **Relación obligatoria**: Todos los episodios deben pertenecer a una serie
- **Numeración secuencial**: Temporadas y episodios ordenados
- **Archivos de video**: Procesamiento automático después de la creación
- **Metadatos opcionales**: Título y descripción específicos del episodio
- **Validación de unicidad**: No permite duplicados T1E1 en la misma serie

## Responsive Design
- **Desktop**: Formulario de 2 columnas, info cards lado a lado
- **Tablet**: Formulario de 1 columna, info cards apiladas
- **Móvil**: Diseño compacto con texto ajustado
- **Touch**: Controles optimizados para interacción táctil

## Accesibilidad
- **Focus management**: Orden lógico de tabulación
- **Screen readers**: Textos alternativos y labels descriptivos
- **Contraste**: Cumple WCAG 2.1 AA
- **Keyboard navigation**: Totalmente navegable por teclado
- **Motion**: Respeta preferencias de movimiento reducido

## Integración con el sistema
- **Breadcrumbs**: Navegación jerárquica clara
- **Estados globales**: Consistente con otras páginas admin
- **Servicios**: Reutiliza servicios existentes del proyecto
- **Rutas**: Integrado con el sistema de rutas de React Router
- **Permisos**: Protegido por AdminRoute wrapper
        `
      }
    }
  }
};

// ========== PÁGINA PRINCIPAL ==========
export const Default = () => <EpisodesCreatePage />;

Default.parameters = {
  docs: {
    description: {
      story: 'Página completa para crear episodios con formulario dinámico, carga de series, validaciones y estados de carga. Incluye manejo de archivos de video y validaciones específicas para episodios.'
    }
  }
};

// ========== ESTADOS ESPECÍFICOS ==========

export const LoadingSeries = () => {
  // Mock del estado de carga de series
  React.useEffect(() => {
    // Simular delay en la carga de series
    const originalService = window.getSeriesService;
    window.getSeriesService = () => new Promise(resolve => {
      setTimeout(() => resolve({ data: [] }), 5000);
    });
    
    return () => {
      window.getSeriesService = originalService;
    };
  }, []);

  return <EpisodesCreatePage />;
};

LoadingSeries.parameters = {
  docs: {
    description: {
      story: 'Estado de la página mientras se cargan las series disponibles desde el backend.'
    }
  }
};

export const NoSeriesAvailable = () => {
  // Mock sin series disponibles
  React.useEffect(() => {
    const originalService = window.getSeriesService;
    window.getSeriesService = () => Promise.resolve({ data: [] });
    
    return () => {
      window.getSeriesService = originalService;
    };
  }, []);

  return <EpisodesCreatePage />;
};

NoSeriesAvailable.parameters = {
  docs: {
    description: {
      story: 'Estado cuando no hay series disponibles en el sistema. Muestra mensaje informativo para que el admin cree series primero.'
    }
  }
};

export const WithSeriesData = () => {
  // Mock con series de ejemplo
  React.useEffect(() => {
    const originalService = window.getSeriesService;
    window.getSeriesService = () => Promise.resolve({
      data: [
        { id: 1, title: 'Breaking Bad', release_year: 2008 },
        { id: 2, title: 'Game of Thrones', release_year: 2011 },
        { id: 3, title: 'The Office', release_year: 2005 },
        { id: 4, title: 'Stranger Things', release_year: 2016 }
      ]
    });
    
    return () => {
      window.getSeriesService = originalService;
    };
  }, []);

  return <EpisodesCreatePage />;
};

WithSeriesData.parameters = {
  docs: {
    description: {
      story: 'Estado normal con series disponibles cargadas. Muestra el formulario completo listo para crear episodios.'
    }
  }
};