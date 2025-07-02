// src/components/atoms/Avatar/Avatar.stories.jsx
import React from 'react';
import { Avatar } from './Avatar';

export default {
  title: 'Components/Atoms/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Avatar Atom

El átomo **Avatar** es el componente base para mostrar imágenes de perfil e iniciales de usuario en nuestro sistema de diseño.

## 🎯 Características principales

- **5 tamaños**: xs, sm, md, lg, xl
- **4 variantes**: default, elevated, bordered, minimal
- **3 formas**: circle, rounded, square
- **Estados completos**: normal, hover, focus, disabled, loading
- **Accesibilidad**: ARIA labels, navegación por teclado
- **Theming**: Variables CSS del sistema

## 🔧 Uso básico

\\\`\\\`\\\`jsx
import { Avatar } from './atoms/Avatar';

<Avatar 
  size="md"
  variant="default"
  name="Juan Pérez"
  src="https://ejemplo.com/avatar.jpg"
/>
\\\`\\\`\\\`
        `
      }
    }
  },
  argTypes: {
    src: {
      name: 'Imagen (src)',
      description: 'URL de la imagen del avatar',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    name: {
      name: 'Nombre',
      description: 'Nombre del usuario (genera iniciales si no hay imagen)',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    size: {
      name: 'Tamaño',
      description: 'Tamaño del avatar',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: "'xs' | 'sm' | 'md' | 'lg' | 'xl'" },
        defaultValue: { summary: 'md' }
      }
    },
    variant: {
      name: 'Variante',
      description: 'Variante de presentación del avatar',
      control: 'select',
      options: ['default', 'elevated', 'bordered', 'minimal'],
      table: {
        type: { summary: "'default' | 'elevated' | 'bordered' | 'minimal'" },
        defaultValue: { summary: 'default' }
      }
    },
    shape: {
      name: 'Forma',
      description: 'Forma del avatar',
      control: 'select',
      options: ['circle', 'rounded', 'square'],
      table: {
        type: { summary: "'circle' | 'rounded' | 'square'" },
        defaultValue: { summary: 'circle' }
      }
    },
    status: {
      name: 'Estado',
      description: 'Indicador de estado de actividad',
      control: 'select',
      options: [undefined, 'online', 'offline', 'away', 'busy'],
      table: {
        type: { summary: "'online' | 'offline' | 'away' | 'busy'" }
      }
    },
    badge: {
      name: 'Badge',
      description: 'Número o texto para mostrar como badge',
      control: 'text',
      table: {
        type: { summary: 'string | number' }
      }
    },
    loading: {
      name: 'Cargando',
      description: 'Estado de carga con spinner',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    disabled: {
      name: 'Deshabilitado',
      description: 'Si el avatar está deshabilitado',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    onClick: {
      name: 'Función onClick',
      description: 'Función ejecutada al hacer click',
      action: 'clicked',
      table: {
        type: { summary: 'function' }
      }
    },
    className: {
      name: 'Clases CSS',
      description: 'Clases CSS adicionales',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    }
  }
};

// ========== 1. DEFAULT STORY (OBLIGATORIA) ==========
export const Default = {
  args: {
    name: 'Juan Pérez',
    size: 'md',
    variant: 'default',
    shape: 'circle'
  }
};

Default.parameters = {
  docs: {
    description: {
      story: 'Configuración por defecto del Avatar. Muestra iniciales cuando no hay imagen.'
    }
  }
};

// ========== 2. SIZES STORY (OBLIGATORIA) ==========
export const Sizes = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    alignItems: 'center',
    padding: 'var(--space-md)'
  }}>
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>XS</h4>
      <Avatar size="xs" name="XS" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>SM</h4>
      <Avatar size="sm" name="SM" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>MD</h4>
      <Avatar size="md" name="MD" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>LG</h4>
      <Avatar size="lg" name="LG" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>XL</h4>
      <Avatar size="xl" name="XL" />
    </div>
  </div>
);

Sizes.parameters = {
  docs: {
    description: {
      story: 'Los 5 tamaños estándar del sistema de diseño. XS para contextos compactos, MD para uso general, XL para destacar.'
    }
  }
};

// ========== 3. VARIANTS STORY (OBLIGATORIA) ==========
export const Variants = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    alignItems: 'center',
    padding: 'var(--space-md)'
  }}>
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Default</h4>
      <Avatar variant="default" name="Default" size="lg" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Elevated</h4>
      <Avatar variant="elevated" name="Elevated" size="lg" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Bordered</h4>
      <Avatar variant="bordered" name="Bordered" size="lg" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Minimal</h4>
      <Avatar variant="minimal" name="Minimal" size="lg" />
    </div>
  </div>
);

Variants.parameters = {
  docs: {
    description: {
      story: 'Variantes de presentación: Default estándar, Elevated con sombra, Bordered con borde, Minimal sin decoración.'
    }
  }
};

// ========== 4. STATES STORY (OBLIGATORIA) ==========
export const States = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    alignItems: 'center',
    padding: 'var(--space-md)'
  }}>
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Normal</h4>
      <Avatar name="Normal" size="lg" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Hover</h4>
      <Avatar className="pseudo-hover" name="Hover" size="lg" onClick={() => {}} />
      <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
        (Simulated)
      </small>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Focus</h4>
      <Avatar className="pseudo-focus" name="Focus" size="lg" onClick={() => {}} />
      <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
        (Simulated)
      </small>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Loading</h4>
      <Avatar loading name="Loading" size="lg" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Disabled</h4>
      <Avatar disabled name="Disabled" size="lg" onClick={() => {}} />
    </div>
  </div>
);

States.parameters = {
  docs: {
    description: {
      story: 'Estados interactivos del componente. Loading muestra spinner, disabled previene interacciones.'
    }
  }
};

// ========== 5. INTERACTIVE STORY (OBLIGATORIA) ==========
export const Interactive = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-lg)',
    alignItems: 'center',
    padding: 'var(--space-md)'
  }}>
    <Avatar 
      name="María González"
      size="lg"
      onClick={() => alert('¡Perfil de María clickeado!')}
    />
    
    <Avatar 
      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
      name="Carlos López"
      size="lg"
      variant="elevated"
      status="online"
      onClick={() => alert('¡Perfil de Carlos clickeado!')}
    />
    
    <Avatar 
      name="Ana Silva"
      size="lg"
      variant="bordered"
      badge="3"
      shape="rounded"
      onClick={() => alert('¡Ana tiene 3 notificaciones!')}
    />
    
    <Avatar 
      name="Pedro Martín"
      size="lg"
      variant="minimal"
      shape="square"
      status="busy"
      onClick={() => alert('¡Pedro está ocupado!')}
    />
  </div>
);

Interactive.parameters = {
  docs: {
    description: {
      story: 'Ejemplos interactivos del Avatar. Haz click en cualquiera para ver su funcionalidad.'
    }
  }
};

// ========== 6. ACCESSIBILITY STORY (OBLIGATORIA) ==========
export const Accessibility = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-lg)',
    alignItems: 'center',
    padding: 'var(--space-md)'
  }}>
    <Avatar 
      name="Usuario Principal"
      ariaLabel="Avatar del usuario principal, hacer click para abrir menú"
      size="lg"
      onClick={() => alert('Menú abierto')}
    />
    
    <Avatar 
      src="https://images.unsplash.com/photo-1494790108755-2616b9ce3e40?w=100&h=100&fit=crop&crop=face"
      name="Administradora"
      ariaLabel="Avatar de la administradora del sistema"
      size="lg"
      variant="elevated"
      status="online"
    />
    
    <Avatar 
      name="Invitado"
      ariaLabel="Usuario invitado sin permisos especiales"
      disabled
      size="lg"
    />
    
    <Avatar 
      loading
      ariaLabel="Cargando información del usuario"
      size="lg"
    />
    
    <div style={{ 
      marginTop: 'var(--space-md)', 
      padding: 'var(--space-md)', 
      backgroundColor: 'var(--bg-secondary)', 
      borderRadius: 'var(--radius-md)',
      textAlign: 'center'
    }}>
      <h4 style={{ margin: '0 0 var(--space-sm) 0', color: 'var(--text-primary)' }}>
        Características de accesibilidad:
      </h4>
      <ul style={{ 
        margin: 0, 
        padding: 0, 
        listStyle: 'none', 
        fontSize: 'var(--text-sm)', 
        color: 'var(--text-muted)' 
      }}>
        <li>✅ ARIA labels descriptivos</li>
        <li>✅ Estados aria-disabled y aria-busy</li>
        <li>✅ Navegación por teclado (Tab, Enter, Space)</li>
        <li>✅ Focus visible con outline</li>
        <li>✅ Roles semánticos (button cuando clickeable)</li>
        <li>✅ Alt text apropiado para imágenes</li>
      </ul>
    </div>
  </div>
);

Accessibility.parameters = {
  docs: {
    description: {
      story: 'Configuración de accesibilidad completa. Todos los avatares son navegables por teclado y compatibles con screen readers.'
    }
  }
};