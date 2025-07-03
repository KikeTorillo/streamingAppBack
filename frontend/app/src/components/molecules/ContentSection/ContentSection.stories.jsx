// ContentSection.stories.jsx
import React from 'react';
import { ContentSection } from './ContentSection';
import { ContentCard } from '../ContentCard/ContentCard';
import { Button } from '../../atoms/Button/Button';
import './ContentSection.css';

export default {
  title: 'Components/Molecules/ContentSection',
  component: ContentSection,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# ContentSection Molecule

El componente **ContentSection** es un contenedor para secciones de contenido con título, ícono y manejo automático de estados (carga, vacío, error). 
Fundamental para organizar el contenido en páginas como MainPage.

## 🎯 Características principales

- **Estados automáticos**: Maneja loading, empty, error sin configuración adicional
- **Grid responsivo**: Grid CSS configurable con props
- **Skeletons integrados**: Loading states visuales automáticos
- **EmptyState integrado**: Usa el componente EmptyState para estados vacíos
- **3 tamaños**: SM, MD, LG para diferentes contextos
- **3 variantes**: Default, Featured, Compact
- **Accesible**: Estructura semántica y navegación por teclado

## 🔧 Uso básico

\`\`\`jsx
import { ContentSection } from './molecules/ContentSection';
import { ContentCard } from './molecules/ContentCard';

// Básico con contenido
<ContentSection title="Películas Populares" icon="🎬">
  {movies.map(movie => 
    <ContentCard key={movie.id} content={movie} />
  )}
</ContentSection>

// Con estados
<ContentSection 
  title="Series en Tendencia" 
  icon="📺"
  loading={isLoading}
  error={errorMessage}
  empty={series.length === 0}
  emptyTitle="No hay series disponibles"
  emptyDescription="Vuelve pronto para ver nuevo contenido"
  emptyAction={<Button>Explorar películas</Button>}
/>
\`\`\`

## 📱 Casos de uso en MainPage

- **Secciones de películas**: "Películas Populares", "Recién Agregadas"
- **Secciones de series**: "Series en Tendencia", "Documentales"
- **Resultados de búsqueda**: Con estados vacíos personalizados
- **Categorías filtradas**: Con manejo de estados de carga

## 🎨 Configuración del grid

\`\`\`jsx
// Grid personalizado
<ContentSection 
  gridColumns="repeat(auto-fit, minmax(250px, 1fr))"
  gridGap="var(--space-lg)"
>
  {content}
</ContentSection>
\`\`\`

## ♿ Accesibilidad

- Usa elemento \`<section>\` semántico
- Títulos con jerarquía correcta (h2)
- Estados de carga anunciados a lectores de pantalla
- Respeta preferencias de movimiento reducido
        `
      }
    }
  },
  argTypes: {
    title: {
      name: 'Título',
      description: 'Título de la sección',
      control: 'text'
    },
    icon: {
      name: 'Ícono',
      description: 'Emoji o texto para el ícono',
      control: 'text'
    },
    loading: {
      name: 'Estado de carga',
      description: 'Si la sección está cargando',
      control: 'boolean'
    },
    error: {
      name: 'Mensaje de error',
      description: 'Mensaje de error si falla la carga',
      control: 'text'
    },
    empty: {
      name: 'Estado vacío',
      description: 'Si la sección no tiene contenido',
      control: 'boolean'
    },
    size: {
      name: 'Tamaño',
      description: 'Tamaño de la sección',
      control: 'select',
      options: ['sm', 'md', 'lg']
    },
    variant: {
      name: 'Variante',
      description: 'Variante visual',
      control: 'select',
      options: ['default', 'featured', 'compact']
    },
    showDivider: {
      name: 'Mostrar divisor',
      description: 'Si mostrar línea divisoria bajo el título',
      control: 'boolean'
    },
    gridColumns: {
      name: 'Columnas del grid',
      description: 'CSS grid-template-columns',
      control: 'text'
    },
    gridGap: {
      name: 'Espacio del grid',
      description: 'CSS gap del grid',
      control: 'text'
    }
  }
};

// Datos de ejemplo para las stories
const SAMPLE_MOVIES = [
  {
    id: 1,
    title: "Spider-Man: No Way Home",
    category: "Acción",
    year: 2021,
    type: "movie",
    cover: "https://images.unsplash.com/photo-1635863138275-d9864d29a8d5?w=300&h=450&fit=crop",
    rating: 8.4,
    duration: 148
  },
  {
    id: 2,
    title: "Dune",
    category: "Ciencia Ficción",
    year: 2021,
    type: "movie",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=450&fit=crop",
    rating: 8.0,
    duration: 155
  },
  {
    id: 3,
    title: "The Batman",
    category: "Acción",
    year: 2022,
    type: "movie",
    cover: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=300&h=450&fit=crop",
    rating: 7.8,
    duration: 176
  },
  {
    id: 4,
    title: "Encanto",
    category: "Animación",
    year: 2021,
    type: "movie",
    cover: "https://images.unsplash.com/photo-1489599485995-d918135f0b1f?w=300&h=450&fit=crop",
    rating: 7.3,
    duration: 102
  }
];

// ========== HISTORIA DEFAULT ==========
export const Default = {
  args: {
    title: 'Películas Populares',
    icon: '🎬',
    loading: false,
    error: null,
    empty: false,
    size: 'md',
    variant: 'default',
    showDivider: true,
    gridColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gridGap: 'var(--space-md)'
  },
  render: (args) => (
    <ContentSection {...args}>
      {SAMPLE_MOVIES.map(movie => (
        <ContentCard key={movie.id} content={movie} />
      ))}
    </ContentSection>
  )
};

// ========== TAMAÑOS ==========
export const Sizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3xl)' }}>
    <ContentSection title="Sección Pequeña" icon="🔸" size="sm">
      {SAMPLE_MOVIES.slice(0, 3).map(movie => (
        <ContentCard key={movie.id} content={movie} size="sm" />
      ))}
    </ContentSection>
    
    <ContentSection title="Sección Mediana" icon="🔹" size="md">
      {SAMPLE_MOVIES.map(movie => (
        <ContentCard key={movie.id} content={movie} />
      ))}
    </ContentSection>
    
    <ContentSection title="Sección Grande" icon="🔷" size="lg">
      {SAMPLE_MOVIES.map(movie => (
        <ContentCard key={movie.id} content={movie} size="lg" />
      ))}
    </ContentSection>
  </div>
);

Sizes.parameters = {
  docs: {
    description: {
      story: 'Tres tamaños disponibles: SM para sidebars, MD para uso general, LG para secciones principales.'
    }
  }
};

// ========== VARIANTES ==========
export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3xl)' }}>
    <ContentSection title="Sección Normal" icon="📄" variant="default">
      {SAMPLE_MOVIES.slice(0, 3).map(movie => (
        <ContentCard key={movie.id} content={movie} />
      ))}
    </ContentSection>
    
    <ContentSection title="Sección Destacada" icon="⭐" variant="featured">
      {SAMPLE_MOVIES.slice(0, 3).map(movie => (
        <ContentCard key={movie.id} content={movie} />
      ))}
    </ContentSection>
    
    <ContentSection title="Sección Compacta" icon="📋" variant="compact" showDivider={false}>
      {SAMPLE_MOVIES.slice(0, 3).map(movie => (
        <ContentCard key={movie.id} content={movie} size="sm" />
      ))}
    </ContentSection>
  </div>
);

Variants.parameters = {
  docs: {
    description: {
      story: 'Variantes visuales: default, featured (destacada con fondo), compact (espaciado reducido).'
    }
  }
};

// ========== ESTADOS ==========
export const States = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3xl)' }}>
    <ContentSection title="Estado de Carga" icon="⏳" loading={true} />
    
    <ContentSection 
      title="Estado Vacío" 
      icon="📭" 
      empty={true}
      emptyTitle="No hay películas disponibles"
      emptyDescription="El catálogo está siendo actualizado. Vuelve pronto."
      emptyAction={<Button variant="primary">Explorar series</Button>}
    />
    
    <ContentSection 
      title="Estado de Error" 
      icon="⚠️" 
      error="No se pudo conectar con el servidor. Verifica tu conexión a internet."
    />
  </div>
);

States.parameters = {
  docs: {
    description: {
      story: 'Estados automáticos: loading (skeletons), empty (EmptyState), error (mensaje de error).'
    }
  }
};

// ========== CONFIGURACIÓN DE GRID ==========
export const GridConfiguration = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3xl)' }}>
    <ContentSection 
      title="Grid Compacto (3 columnas mínimo)" 
      icon="🔲"
      gridColumns="repeat(auto-fit, minmax(150px, 1fr))"
      gridGap="var(--space-sm)"
    >
      {SAMPLE_MOVIES.map(movie => (
        <ContentCard key={movie.id} content={movie} size="sm" />
      ))}
    </ContentSection>
    
    <ContentSection 
      title="Grid Estándar (4-5 columnas)" 
      icon="🔳"
      gridColumns="repeat(auto-fit, minmax(200px, 1fr))"
      gridGap="var(--space-md)"
    >
      {SAMPLE_MOVIES.map(movie => (
        <ContentCard key={movie.id} content={movie} />
      ))}
    </ContentSection>
    
    <ContentSection 
      title="Grid Amplio (2-3 columnas)" 
      icon="🔲"
      gridColumns="repeat(auto-fit, minmax(300px, 1fr))"
      gridGap="var(--space-lg)"
    >
      {SAMPLE_MOVIES.slice(0, 3).map(movie => (
        <ContentCard key={movie.id} content={movie} size="lg" />
      ))}
    </ContentSection>
  </div>
);

GridConfiguration.parameters = {
  docs: {
    description: {
      story: 'Configuración del grid CSS personalizable via props para diferentes layouts.'
    }
  }
};

// ========== CASOS DE USO PARA MAINPAGE ==========
export const MainPageUseCases = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3xl)' }}>
    {/* Sección principal con contenido */}
    <ContentSection 
      title="🎬 Películas Populares" 
      icon="🎬"
      variant="featured"
      size="lg"
    >
      {SAMPLE_MOVIES.map(movie => (
        <ContentCard key={movie.id} content={movie} />
      ))}
    </ContentSection>
    
    {/* Sección de series */}
    <ContentSection 
      title="📺 Series en Tendencia" 
      icon="📺"
    >
      {SAMPLE_MOVIES.slice(0, 3).map(movie => (
        <ContentCard key={movie.id} content={{...movie, type: 'series'}} />
      ))}
    </ContentSection>
    
    {/* Sección sin resultados de búsqueda */}
    <ContentSection 
      title="🔍 Resultados de búsqueda para 'batman'" 
      icon="🔍"
      empty={true}
      emptyIcon="🔍"
      emptyTitle="Sin resultados para tu búsqueda"
      emptyDescription="No encontramos contenido que coincida con 'batman'. Intenta con otros términos."
      emptyAction={
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <Button variant="outline" size="sm">Limpiar búsqueda</Button>
          <Button variant="primary" size="sm">Ver populares</Button>
        </div>
      }
      variant="compact"
    />
    
    {/* Sección con error */}
    <ContentSection 
      title="🆕 Recién Agregadas" 
      icon="🆕"
      error="No se pudo cargar el contenido más reciente. Verifica tu conexión."
    />
    
    {/* Sección cargando */}
    <ContentSection 
      title="🔥 Trending Ahora" 
      icon="🔥"
      loading={true}
    />
  </div>
);

MainPageUseCases.parameters = {
  docs: {
    description: {
      story: 'Casos de uso específicos para MainPage: secciones con contenido, búsquedas, errores y carga.'
    }
  }
};

// ========== INTERACTIVIDAD ==========
export const Interactive = () => {
  const [currentState, setCurrentState] = React.useState('content');
  
  const stateConfig = {
    content: { loading: false, error: null, empty: false },
    loading: { loading: true, error: null, empty: false },
    empty: { loading: false, error: null, empty: true },
    error: { loading: false, error: 'Error de conexión con el servidor', empty: false }
  };
  
  return (
    <div style={{ padding: 'var(--space-md)' }}>
      <div style={{ 
        marginBottom: 'var(--space-lg)',
        display: 'flex',
        gap: 'var(--space-sm)',
        flexWrap: 'wrap'
      }}>
        {Object.keys(stateConfig).map(state => (
          <Button
            key={state}
            variant={currentState === state ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setCurrentState(state)}
          >
            {state.charAt(0).toUpperCase() + state.slice(1)}
          </Button>
        ))}
      </div>
      
      <ContentSection
        title="🎮 Sección Interactiva" 
        icon="🎮"
        {...stateConfig[currentState]}
        emptyTitle="No hay contenido en este estado"
        emptyDescription="Cambia el estado arriba para ver diferentes comportamientos."
        emptyAction={<Button variant="primary">Acción de ejemplo</Button>}
      >
        {currentState === 'content' && SAMPLE_MOVIES.map(movie => (
          <ContentCard key={movie.id} content={movie} />
        ))}
      </ContentSection>
    </div>
  );
};

Interactive.parameters = {
  docs: {
    description: {
      story: 'Demostración interactiva de todos los estados del ContentSection. Cambia entre estados para ver el comportamiento.'
    }
  }
};

// ========== INTEGRACIÓN CON OTROS COMPONENTES ==========
export const ComponentIntegration = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
    <div style={{ 
      padding: 'var(--space-md)', 
      backgroundColor: 'var(--color-primary-light)', 
      borderRadius: 'var(--radius-md)',
      marginBottom: 'var(--space-lg)'
    }}>
      <h3 style={{ margin: '0 0 var(--space-sm) 0', color: 'var(--text-primary)' }}>
        🧩 Integración con el Sistema de Componentes
      </h3>
      <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
        ContentSection usa automáticamente: Card (para errores), EmptyState (para vacío), 
        y acepta cualquier children (típicamente ContentCard).
      </p>
    </div>
    
    <ContentSection 
      title="🎭 Ejemplo de Integración Completa" 
      icon="🎭"
      variant="featured"
    >
      {SAMPLE_MOVIES.map(movie => (
        <ContentCard 
          key={movie.id} 
          content={movie}
          onClick={() => alert(`Clickeaste en ${movie.title}`)}
        />
      ))}
    </ContentSection>
    
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: 'var(--space-lg)'
    }}>
      <ContentSection 
        title="🚀 Con EmptyState" 
        icon="🚀"
        empty={true}
        emptyIcon="🎬"
        emptyTitle="Próximamente"
        emptyDescription="Esta sección tendrá contenido exclusivo muy pronto."
        emptyAction={<Button variant="primary" size="sm">Notificarme</Button>}
        size="sm"
        variant="compact"
      />
      
      <ContentSection 
        title="⚡ Con Loading" 
        icon="⚡"
        loading={true}
        size="sm"
        variant="compact"
      />
    </div>
  </div>
);

ComponentIntegration.parameters = {
  docs: {
    description: {
      story: 'Ejemplos de integración con otros componentes del sistema: ContentCard, EmptyState, Card.'
    }
  }
};