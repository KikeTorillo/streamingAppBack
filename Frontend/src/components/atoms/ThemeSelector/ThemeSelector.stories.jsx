import React from 'react';
import { ThemeSelector } from './ThemeSelector';

export default {
  title: 'Components/Atoms/ThemeSelector',
  component: ThemeSelector,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# ThemeSelector Atom

El átomo **ThemeSelector** permite cambiar entre las paletas y modos disponibles del sistema.

## 🎯 Características principales
- **5 tamaños**: xs, sm, md, lg, xl
- **3 variantes**: default, compact, floating
- **Accesibilidad**: etiquetas ARIA y navegación por teclado
- **Theming**: Usa variables CSS y contexto de la app
        `
      }
    }
  },
  argTypes: {
    size: {
      name: 'Tamaño',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl']
    },
    variant: {
      name: 'Variante',
      control: 'select',
      options: ['default', 'compact', 'floating']
    },
    showLabels: {
      name: 'Mostrar etiquetas',
      control: 'boolean'
    }
  }
};

export const Default = {
  args: { size: 'md', variant: 'default', showLabels: true }
};
Default.parameters = { docs: { description: { story: 'Configuración por defecto.' } } };

export const Sizes = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    padding: 'var(--space-md)'
  }}>
    <ThemeSelector size="xs" />
    <ThemeSelector size="sm" />
    <ThemeSelector size="md" />
    <ThemeSelector size="lg" />
    <ThemeSelector size="xl" />
  </div>
);
Sizes.parameters = { docs: { description: { story: 'Los 5 tamaños estándar.' } } };

export const Variants = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    padding: 'var(--space-md)'
  }}>
    <ThemeSelector variant="default" />
    <ThemeSelector variant="compact" />
    <ThemeSelector variant="floating" />
  </div>
);
Variants.parameters = { docs: { description: { story: 'Las 3 variantes disponibles.' } } };

export const States = {
  render: (args) => <ThemeSelector {...args} />,
  args: { size: 'md' }
};
States.parameters = { docs: { description: { story: 'Componente interactivo en su estado normal.' } } };

export const Interactive = {
  render: () => <ThemeSelector variant="floating" />
};
Interactive.parameters = { docs: { description: { story: 'Ejemplo flotante interactivo.' } } };

export const Accessibility = {
  render: (args) => (
    <div style={{ padding: 'var(--space-md)' }}>
      <ThemeSelector {...args} showLabels />
    </div>
  ),
  args: { size: 'md', variant: 'default' }
};
Accessibility.parameters = { docs: { description: { story: 'Accesible via teclado y ARIA.' } } };

