// ===== TMDB SEARCH VIEW STORIES =====
// src/components/organisms/TMDBSearchView/TMDBSearchView.stories.jsx

import React, { useState } from 'react';
import { TMDBSearchView } from './TMDBSearchView';
import './TMDBSearchView.css';

export default {
  title: 'Components/Organisms/TMDBSearchView',
  component: TMDBSearchView,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# TMDBSearchView - Organism Reutilizable

El organism **TMDBSearchView** proporciona funcionalidad completa de búsqueda en TMDB (The Movie Database) que puede reutilizarse en diferentes páginas del panel de administración.

## 🎯 Características principales

- **Búsqueda flexible**: Películas, series o ambos tipos de contenido
- **Ordenamiento**: Por año (reciente/antiguo) y puntuación
- **Resultados visuales**: Grid responsivo con posters e información
- **Accesibilidad**: Navegación por teclado, ARIA labels, focus management
- **Estados**: Loading, error, resultados vacíos
- **Personalizable**: Títulos, placeholders, tipos de contenido
- **Responsive**: Mobile-first design con breakpoints optimizados

## 🔧 Componentes integrados
- **Button**: Acciones de búsqueda, limpiar, crear manual
- **Card**: Contenedores estructurados para búsqueda y resultados
- **ContentImage**: Posters con fallbacks elegantes
- **TextInput**: Input de búsqueda con validaciones
- **TextSelect**: Selector de ordenamiento

## 📱 Casos de uso
- **MovieCreatePage**: Búsqueda de películas para crear contenido
- **SeriesCreatePage**: Búsqueda de series para crear contenido
- **MovieEditPage**: Búsqueda para reemplazar información
- **ContentImportPage**: Importación masiva desde TMDB

## 🎨 Sistema de diseño
Usa exclusivamente componentes con stories de Storybook y variables CSS del sistema de diseño.
        `
      }
    }
  },
  argTypes: {
    contentType: {
      control: 'select',
      options: ['all', 'movie', 'series'],
      description: 'Tipo de contenido a buscar'
    },
    loading: {
      control: 'boolean',
      description: 'Estado de carga de la búsqueda'
    },
    showManualCreate: {
      control: 'boolean',
      description: 'Mostrar botón de creación manual'
    },
    results: {
      control: 'object',
      description: 'Array de resultados de búsqueda'
    }
  }
};

// ===== DATOS MOCK PARA LAS STORIES =====
const mockResults = [
  {
    id: 550,
    title: "Fight Club",
    type: "movie",
    year: "1999",
    rating: 8.8,
    overview: "Un empleado de oficina insomne y un fabricante de jabón forman un club de lucha clandestino que evoluciona hacia algo mucho, mucho más.",
    poster: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg"
  },
  {
    id: 13,
    title: "Forrest Gump",
    type: "movie", 
    year: "1994",
    rating: 8.8,
    overview: "Las presidencias de Kennedy y Johnson, Vietnam, Watergate y otros eventos históricos se desarrollan desde la perspectiva de un hombre de Alabama con un coeficiente intelectual de 75.",
    poster: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg"
  },
  {
    id: 1396,
    title: "Breaking Bad",
    type: "tv",
    year: "2008",
    rating: 9.5,
    overview: "Un profesor de química de secundaria diagnosticado con cáncer de pulmón inoperable recurre a la fabricación y venta de metanfetamina para asegurar el futuro financiero de su familia.",
    poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg"
  },
  {
    id: 1399,
    title: "Game of Thrones",
    type: "tv",
    year: "2011", 
    rating: 9.3,
    overview: "Nueve familias nobles luchan por el control sobre las tierras míticas de Westeros, mientras un antiguo enemigo regresa después de estar latente durante milenios.",
    poster: "https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg"
  },
  {
    id: 278,
    title: "The Shawshank Redemption",
    type: "movie",
    year: "1994",
    rating: 9.3,
    overview: "Dos hombres encarcelados se unen a lo largo de varios años, encontrando consuelo y eventual redención a través de actos de decencia común.",
    poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg"
  }
];

const sortOptions = [
  { value: "year-desc", label: "Más recientes" },
  { value: "year-asc", label: "Más antiguos" },
  { value: "rating-desc", label: "Mejor puntuados" }
];

// ===== WRAPPER CON STATE PARA INTERACTIVIDAD =====
const InteractiveWrapper = (args) => {
  const [searchQuery, setSearchQuery] = useState(args.searchQuery || "");
  const [sortBy, setSortBy] = useState(args.sortBy || "year-desc");
  const [results, setResults] = useState(args.results || []);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    // Simular búsqueda
    setTimeout(() => {
      setResults(mockResults);
      setLoading(false);
    }, 1000);
  };

  const handleClearResults = () => {
    setResults([]);
    setSearchQuery("");
  };

  const handleSelectItem = (item) => {
    alert(`Seleccionaste: ${item.title} (${item.year})`);
  };

  const handleManualCreate = () => {
    alert('Redirigiendo a creación manual...');
  };

  return (
    <TMDBSearchView
      {...args}
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      sortBy={sortBy}
      onSortChange={setSortBy}
      results={results}
      loading={loading}
      onSearch={handleSearch}
      onClearResults={handleClearResults}
      onSelectItem={handleSelectItem}
      onManualCreate={handleManualCreate}
      sortOptions={sortOptions}
    />
  );
};

// ========== STORIES PRINCIPALES ==========

export const Default = InteractiveWrapper.bind({});
Default.args = {
  contentType: 'all',
  title: '🎬 Buscar en TMDB',
  placeholder: 'Ej: Avatar, Breaking Bad, Inception...',
  helperText: 'Busca por título, año o palabras clave',
  showManualCreate: true
};
Default.parameters = {
  docs: {
    description: {
      story: 'Componente básico con todas las funcionalidades habilitadas. Prueba escribir algo y hacer clic en "Buscar" para ver los resultados.'
    }
  }
};

export const ForMovies = InteractiveWrapper.bind({});
ForMovies.args = {
  contentType: 'movie',
  title: '🎬 Buscar Películas',
  placeholder: 'Ej: Avatar, Inception, Titanic...',
  helperText: 'Busca películas por título o año',
  showManualCreate: true
};
ForMovies.parameters = {
  docs: {
    description: {
      story: 'Configurado específicamente para búsqueda de películas. El texto se adapta al contexto.'
    }
  }
};

export const ForSeries = InteractiveWrapper.bind({});
ForSeries.args = {
  contentType: 'series',
  title: '📺 Buscar Series',
  placeholder: 'Ej: Breaking Bad, Game of Thrones...',
  helperText: 'Busca series por título o año',
  showManualCreate: true
};
ForSeries.parameters = {
  docs: {
    description: {
      story: 'Configurado específicamente para búsqueda de series. Los textos se ajustan al tipo de contenido.'
    }
  }
};

export const WithResults = InteractiveWrapper.bind({});
WithResults.args = {
  contentType: 'all',
  title: '🎬 Buscar en TMDB',
  placeholder: 'Ej: Avatar, Breaking Bad, Inception...',
  helperText: 'Busca por título, año o palabras clave',
  showManualCreate: true,
  results: mockResults,
  searchQuery: 'películas populares'
};
WithResults.parameters = {
  docs: {
    description: {
      story: 'Muestra el componente con resultados de búsqueda ya cargados. Incluye películas y series populares.'
    }
  }
};

export const Loading = InteractiveWrapper.bind({});
Loading.args = {
  contentType: 'all',
  title: '🎬 Buscar en TMDB',
  placeholder: 'Ej: Avatar, Breaking Bad, Inception...',
  helperText: 'Busca por título, año o palabras clave',
  showManualCreate: true,
  loading: true,
  searchQuery: 'avatar'
};
Loading.parameters = {
  docs: {
    description: {
      story: 'Estado de carga durante una búsqueda. Los controles se deshabilitan y el botón muestra el estado de carga.'
    }
  }
};

export const WithError = InteractiveWrapper.bind({});
WithError.args = {
  contentType: 'all',
  title: '🎬 Buscar en TMDB',
  placeholder: 'Ej: Avatar, Breaking Bad, Inception...',
  helperText: 'Busca por título, año o palabras clave',
  showManualCreate: true,
  error: 'Error al conectar con TMDB. Verifica tu conexión e intenta de nuevo.'
};
WithError.parameters = {
  docs: {
    description: {
      story: 'Muestra cómo se ve el componente cuando hay un error en la búsqueda.'
    }
  }
};

export const WithoutManualCreate = InteractiveWrapper.bind({});
WithoutManualCreate.args = {
  contentType: 'all',
  title: '🎬 Buscar en TMDB',
  placeholder: 'Ej: Avatar, Breaking Bad, Inception...',
  helperText: 'Busca por título, año o palabras clave',
  showManualCreate: false
};
WithoutManualCreate.parameters = {
  docs: {
    description: {
      story: 'Variante sin el botón de "Crear Manualmente", útil cuando solo se quiere búsqueda y selección.'
    }
  }
};

export const Compact = InteractiveWrapper.bind({});
Compact.args = {
  contentType: 'all',
  title: '🔍 Búsqueda Rápida',
  placeholder: 'Buscar...',
  helperText: 'Título o año',
  showManualCreate: false,
  results: mockResults.slice(0, 3)
};
Compact.parameters = {
  docs: {
    description: {
      story: 'Versión más compacta del componente, ideal para espacios reducidos o como widget de búsqueda.'
    }
  }
};