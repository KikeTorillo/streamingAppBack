// FilterBar.stories.jsx
import React, { useState } from 'react';
import { FilterBar } from './FilterBar';
import { Button } from '../../atoms/Button/Button';
import './FilterBar.css';

export default {
  title: 'Components/Molecules/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# FilterBar Molecule

Barra de filtros con categorías y acciones. Usa Button del sistema de diseño.

## Uso básico
\`\`\`jsx
<FilterBar
  categories={[
    { value: 'all', label: 'Todos', icon: '🎬' },
    { value: 'action', label: 'Acción', icon: '💥' }
  ]}
  selectedCategory="all"
  onCategoryChange={(cat) => setCategory(cat)}
  actions={<Button>Subir Video</Button>}
/>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    categories: { control: 'object' },
    selectedCategory: { control: 'text' },
    variant: { control: 'select', options: ['default', 'transparent', 'elevated'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] }
  }
};

// Datos de ejemplo
const CATEGORIES = [
  { value: 'all', label: 'Todos', icon: '🎬' },
  { value: 'action', label: 'Acción', icon: '💥' },
  { value: 'comedy', label: 'Comedia', icon: '😂' },
  { value: 'drama', label: 'Drama', icon: '🎭' },
  { value: 'horror', label: 'Terror', icon: '👻' },
  { value: 'sci-fi', label: 'Ciencia Ficción', icon: '🚀' }
];

// ========== DEFAULT ==========
export const Default = {
  args: {
    categories: CATEGORIES,
    selectedCategory: 'all',
    size: 'md',
    variant: 'default'
  }
};

// ========== CON ACCIONES ==========
export const WithActions = {
  args: {
    ...Default.args,
    actions: (
      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        <Button variant="outline" size="sm">Ordenar</Button>
        <Button variant="primary" size="sm">Subir Video</Button>
      </div>
    )
  }
};

// ========== TAMAÑOS ==========
export const Sizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
    <FilterBar categories={CATEGORIES.slice(0, 4)} size="sm" />
    <FilterBar categories={CATEGORIES.slice(0, 4)} size="md" />
    <FilterBar categories={CATEGORIES.slice(0, 4)} size="lg" />
  </div>
);

// ========== VARIANTES ==========
export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
    <FilterBar categories={CATEGORIES.slice(0, 4)} variant="default" />
    <FilterBar categories={CATEGORIES.slice(0, 4)} variant="elevated" />
    <FilterBar categories={CATEGORIES.slice(0, 4)} variant="transparent" />
  </div>
);

// ========== INTERACTIVO ==========
export const Interactive = () => {
  const [selected, setSelected] = useState('all');
  
  return (
    <div>
      <FilterBar
        categories={CATEGORIES}
        selectedCategory={selected}
        onCategoryChange={setSelected}
        actions={<Button variant="primary">Subir Video</Button>}
      />
      <div style={{ padding: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
        <p>Categoría seleccionada: <strong>{selected}</strong></p>
      </div>
    </div>
  );
};

// ========== PARA MAINPAGE ==========
export const MainPageExample = () => {
  const [category, setCategory] = useState('all');
  
  return (
    <FilterBar
      categories={[
        { value: 'all', label: 'Todo', icon: '🎬' },
        { value: 'movies', label: 'Películas', icon: '🎞️' },
        { value: 'series', label: 'Series', icon: '📺' },
        { value: 'documentaries', label: 'Documentales', icon: '📋' }
      ]}
      selectedCategory={category}
      onCategoryChange={setCategory}
      actions={
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <Button variant="outline" size="sm">Filtros</Button>
          <Button variant="primary" size="sm">Subir</Button>
        </div>
      }
      variant="elevated"
    />
  );
};