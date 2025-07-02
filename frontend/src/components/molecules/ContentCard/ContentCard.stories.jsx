// molecules/ContentCard/ContentCard.stories.jsx
import React, { useState } from 'react';
import { ContentCard } from './ContentCard';
import './ContentCard.css';

export default {
  title: 'Components/Molecules/ContentCard',
  component: ContentCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# ContentCard Component

Molécula especializada para mostrar carátulas de películas y series siguiendo **Atomic Design**. 
Combina Card, Badge, Button y elementos personalizados para crear una experiencia tipo Netflix.

## 🎯 Características principales

- **Basado en componentes del sistema**: Usa Card, Badge y Button existentes
- **Aspect ratio 2:3**: Proporción perfecta para carátulas de contenido
- **Overlay interactivo**: Controles que aparecen en hover
- **Estados completos**: Normal, Hover, Loading, Disabled
- **Responsive design**: Se adapta a desktop, tablet y móviles
- **Accesibilidad completa**: ARIA, navegación por teclado, reduced motion
- **Theming automático**: Variables CSS del sistema, modo oscuro
- **Lazy loading**: Optimizado para performance

## 🏗️ Arquitectura Atomic Design

\`\`\`
ContentCard (Molécula) 🧬
├── Card (Átomo base) ⚛️
├── Image Container
│   ├── ContentImage (Átomo) ⚛️ ← Maneja aspect ratio, fallbacks, loading
│   ├── Overlay
│   │   ├── Button (Átomo) ⚛️ - Play
│   │   └── Button (Átomo) ⚛️ - Favorite
│   └── Badge (Átomo) ⚛️ - Type indicator
└── CardBody
    ├── CardTitle (elemento Card)
    ├── CardSubtitle (elemento Card)
    └── Details
        ├── Meta info
        └── Badge (Átomo) ⚛️ - Rating
\`\`\`

## 🔧 Uso básico

\`\`\`jsx
import { ContentCard } from './molecules/ContentCard';

const movieData = {
  id: 1,
  title: "Avatar: El Camino del Agua",
  category: "Acción",
  year: 2022,
  type: "movie",
  cover: "https://ejemplo.com/avatar.jpg",
  rating: 8.5,
  duration: "192 min"
};

// Card básica
<ContentCard 
  content={movieData}
  onClick={handleClick}
  onPlay={handlePlay}
/>

// Card con todas las opciones
<ContentCard
  content={movieData}
  size="lg"
  onClick={handleCardClick}
  onPlay={handlePlay}
  onFavorite={handleFavorite}
  showRating={true}
  showMeta={true}
  showCategory={true}
  variant="elevated"
  rounded="xl"
/>
\`\`\`

## 📋 Props del contenido

El objeto \`content\` debe incluir:
- \`id\`: Identificador único
- \`title\`: Título de la película/serie
- \`cover\`: URL de la imagen de carátula
- \`category\`: Categoría/género
- \`year\`: Año de lanzamiento
- \`rating\`: Puntuación (número)
- \`type\`: 'movie' | 'series'
- \`duration\`: Duración (para películas)
- \`seasons\`: Número de temporadas (para series)
- \`episodes\`: Número de episodios (para series)

## ♿ Accesibilidad

- **ARIA completo**: Labels descriptivos, roles apropiados
- **Navegación por teclado**: Focuseable con Tab, activable con Enter/Space
- **Screen readers**: Información contextual completa
- **Reduced motion**: Respeta preferencias de animación
- **High contrast**: Compatible con modo de alto contraste
- **Touch targets**: Botones con área táctil de 44px mínimo
        `
      }
    }
  },
  argTypes: {
    content: {
      name: 'Contenido',
      description: 'Objeto con los datos de la película/serie',
      control: 'object',
      table: {
        type: { summary: 'Object' },
        defaultValue: { summary: '{}' }
      }
    },
    size: {
      name: 'Tamaño',
      description: 'Tamaño de la card',
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'md'" }
      }
    },
    variant: {
      name: 'Variante',
      description: 'Variante visual de la Card base',
      control: 'select',
      options: ['default', 'elevated', 'outlined'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'elevated'" }
      }
    },
    showRating: {
      name: 'Mostrar Rating',
      description: 'Si se muestra la puntuación',
      control: 'boolean'
    },
    showMeta: {
      name: 'Mostrar Metadatos',
      description: 'Si se muestra duración/temporadas',
      control: 'boolean'
    },
    showCategory: {
      name: 'Mostrar Categoría',
      description: 'Si se muestra la categoría en el subtítulo',
      control: 'boolean'
    },
    loading: {
      name: 'Cargando',
      description: 'Estado de carga con skeleton',
      control: 'boolean'
    },
    disabled: {
      name: 'Deshabilitado',
      description: 'Estado deshabilitado',
      control: 'boolean'
    }
  }
};

// ========== DATOS DE EJEMPLO ==========

const SAMPLE_MOVIE = {
  id: 1,
  title: "Avatar: El Camino del Agua",
  category: "Acción",
  year: 2022,
  type: "movie",
  cover: "https://images.unsplash.com/photo-1489599485995-d918135f0b1f?w=300&h=450&fit=crop",
  rating: 8.5,
  duration: "192 min"
};

const SAMPLE_SERIES = {
  id: 2,
  title: "Stranger Things",
  category: "Drama",
  year: 2023,
  type: "series",
  cover: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=300&h=450&fit=crop",
  rating: 9.0,
  seasons: 4,
  episodes: 42
};

const SAMPLE_MOVIE_LONG_TITLE = {
  id: 3,
  title: "Spider-Man: No Way Home - El Regreso de los Villanos Multiversales",
  category: "Superhéroes",
  year: 2021,
  type: "movie",
  cover: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop",
  rating: 9.2,
  duration: "148 min"
};

// ========== EJEMPLOS BÁSICOS ==========

export const Default = {
  args: {
    content: SAMPLE_MOVIE,
    size: 'md',
    showRating: true,
    showMeta: true,
    showCategory: true,
    loading: false,
    disabled: false,
    variant: 'elevated'
  },
  parameters: {
    docs: {
      description: {
        story: 'ContentCard básico con una película. Hover para ver los controles de reproducción.'
      }
    }
  }
};

export const SeriesCard = {
  args: {
    content: SAMPLE_SERIES,
    size: 'md'
  },
  parameters: {
    docs: {
      description: {
        story: 'ContentCard mostrando una serie con temporadas y episodios en lugar de duración.'
      }
    }
  }
};

export const WithInteractions = () => {
  const [lastAction, setLastAction] = useState('');

  const handleCardClick = (content) => {
    setLastAction(`Card clicked: ${content.title}`);
  };

  const handlePlay = (content) => {
    setLastAction(`Play clicked: ${content.title}`);
  };

  const handleFavorite = (content) => {
    setLastAction(`Favorite clicked: ${content.title}`);
  };

  return (
    <div style={{ maxWidth: '300px' }}>
      <ContentCard
        content={SAMPLE_MOVIE}
        onClick={handleCardClick}
        onPlay={handlePlay}
        onFavorite={handleFavorite}
        size="lg"
      />
      
      {lastAction && (
        <div style={{ 
          marginTop: 'var(--space-md)', 
          padding: 'var(--space-sm)', 
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--text-muted)'
        }}>
          <strong>Última acción:</strong> {lastAction}
        </div>
      )}
    </div>
  );
};

WithInteractions.parameters = {
  docs: {
    description: {
      story: 'Ejemplo interactivo mostrando todos los callbacks disponibles. Haz click en la card, el botón play o el corazón.'
    }
  }
};

// ========== TAMAÑOS ==========

export const Sizes = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-xl)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    alignItems: 'start'
  }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Small</h4>
      <ContentCard content={SAMPLE_MOVIE} size="sm" />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Medium</h4>
      <ContentCard content={SAMPLE_MOVIE} size="md" />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Large</h4>
      <ContentCard content={SAMPLE_MOVIE} size="lg" />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Extra Large</h4>
      <ContentCard content={SAMPLE_MOVIE} size="xl" />
    </div>
  </div>
);

Sizes.parameters = {
  docs: {
    description: {
      story: 'Diferentes tamaños disponibles para ContentCard. El tamaño afecta las dimensiones máximas y el padding interno.'
    }
  }
};

// ========== VARIANTES VISUALES ==========

export const Variants = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-xl)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    alignItems: 'start'
  }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Default</h4>
      <ContentCard content={SAMPLE_MOVIE} variant="default" />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Elevated</h4>
      <ContentCard content={SAMPLE_MOVIE} variant="elevated" />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Outlined</h4>
      <ContentCard content={SAMPLE_MOVIE} variant="outlined" />
    </div>
  </div>
);

Variants.parameters = {
  docs: {
    description: {
      story: 'Variantes visuales heredadas del componente Card base. Elevated es la más común para carátulas.'
    }
  }
};

// ========== ESTADOS ==========

export const States = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-xl)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    alignItems: 'start'
  }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Normal</h4>
      <ContentCard content={SAMPLE_MOVIE} />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Loading</h4>
      <ContentCard content={SAMPLE_MOVIE} loading={true} />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Disabled</h4>
      <ContentCard content={SAMPLE_MOVIE} disabled={true} />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Sin Rating</h4>
      <ContentCard content={SAMPLE_MOVIE} showRating={false} />
    </div>
  </div>
);

States.parameters = {
  docs: {
    description: {
      story: 'Diferentes estados del ContentCard. Loading muestra un skeleton, disabled reduce la opacidad y quita interactividad.'
    }
  }
};

// ========== TIPOS DE CONTENIDO ==========

export const ContentTypes = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-xl)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    alignItems: 'start'
  }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Película</h4>
      <ContentCard content={SAMPLE_MOVIE} />
      <p style={{ 
        fontSize: 'var(--font-size-xs)', 
        color: 'var(--text-muted)', 
        textAlign: 'center',
        marginTop: 'var(--space-sm)'
      }}>
        Muestra duración y badge azul 🎬
      </p>
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Serie</h4>
      <ContentCard content={SAMPLE_SERIES} />
      <p style={{ 
        fontSize: 'var(--font-size-xs)', 
        color: 'var(--text-muted)', 
        textAlign: 'center',
        marginTop: 'var(--space-sm)'
      }}>
        Muestra temporadas/episodios y badge gris 📺
      </p>
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Título Largo</h4>
      <ContentCard content={SAMPLE_MOVIE_LONG_TITLE} />
      <p style={{ 
        fontSize: 'var(--font-size-xs)', 
        color: 'var(--text-muted)', 
        textAlign: 'center',
        marginTop: 'var(--space-sm)'
      }}>
        Trunca texto automáticamente en 2 líneas
      </p>
    </div>
  </div>
);

ContentTypes.parameters = {
  docs: {
    description: {
      story: 'ContentCard se adapta automáticamente al tipo de contenido mostrando metadatos apropiados y badges distintivos.'
    }
  }
};

// ========== OPCIONES DE VISUALIZACIÓN ==========

export const DisplayOptions = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-xl)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    alignItems: 'start'
  }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Completo</h4>
      <ContentCard 
        content={SAMPLE_MOVIE} 
        showRating={true}
        showMeta={true}
        showCategory={true}
      />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Sin Rating</h4>
      <ContentCard 
        content={SAMPLE_MOVIE} 
        showRating={false}
        showMeta={true}
        showCategory={true}
      />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Sin Meta</h4>
      <ContentCard 
        content={SAMPLE_MOVIE} 
        showRating={true}
        showMeta={false}
        showCategory={true}
      />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Mínimo</h4>
      <ContentCard 
        content={SAMPLE_MOVIE} 
        showRating={false}
        showMeta={false}
        showCategory={false}
      />
    </div>
  </div>
);

DisplayOptions.parameters = {
  docs: {
    description: {
      story: 'Opciones para mostrar u ocultar diferentes elementos de información según las necesidades del contexto.'
    }
  }
};

// ========== GRID DEMO ==========

export const GridDemo = () => {
  const sampleContent = [
    SAMPLE_MOVIE,
    SAMPLE_SERIES,
    SAMPLE_MOVIE_LONG_TITLE,
    {
      id: 4,
      title: "The Batman",
      category: "Superhéroes",
      year: 2022,
      type: "movie",
      cover: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop",
      rating: 8.9,
      duration: "176 min"
    },
    {
      id: 5,
      title: "House of Dragons",
      category: "Fantasía",
      year: 2022,
      type: "series",
      cover: "https://images.unsplash.com/photo-1635863138275-d9864d29a8d5?w=300&h=450&fit=crop",
      rating: 8.9,
      seasons: 2,
      episodes: 20
    },
    {
      id: 6,
      title: "Dune",
      category: "Ciencia Ficción",
      year: 2021,
      type: "movie",
      cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=450&fit=crop",
      rating: 8.7,
      duration: "155 min"
    }
  ];

  const [lastClicked, setLastClicked] = useState('');

  return (
    <div>
      <div style={{
        display: 'grid',
        gap: 'var(--space-lg)',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        marginBottom: 'var(--space-lg)'
      }}>
        {sampleContent.map(content => (
          <ContentCard
            key={content.id}
            content={content}
            onClick={(content) => setLastClicked(`Card: ${content.title}`)}
            onPlay={(content) => setLastClicked(`Play: ${content.title}`)}
            onFavorite={(content) => setLastClicked(`Favorite: ${content.title}`)}
            size="md"
          />
        ))}
      </div>
      
      {lastClicked && (
        <div style={{
          padding: 'var(--space-md)',
          backgroundColor: 'var(--color-primary-light)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-primary)',
          textAlign: 'center',
          fontWeight: 'var(--font-weight-medium)'
        }}>
          Última acción: {lastClicked}
        </div>
      )}
    </div>
  );
};

GridDemo.parameters = {
  docs: {
    description: {
      story: 'Demostración de ContentCards en un grid responsive, simulando cómo se verían en la aplicación real.'
    }
  }
};

// ========== ERROR HANDLING ==========

export const ErrorHandling = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-xl)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    alignItems: 'start'
  }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Imagen Rota</h4>
      <ContentCard 
        content={{
          ...SAMPLE_MOVIE,
          cover: "https://imagen-que-no-existe.jpg"
        }}
      />
      <p style={{ 
        fontSize: 'var(--font-size-xs)', 
        color: 'var(--text-muted)', 
        textAlign: 'center',
        marginTop: 'var(--space-sm)'
      }}>
        Fallback automático a placeholder SVG
      </p>
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Sin Datos</h4>
      <ContentCard content={null} />
      <p style={{ 
        fontSize: 'var(--font-size-xs)', 
        color: 'var(--text-muted)', 
        textAlign: 'center',
        marginTop: 'var(--space-sm)'
      }}>
        Manejo graceful de contenido null
      </p>
    </div>
  </div>
);

ErrorHandling.parameters = {
  docs: {
    description: {
      story: 'Manejo de errores y casos edge: imágenes rotas, contenido faltante, etc.'
    }
  }
};