// AppHeader.stories.jsx
import React, { useState } from 'react';
import { AppHeader } from './AppHeader';
import './AppHeader.css';

export default {
  title: 'Components/Organism/AppHeader',
  component: AppHeader,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# AppHeader Organism

Header principal de la aplicación. Usa TextInput y Button del sistema de diseño.

## Uso básico
\`\`\`jsx
<AppHeader
  appTitle="StreamFlix"
  userName="Juan Pérez"
  searchValue={search}
  onSearchChange={(e) => setSearch(e.target.value)}
  onLogout={() => logout()}
/>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    appTitle: { control: 'text' },
    userName: { control: 'text' },
    searchPlaceholder: { control: 'text' },
    showSearch: { control: 'boolean' },
    variant: { control: 'select', options: ['default', 'simple', 'transparent', 'dark'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] }
  }
};

// ========== DEFAULT ==========
export const Default = {
  args: {
    appTitle: 'StreamFlix',
    userName: 'Juan Pérez',
    searchPlaceholder: 'Buscar películas, series...',
    showSearch: true,
    variant: 'default',
    size: 'md'
  }
};

// ========== SIN USUARIO ==========
export const WithoutUser = {
  args: {
    ...Default.args,
    userName: null
  }
};

// ========== SIN BÚSQUEDA ==========
export const WithoutSearch = {
  args: {
    ...Default.args,
    showSearch: false
  }
};

// ========== TAMAÑOS ==========
export const Sizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
    <AppHeader appTitle="StreamFlix" userName="Usuario" size="sm" />
    <AppHeader appTitle="StreamFlix" userName="Usuario" size="md" />
    <AppHeader appTitle="StreamFlix" userName="Usuario" size="lg" />
  </div>
);

// ========== VARIANTES ==========
export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
    <AppHeader appTitle="StreamFlix" userName="Usuario" variant="default" />
    <AppHeader appTitle="StreamFlix" userName="Usuario" variant="simple" />
    <AppHeader appTitle="StreamFlix" userName="Usuario" variant="transparent" />
    <AppHeader appTitle="StreamFlix" userName="Usuario" variant="dark" />
  </div>
);

// ========== INTERACTIVO ==========
export const Interactive = () => {
  const [search, setSearch] = useState('');
  
  return (
    <div>
      <AppHeader
        appTitle="StreamFlix"
        userName="María González"
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        onLogout={() => alert('Cerrando sesión...')}
      />
      <div style={{ padding: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
        <p>Búsqueda actual: <strong>{search || 'vacía'}</strong></p>
      </div>
    </div>
  );
};

// ========== PARA MAINPAGE ==========
export const MainPageExample = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <AppHeader
      appTitle="StreamFlix"
      userName="Alex Rivera"
      searchValue={searchTerm}
      onSearchChange={(e) => setSearchTerm(e.target.value)}
      onLogout={() => alert('Redirigiendo a login...')}
      searchPlaceholder="Buscar películas, series, documentales..."
      variant="default"
      size="lg"
    />
  );
};