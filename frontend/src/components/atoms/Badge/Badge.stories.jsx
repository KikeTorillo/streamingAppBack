import React, { useState } from 'react';
import { Badge } from './Badge';
import './Badge.css';

export default {
  title: 'Components/Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Badge Atom

El átomo **Badge** es un componente fundamental para mostrar etiquetas, estados, contadores y categorías. 
Perfecto para notificaciones, tags, estados de proceso y clasificación de contenido.

## 🎯 Características principales

- **7 variantes de color**: Primary, Secondary, Success, Warning, Danger, Info, Neutral
- **4 estilos visuales**: Solid, Soft, Outline, Dot
- **5 tamaños**: XS, SM, MD, LG, XL (responsive con área táctil)
- **Border radius personalizable**: SM, MD, LG, XL, Full
- **Estados completos**: Normal, Hover, Loading, Disabled, Clickeable
- **Iconos flexibles**: Emojis, clases CSS, componentes React
- **Funcionalidades avanzadas**: Removible, Pulse, Contador inteligente
- **Accesibilidad completa**: ARIA, navegación por teclado, tooltips
- **Theming automático**: Variables CSS del sistema, modo oscuro
- **Mobile-first**: Área táctil de 44px para badges clickeables

## 🔧 Uso básico

\`\`\`jsx
import { Badge } from './atoms/Badge';

// Badge simple
<Badge variant="primary">Nuevo</Badge>

// Badge con contador
<Badge variant="danger" pulse>{notificationCount}</Badge>

// Badge con icono
<Badge 
  variant="success" 
  icon="✅" 
  style="soft"
>
  Completado
</Badge>

// Badge removible
<Badge 
  variant="info"
  onRemove={handleRemove}
  size="lg"
>
  React
</Badge>

// Badge clickeable
<Badge 
  variant="warning"
  onClick={handleClick}
  loading={isLoading}
>
  Pendiente
</Badge>
\`\`\`

## ♿ Accesibilidad

- **ARIA completo**: \`role="status"\` para indicadores, \`role="button"\` para clickeables
- **Navegación por teclado**: Tab, Enter, Space para badges clickeables
- **Screen readers**: Descripciones contextuales automáticas
- **Área táctil**: Mínimo 44px en móviles para badges clickeables
- **Tooltips**: Información adicional cuando es necesario
- **Estados anunciados**: Loading, disabled, changes

## 🎭 Variables CSS heredadas

Usa automáticamente las variables del sistema:
\`\`\`css
:root {
  --color-primary: #3b82f6;
  --color-success: #22c55e;
  --color-danger: #ef4444;
  --color-warning: #f59e0b;
  --color-primary-light: #dbeafe;
  --font-weight-semibold: 600;
  --space-xs: 0.4rem;
  --space-sm: 0.8rem;
  --transition-normal: 0.2s ease-in-out;
  --radius-full: 9999px;
  /* Y todas las demás del sistema... */
}
\`\`\`
        `
      }
    }
  },
  argTypes: {
    children: {
      name: 'Contenido',
      description: 'Contenido del badge (texto o elementos React)',
      control: 'text',
      table: {
        type: { summary: 'string | ReactNode' }
      }
    },
    variant: {
      name: 'Variante',
      description: 'Color/tema del badge',
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'primary'" }
      }
    },
    size: {
      name: 'Tamaño',
      description: 'Tamaño del badge (responsive en móviles)',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'md'" }
      }
    },
    style: {
      name: 'Estilo visual',
      description: 'Estilo de presentación del badge',
      control: 'select',
      options: ['solid', 'soft', 'outline', 'dot'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'solid'" }
      }
    },
    rounded: {
      name: 'Border radius',
      description: 'Curvatura de las esquinas del badge',
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'full'" }
      }
    },
    icon: {
      name: 'Icono',
      description: 'Icono a mostrar (emoji, clase CSS, componente React)',
      control: 'text',
      table: {
        type: { summary: 'string | ReactNode' }
      }
    },
    pulse: {
      name: 'Pulse animation',
      description: 'Animación de pulso para llamar la atención',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    loading: {
      name: 'Cargando',
      description: 'Muestra spinner de carga',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    onClick: {
      name: 'Función onClick',
      description: 'Función a ejecutar al hacer clic (hace el badge clickeable)',
      action: 'clicked',
      table: {
        type: { summary: 'function' }
      }
    },
    onRemove: {
      name: 'Función onRemove',
      description: 'Función para remover el badge (muestra botón X)',
      action: 'removed',
      table: {
        type: { summary: 'function' }
      }
    }
  }
};

// Template base
const Template = (args) => <Badge {...args} />;

// ========== HISTORIAS PRINCIPALES ==========

export const Playground = Template.bind({});
Playground.args = {
  children: 'Badge',
  variant: 'primary',
  size: 'md',
  style: 'solid',
  rounded: 'full'
};

export const ColorVariants = () => (
  <div style={{
    display: 'flex',
    gap: 'var(--space-md)',
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
    <Badge variant="primary">Primary</Badge>
    <Badge variant="secondary">Secondary</Badge>
    <Badge variant="success">Success</Badge>
    <Badge variant="warning">Warning</Badge>
    <Badge variant="danger">Danger</Badge>
    <Badge variant="info">Info</Badge>
    <Badge variant="neutral">Neutral</Badge>
  </div>
);

export const VisualStyles = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
  }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Solid
      </h4>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
        <Badge variant="primary" style="solid">Primary</Badge>
        <Badge variant="success" style="solid">Success</Badge>
        <Badge variant="danger" style="solid">Danger</Badge>
      </div>
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Soft
      </h4>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
        <Badge variant="primary" style="soft">Primary</Badge>
        <Badge variant="success" style="soft">Success</Badge>
        <Badge variant="danger" style="soft">Danger</Badge>
      </div>
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Outline
      </h4>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
        <Badge variant="primary" style="outline">Primary</Badge>
        <Badge variant="success" style="outline">Success</Badge>
        <Badge variant="danger" style="outline">Danger</Badge>
      </div>
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Dot
      </h4>
      <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
        <Badge variant="primary" style="dot">Online</Badge>
        <Badge variant="warning" style="dot">Away</Badge>
        <Badge variant="danger" style="dot" />
      </div>
    </div>
  </div>
);

export const AllSizes = () => (
  <div style={{
    display: 'flex',
    gap: 'var(--space-lg)',
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
    <Badge size="xs" variant="primary">XS</Badge>
    <Badge size="sm" variant="primary">SM</Badge>
    <Badge size="md" variant="primary">MD</Badge>
    <Badge size="lg" variant="primary">LG</Badge>
    <Badge size="xl" variant="primary">XL</Badge>
  </div>
);

export const WithIcons = () => (
  <div style={{
    display: 'flex',
    gap: 'var(--space-md)',
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
    <Badge variant="success" icon="✅">Completado</Badge>
    <Badge variant="warning" icon="⏳">En progreso</Badge>
    <Badge variant="danger" icon="❌">Error</Badge>
    <Badge variant="info" icon="ℹ️">Información</Badge>
    <Badge variant="primary" icon="🚀">Lanzar</Badge>
  </div>
);

export const NotificationsAndCounters = () => {
  const [count, setCount] = useState(5);
  
  return (
    <div style={{
      display: 'grid',
      gap: 'var(--space-xl)',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
    }}>
      <div>
        <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
          Contadores
        </h4>
        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
          <Badge variant="danger" size="sm">3</Badge>
          <Badge variant="danger" size="md">12</Badge>
          <Badge variant="danger" size="lg">99+</Badge>
        </div>
      </div>
      
      <div>
        <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
          Con Pulse
        </h4>
        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
          <Badge variant="danger" pulse>Nuevo</Badge>
          <Badge variant="warning" pulse size="sm">!</Badge>
          <Badge variant="info" pulse icon="🔔">5</Badge>
        </div>
      </div>
      
      <div>
        <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
          Interactivo
        </h4>
        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
          <button onClick={() => setCount(Math.max(0, count - 1))}>-</button>
          <Badge variant="primary" size="lg" maxCount={10}>{count}</Badge>
          <button onClick={() => setCount(count + 1)}>+</button>
        </div>
      </div>
    </div>
  );
};

export const InteractiveStates = () => {
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState(['React', 'JavaScript', 'CSS']);

  const removeTag = (tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  return (
    <div style={{
      display: 'grid',
      gap: 'var(--space-xl)',
      gridTemplateColumns: '1fr'
    }}>
      <div>
        <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
          Estados Básicos
        </h4>
        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge variant="primary">Normal</Badge>
          <Badge variant="success" onClick={() => alert('Clickeado!')}>Clickeable</Badge>
          <Badge 
            variant="warning" 
            loading={loading} 
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 2000);
            }}
          >
            {loading ? 'Cargando...' : 'Loading Test'}
          </Badge>
          <Badge variant="danger" disabled>Deshabilitado</Badge>
        </div>
      </div>
      
      <div>
        <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
          Tags Removibles
        </h4>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
          {tags.map(tag => (
            <Badge 
              key={tag}
              variant="info" 
              style="soft"
              onRemove={() => removeTag(tag)}
              size="md"
            >
              {tag}
            </Badge>
          ))}
          {tags.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Todos los tags han sido removidos
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const StatusIndicators = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
  }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Estados de Usuario
      </h4>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Badge variant="success" style="dot">Online</Badge>
        <Badge variant="warning" style="dot">Away</Badge>
        <Badge variant="danger" style="dot">Busy</Badge>
        <Badge variant="neutral" style="dot">Offline</Badge>
      </div>
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Estados de Proceso
      </h4>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Badge variant="info" icon="📋">Pendiente</Badge>
        <Badge variant="warning" icon="⏳">En progreso</Badge>
        <Badge variant="success" icon="✅">Completado</Badge>
        <Badge variant="danger" icon="❌">Cancelado</Badge>
      </div>
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Prioridades
      </h4>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Badge variant="danger" pulse uppercase>Crítico</Badge>
        <Badge variant="warning" uppercase>Alto</Badge>
        <Badge variant="info" uppercase>Medio</Badge>
        <Badge variant="neutral" uppercase>Bajo</Badge>
      </div>
    </div>
  </div>
);

export const TagSystemExample = () => {
  const [selectedTags, setSelectedTags] = useState(['JavaScript', 'React']);
  const availableTags = ['JavaScript', 'React', 'Vue', 'Angular', 'Node.js', 'CSS', 'HTML', 'TypeScript'];

  const addTag = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const removeTag = (tag) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-lg)',
      maxWidth: '600px',
      padding: 'var(--space-lg)',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-default)'
    }}>
      <div>
        <h4 style={{ margin: '0 0 var(--space-md) 0', color: 'var(--text-primary)' }}>
          Tags Seleccionados
        </h4>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          {selectedTags.length > 0 ? (
            selectedTags.map(tag => (
              <Badge 
                key={tag}
                variant="primary" 
                style="soft"
                onRemove={() => removeTag(tag)}
                size="md"
              >
                {tag}
              </Badge>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No hay tags seleccionados
            </p>
          )}
        </div>
      </div>
      
      <div>
        <h4 style={{ margin: '0 0 var(--space-md) 0', color: 'var(--text-primary)' }}>
          Tags Disponibles
        </h4>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          {availableTags
            .filter(tag => !selectedTags.includes(tag))
            .map(tag => (
              <Badge 
                key={tag}
                variant="neutral" 
                style="outline"
                onClick={() => addTag(tag)}
                size="md"
              >
                {tag}
              </Badge>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export const DarkModeExample = () => (
  <div className="dark" style={{
    padding: 'var(--space-xl)',
    backgroundColor: 'var(--bg-primary)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-default)'
  }}>
    <div style={{
      display: 'grid',
      gap: 'var(--space-lg)',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
    }}>
      <div>
        <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
          Solid
        </h4>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          <Badge variant="primary" style="solid">Primary</Badge>
          <Badge variant="success" style="solid">Success</Badge>
          <Badge variant="danger" style="solid">Danger</Badge>
        </div>
      </div>
      
      <div>
        <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
          Soft
        </h4>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          <Badge variant="primary" style="soft">Primary</Badge>
          <Badge variant="success" style="soft">Success</Badge>
          <Badge variant="danger" style="soft">Danger</Badge>
        </div>
      </div>
      
      <div>
        <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
          Interactivos
        </h4>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          <Badge 
            variant="warning" 
            icon="⚠️"
            onClick={() => alert('Badge en modo oscuro')}
          >
            Clickeable
          </Badge>
          <Badge 
            variant="info" 
            style="soft"
            onRemove={() => alert('Tag removido')}
          >
            Removible
          </Badge>
        </div>
      </div>
    </div>
  </div>
);