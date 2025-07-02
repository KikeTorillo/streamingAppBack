// PageLayout.stories.jsx
import React from 'react';
import { PageLayout } from './PageLayout';
import { AppHeader } from '../../organism/AppHeader/AppHeader';
import { FilterBar } from '../../molecules/FilterBar/FilterBar';
import { ContentSection } from '../../molecules/ContentSection/ContentSection';
import { ContentCard } from '../../molecules/ContentCard/ContentCard';
import './PageLayout.css';

export default {
  title: 'Components/Templates/PageLayout',
  component: PageLayout,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# PageLayout Template

Layout principal que estructura las páginas de la app: Header + Filters + Content.

## Uso básico
\`\`\`jsx
<PageLayout
  header={<AppHeader />}
  filters={<FilterBar />}
>
  <ContentSection title="Películas">
    {movies.map(movie => <ContentCard key={movie.id} content={movie} />)}
  </ContentSection>
</PageLayout>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    containerMaxWidth: { control: 'text' },
    contentPadding: { control: 'text' },
    variant: { control: 'select', options: ['default', 'centered', 'wide', 'compact'] }
  }
};

// Datos de ejemplo
const SAMPLE_MOVIES = [
  {
    id: 1,
    title: "Spider-Man",
    category: "Acción",
    year: 2021,
    type: "movie",
    cover: "https://images.unsplash.com/photo-1635863138275-d9864d29a8d5?w=300&h=450&fit=crop",
    rating: 8.4
  },
  {
    id: 2,
    title: "Dune",
    category: "Sci-Fi",
    year: 2021,
    type: "movie",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=450&fit=crop",
    rating: 8.0
  }
];

const CATEGORIES = [
  { value: 'all', label: 'Todo', icon: '🎬' },
  { value: 'movies', label: 'Películas', icon: '🎞️' },
  { value: 'series', label: 'Series', icon: '📺' }
];

// ========== DEFAULT ==========
export const Default = {
  args: {
    variant: 'default',
    containerMaxWidth: '144rem',
    contentPadding: 'var(--space-xl)'
  },
  render: (args) => (
    <PageLayout {...args}>
      <ContentSection title="Contenido de Ejemplo" icon="📄">
        <div style={{ 
          padding: 'var(--space-lg)', 
          background: 'var(--bg-secondary)', 
          borderRadius: 'var(--radius-md)' 
        }}>
          <p>Este es el contenido principal de la página.</p>
        </div>
      </ContentSection>
    </PageLayout>
  )
};

// ========== CON HEADER ==========
export const WithHeader = {
  render: () => (
    <PageLayout
      header={
        <AppHeader
          appTitle="StreamFlix"
          userName="Usuario"
          searchPlaceholder="Buscar contenido..."
        />
      }
    >
      <ContentSection title="Películas Populares" icon="🎬">
        {SAMPLE_MOVIES.map(movie => (
          <ContentCard key={movie.id} content={movie} />
        ))}
      </ContentSection>
    </PageLayout>
  )
};

// ========== CON FILTROS ==========
export const WithFilters = {
  render: () => (
    <PageLayout
      filters={
        <FilterBar
          categories={CATEGORIES}
          selectedCategory="all"
        />
      }
    >
      <ContentSection title="Contenido Filtrado" icon="🔍">
        {SAMPLE_MOVIES.map(movie => (
          <ContentCard key={movie.id} content={movie} />
        ))}
      </ContentSection>
    </PageLayout>
  )
};

// ========== LAYOUT COMPLETO ==========
export const CompleteLayout = {
  render: () => (
    <PageLayout
      header={
        <AppHeader
          appTitle="StreamFlix"
          userName="María García"
          searchPlaceholder="Buscar películas, series..."
        />
      }
      filters={
        <FilterBar
          categories={CATEGORIES}
          selectedCategory="movies"
        />
      }
    >
      <ContentSection title="🎬 Películas Populares" icon="🎬">
        {SAMPLE_MOVIES.map(movie => (
          <ContentCard key={movie.id} content={movie} />
        ))}
      </ContentSection>
      
      <ContentSection title="📺 Series en Tendencia" icon="📺">
        {SAMPLE_MOVIES.slice(0, 1).map(movie => (
          <ContentCard key={movie.id} content={{...movie, type: 'series'}} />
        ))}
      </ContentSection>
    </PageLayout>
  )
};

// ========== VARIANTES ==========
export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
    <div>
      <h3>Default (1440px max)</h3>
      <PageLayout variant="default">
        <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
          Contenido con ancho máximo de 1440px
        </div>
      </PageLayout>
    </div>
    
    <div>
      <h3>Centered (800px max)</h3>
      <PageLayout variant="centered">
        <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
          Contenido centrado y más estrecho
        </div>
      </PageLayout>
    </div>
    
    <div>
      <h3>Wide (sin límite)</h3>
      <PageLayout variant="wide">
        <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
          Contenido que ocupa todo el ancho disponible
        </div>
      </PageLayout>
    </div>
    
    <div>
      <h3>Compact (menos padding)</h3>
      <PageLayout variant="compact">
        <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
          Contenido con espaciado reducido
        </div>
      </PageLayout>
    </div>
  </div>
);

// ========== MAINPAGE SIMULADO ==========
export const MainPageSimulation = {
  render: () => (
    <PageLayout
      header={
        <AppHeader
          appTitle="StreamFlix"
          userName="Alex Rivera"
          searchPlaceholder="Buscar películas, series, documentales..."
          variant="default"
          size="lg"
        />
      }
      filters={
        <FilterBar
          categories={[
            { value: 'all', label: 'Todo', icon: '🎬' },
            { value: 'movies', label: 'Películas', icon: '🎞️' },
            { value: 'series', label: 'Series', icon: '📺' },
            { value: 'documentaries', label: 'Documentales', icon: '📋' }
          ]}
          selectedCategory="all"
        />
      }
      variant="default"
    >
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
      
      <ContentSection title="📺 Series en Tendencia" icon="📺">
        {SAMPLE_MOVIES.slice(0, 1).map(movie => (
          <ContentCard key={movie.id} content={{...movie, type: 'series', title: 'Breaking Bad'}} />
        ))}
      </ContentSection>
      
      <ContentSection 
        title="🆕 Recién Agregadas" 
        icon="🆕"
        loading={true}
      />
    </PageLayout>
  )
};