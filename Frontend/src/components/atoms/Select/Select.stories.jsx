// ===== SELECT ATOM STORIES =====
// src/components/atoms/Select/Select.stories.jsx

import React, { useState } from 'react';
import { Select } from './Select';

export default {
  title: 'Components/Atoms/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Select Atom

El átomo **Select** es el componente base para campos de selección en nuestro sistema de diseño.

## 🎯 Características principales

- **5 tamaños**: XS (28px), SM (32px), MD (40px), LG (48px), XL (56px)
- **4 variantes**: Default, Success, Warning, Error
- **Estados completos**: Normal, Hover, Focus, Disabled
- **Accesibilidad**: ARIA attributes, navegación por teclado, opciones deshabilitadas
- **Theming**: Variables CSS del sistema, modo oscuro automático
- **Mobile-first**: Área táctil mínima 44px, responsive

## 🔧 Uso básico

\\\`\\\`\\\`jsx
import { Select } from './atoms/Select';

// Opciones simples
const options = ['Opción 1', 'Opción 2', 'Opción 3'];

// Opciones detalladas
const detailedOptions = [
  { value: 'mx', label: 'México' },
  { value: 'us', label: 'Estados Unidos' },
  { value: 'ca', label: 'Canadá', disabled: true }
];

// Uso simple
<Select 
  options={options}
  placeholder="Selecciona una opción"
  onChange={handleChange}
/>

// Con variante semántica  
<Select 
  options={detailedOptions}
  variant="success"
  size="lg"
  rounded="lg"
/>

// Ejemplo completo
<Select 
  options={detailedOptions}
  size="lg"
  variant="default"
  rounded="md"
  placeholder="Selecciona tu país"
  required
  ariaLabel="País de residencia"
/>
\\\`\\\`\\\`

## ♿ Accesibilidad

- **ARIA attributes**: aria-label, aria-describedby, aria-invalid automático
- **Navegación por teclado**: Flechas arriba/abajo, Enter, Escape, Tab
- **Estados semánticos**: aria-invalid en variante error
- **Opciones deshabilitadas**: Excluidas de navegación por teclado
- **Screen readers**: Anuncios contextuales y cambios de estado

## 🏗️ Atomic Design

Como **átomo**, Select es:
- ✅ **Reutilizable**: Se puede usar en cualquier contexto
- ✅ **Sin dependencias**: No depende de otros componentes del sistema
- ✅ **Propósito único**: Selección de opciones con accesibilidad completa
- ✅ **Altamente configurable**: 5 tamaños, 4 variantes, múltiples estados
        `
      }
    }
  },
  argTypes: {
    options: {
      name: 'Opciones',
      description: 'Array de opciones - strings simples o objetos {value, label, disabled}',
      control: 'object',
      table: {
        type: { summary: 'Array<string | {value: string, label: string, disabled?: boolean}>' },
        defaultValue: { summary: '[]' }
      }
    },
    size: {
      name: 'Tamaño',
      description: 'Tamaño del select - controla padding, font-size y altura mínima',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'md'" }
      }
    },
    variant: {
      name: 'Variante',
      description: 'Estilo visual semántico del select - afecta colores de borde y fondo',
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'default'" }
      }
    },
    rounded: {
      name: 'Radio de bordes',
      description: 'Curvatura de las esquinas del select',
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'md'" }
      }
    },
    placeholder: {
      name: 'Placeholder',
      description: 'Texto mostrado como primera opción cuando no hay selección',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Selecciona una opción'" }
      }
    },
    value: {
      name: 'Valor',
      description: 'Valor controlado del select para componentes controlados',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    defaultValue: {
      name: 'Valor por defecto',
      description: 'Valor inicial para componentes no controlados',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    disabled: {
      name: 'Deshabilitado',
      description: 'Si el select está deshabilitado - previene interacciones',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    required: {
      name: 'Requerido',
      description: 'Si el select es requerido - afecta validación HTML5',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    compact: {
      name: 'Compacto',
      description: 'Reduce el padding horizontal para espacios limitados',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    onChange: {
      name: 'Función onChange',
      description: 'Callback ejecutado cuando cambia la selección',
      action: 'changed',
      table: {
        type: { summary: '(value: string, event: Event) => void' }
      }
    },
    ariaLabel: {
      name: 'ARIA Label',
      description: 'Etiqueta accesible para lectores de pantalla',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    className: {
      name: 'Clase CSS',
      description: 'Clases CSS adicionales para extensibilidad',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    }
  }
};

// ===== DATOS DE EJEMPLO =====
const basicOptions = ['Primavera', 'Verano', 'Otoño', 'Invierno'];

const countryOptions = [
  { value: 'mx', label: 'México' },
  { value: 'us', label: 'Estados Unidos' },
  { value: 'ca', label: 'Canadá' },
  { value: 'es', label: 'España' },
  { value: 'de', label: 'Alemania', disabled: true }
];

const categoryOptions = [
  { value: 'tech', label: '💻 Tecnología' },
  { value: 'design', label: '🎨 Diseño' },
  { value: 'business', label: '💼 Negocios' },
  { value: 'health', label: '🏥 Salud', disabled: true }
];

// ===== 1. DEFAULT STORY (OBLIGATORIA) =====
export const Default = {
  args: {
    options: basicOptions,
    placeholder: 'Selecciona una estación',
    size: 'md',
    variant: 'default'
  }
};

// ===== BASIC STORY (PARA COMPATIBILIDAD) =====
export const Basic = {
  args: {
    options: basicOptions,
    placeholder: 'Ejemplo básico',
    size: 'md',
    variant: 'default'
  }
};

// ===== 2. SIZES STORY (OBLIGATORIA) =====
export const Sizes = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    alignItems: 'center',
    padding: 'var(--space-md)'
  }}>
    {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
      <div key={size} style={{ textAlign: 'center' }}>
        <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>
          {size.toUpperCase()}
        </h4>
        <Select 
          size={size} 
          options={basicOptions} 
          placeholder={`${size.toUpperCase()}`}
        />
      </div>
    ))}
  </div>
);

Sizes.parameters = {
  docs: {
    description: {
      story: 'Los 5 tamaños estándar del sistema de diseño. XS para contextos compactos, MD para uso general, XL para destacar.'
    }
  }
};

// ===== 3. VARIANTS STORY (OBLIGATORIA) =====
export const Variants = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    alignItems: 'center',
    padding: 'var(--space-md)'
  }}>
    {['default', 'success', 'warning', 'error'].map(variant => (
      <div key={variant} style={{ textAlign: 'center' }}>
        <h4 style={{ marginBottom: 'var(--space-sm)' }}>
          {variant.charAt(0).toUpperCase() + variant.slice(1)}
        </h4>
        <Select 
          variant={variant} 
          options={countryOptions}
          placeholder={`Variante ${variant}`}
          defaultValue={variant === 'success' ? 'mx' : undefined}
        />
      </div>
    ))}
  </div>
);

Variants.parameters = {
  docs: {
    description: {
      story: 'Variantes semánticas del sistema: Default neutral, Success para confirmaciones, Warning para advertencias, Error para errores.'
    }
  }
};

// ===== 4. STATES STORY (OBLIGATORIA) =====
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
      <Select 
        options={countryOptions}
        placeholder="Estado normal"
        size="lg"
      />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Hover</h4>
      <Select 
        className="pseudo-hover" 
        options={countryOptions}
        placeholder="Hover simulado"
        size="lg"
      />
      <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
        (Simulated)
      </small>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Focus</h4>
      <Select 
        className="pseudo-focus" 
        options={countryOptions}
        placeholder="Focus simulado"
        size="lg"
      />
      <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
        (Simulated)
      </small>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Disabled</h4>
      <Select 
        disabled 
        options={countryOptions}
        placeholder="Deshabilitado"
        size="lg"
      />
    </div>
  </div>
);

States.parameters = {
  docs: {
    description: {
      story: 'Estados interactivos del componente. Focus y hover muestran feedback visual, disabled previene interacciones.'
    }
  }
};

// ===== 5. INTERACTIVE STORY (OBLIGATORIA) =====
export const Interactive = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const [interactionCount, setInteractionCount] = useState(0);
  
  const handleChange = (value) => {
    setSelectedValue(value);
    setInteractionCount(prev => prev + 1);
  };
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-lg)',
      alignItems: 'center',
      padding: 'var(--space-md)'
    }}>
      <Select 
        options={categoryOptions}
        placeholder="Selecciona una categoría"
        value={selectedValue}
        onChange={handleChange}
        size="lg"
        variant={selectedValue ? 'success' : 'default'}
        ariaLabel="Categoría de interés principal"
      />
      
      <small style={{ color: 'var(--text-muted)' }}>
        Valor seleccionado: <strong>{selectedValue || 'Ninguno'}</strong>
      </small>
      
      <small style={{ color: 'var(--text-muted)' }}>
        Interacciones: <strong>{interactionCount}</strong>
      </small>
      
      <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
        Prueba navegación por teclado: Tab + Flechas + Enter
      </small>
    </div>
  );
};

Interactive.parameters = {
  docs: {
    description: {
      story: 'Ejemplo interactivo que demuestra onChange y navegación por teclado. Accesible vía Tab + Flechas + Enter.'
    }
  }
};

// ===== 6. ACCESSIBILITY STORY (OBLIGATORIA) =====
export const Accessibility = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-lg)',
    padding: 'var(--space-md)'
  }}>
    <Select 
      options={countryOptions}
      ariaLabel="País de residencia para envío de productos"
      placeholder="Selecciona tu país"
      required
      size="lg"
    />
    
    <small style={{ color: 'var(--text-muted)' }}>
      ✅ ARIA label descriptivo
    </small>
    
    <small style={{ color: 'var(--text-muted)' }}>
      ✅ Navegación por teclado
    </small>
    
    <small style={{ color: 'var(--text-muted)' }}>
      ✅ Estados semánticos
    </small>
    
    <small style={{ color: 'var(--text-muted)' }}>
      ✅ Opciones deshabilitadas excluidas
    </small>
    
    <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
      Prueba con lector de pantalla y navegación por teclado
    </small>
  </div>
);

Accessibility.parameters = {
  docs: {
    description: {
      story: 'Configuración completa de accesibilidad: ARIA labels, navegación por teclado, y estados semánticos.'
    }
  }
};