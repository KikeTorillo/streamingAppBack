// ===== STATS CARD STORIES =====
// src/components/molecules/StatsCard/StatsCard.stories.jsx

import React, { useState } from 'react';
import { StatsCard } from './StatsCard';
import './StatsCard.css';

export default {
  title: 'Components/Molecules/StatsCard',
  component: StatsCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# StatsCard Molecule

Tarjetas de estadísticas para dashboards. Usa Card como base + iconos + valores + cambios porcentuales.

## Uso básico
\`\`\`jsx
<StatsCard
  title="Total Usuarios"
  value={1247}
  icon="👥"
  change="+12%"
  color="blue"
/>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    title: { control: 'text' },
    value: { control: 'text' },
    icon: { control: 'text' },
    change: { control: 'text' },
    color: { 
      control: 'select',
      options: ['blue', 'green', 'red', 'yellow', 'purple', 'gray']
    },
    variant: {
      control: 'select',
      options: ['default', 'minimal', 'bordered', 'gradient']
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    },
    loading: { control: 'boolean' },
    onClick: { action: 'clicked' }
  }
};

// ========== TEMPLATE ==========
const Template = (args) => <StatsCard {...args} />;

// ========== PLAYGROUND ==========
export const Playground = Template.bind({});
Playground.args = {
  title: 'Total Usuarios',
  value: 1247,
  icon: '👥',
  change: '+12%',
  changeLabel: 'último mes',
  color: 'blue'
};

// ========== DASHBOARD EXAMPLE ==========
export const DashboardStats = () => (
  <div className="stats-card-grid">
    <StatsCard
      title="Total Usuarios"
      value={156}
      icon="👥"
      change="+12%"
      changeLabel="último mes"
      color="blue"
    />
    <StatsCard
      title="Películas"
      value={89}
      icon="🎬"
      change="+5%"
      changeLabel="esta semana"
      color="green"
    />
    <StatsCard
      title="Series"
      value={24}
      icon="📺"
      change="+8%"
      changeLabel="último mes"
      color="purple"
    />
    <StatsCard
      title="Categorías"
      value={12}
      icon="📂"
      change="+2%"
      changeLabel="este año"
      color="yellow"
    />
  </div>
);

// ========== COLORS ==========
export const Colors = () => (
  <div className="stats-card-grid">
    <StatsCard title="Blue" value={100} icon="💙" color="blue" change="+5%" />
    <StatsCard title="Green" value={200} icon="💚" color="green" change="+10%" />
    <StatsCard title="Red" value={50} icon="❤️" color="red" change="-3%" />
    <StatsCard title="Yellow" value={75} icon="💛" color="yellow" change="+2%" />
    <StatsCard title="Purple" value={125} icon="💜" color="purple" change="+7%" />
    <StatsCard title="Gray" value={80} icon="🤍" color="gray" change="0%" />
  </div>
);

// ========== VARIANTS ==========
export const Variants = () => (
  <div className="stats-card-grid">
    <StatsCard title="Default" value={100} icon="📊" variant="default" color="blue" />
    <StatsCard title="Minimal" value={200} icon="📈" variant="minimal" color="green" />
    <StatsCard title="Bordered" value={300} icon="📉" variant="bordered" color="red" />
    <StatsCard title="Gradient" value={400} icon="💹" variant="gradient" color="purple" />
  </div>
);

// ========== SIZES ==========
export const Sizes = () => (
  <div className="stats-card-grid">
    <StatsCard title="Small" value={100} icon="📊" size="sm" color="blue" />
    <StatsCard title="Medium" value={200} icon="📈" size="md" color="green" />
    <StatsCard title="Large" value={300} icon="📉" size="lg" color="red" />
  </div>
);

// ========== STATES ==========
export const LoadingState = () => (
  <div className="stats-card-grid">
    <StatsCard title="Cargando..." loading={true} color="blue" />
    <StatsCard title="Con datos" value={200} icon="📈" color="green" />
  </div>
);

export const ErrorState = () => (
  <StatsCard 
    title="Error State" 
    value={null}
    icon="❌" 
    error="Error al cargar datos"
    color="red" 
  />
);

// ========== INTERACTIVE ==========
export const Interactive = () => {
  const [clicked, setClicked] = useState(false);
  
  return (
    <StatsCard
      title="Clickeable"
      value={clicked ? 'Clicked!' : 'Click me'}
      icon="👆"
      color="purple"
      onClick={() => setClicked(!clicked)}
    />
  );
};