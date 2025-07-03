// ===== INPUT STORIES =====
// src/components/atoms/Input/Input.stories.jsx

import React, { useState } from 'react';
import { Input } from './Input';

export default {
  title: 'Components/Atoms/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Input Atom

El átomo **Input** es el componente base para campos de entrada de texto en nuestro sistema de diseño.

## 🎯 Características principales

- **5 tamaños**: XS, SM, MD, LG, XL (responsive con área táctil mínima)
- **4 variantes semánticas**: Default, Error, Success, Warning
- **Estados completos**: Normal, Focus, Hover, Disabled, Read-only
- **Tipos soportados**: Text, Email, Password, Number, Tel, URL, Search, Date, Time
- **Accesibilidad**: ARIA completo, validación HTML5, navegación por teclado
- **Theming**: Variables CSS del sistema, modo oscuro automático
- **Mobile-first**: Área táctil de 44px, sin zoom en iOS

## 🔧 Uso básico

\\\`\\\`\\\`jsx
import { Input } from './atoms/Input';

// Uso simple
<Input 
  placeholder="Escribe aquí..."
  onChange={handleChange}
/>

// Con variante semántica
<Input 
  variant="error"
  placeholder="Campo requerido"
  ariaErrorMessage="error-msg"
/>

// Ejemplo completo
<Input 
  type="email"
  size="lg"
  variant="success"
  rounded="lg"
  placeholder="correo@ejemplo.com"
  required
  autoComplete="email"
  ariaLabel="Correo electrónico"
/>
\\\`\\\`\\\`

## ♿ Accesibilidad

- **ARIA attributes**: \`aria-label\`, \`aria-describedby\`, \`aria-errormessage\`
- **Validación HTML5**: \`required\`, \`pattern\`, \`maxLength\`, \`minLength\`
- **Estados semánticos**: \`aria-invalid\` automático en errores
- **Autocompletado**: \`autoComplete\` para mejor UX

## 🏗️ Atomic Design

Como **átomo**, Input es:
- ✅ **Reutilizable**: Se puede usar en cualquier contexto
- ✅ **Sin dependencias**: No depende de otros componentes del sistema
- ✅ **Propósito único**: Campo de entrada de texto base
- ✅ **Altamente configurable**: Múltiples tamaños, variantes y tipos
        `
      }
    }
  },
  argTypes: {
    type: {
      name: 'Tipo',
      description: 'Tipo de input HTML',
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time', 'datetime-local'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'text'" }
      }
    },
    size: {
      name: 'Tamaño',
      description: 'Tamaño del input (responsive en móviles)',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'md'" }
      }
    },
    variant: {
      name: 'Variante',
      description: 'Variante semántica del input',
      control: 'select',
      options: ['default', 'error', 'success', 'warning'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'default'" }
      }
    },
    rounded: {
      name: 'Radio de bordes',
      description: 'Curvatura de las esquinas del input',
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'md'" }
      }
    },
    placeholder: {
      name: 'Placeholder',
      description: 'Texto de ayuda mostrado cuando el campo está vacío',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    value: {
      name: 'Valor',
      description: 'Valor controlado del input',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    disabled: {
      name: 'Deshabilitado',
      description: 'Deshabilita el input e impide interacciones',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    readOnly: {
      name: 'Solo lectura',
      description: 'El input es de solo lectura',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    required: {
      name: 'Requerido',
      description: 'Campo requerido para validación HTML5',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    compact: {
      name: 'Compacto',
      description: 'Padding horizontal reducido para espacios estrechos',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    autoComplete: {
      name: 'Auto-completado',
      description: 'Valor para autocompletado del navegador',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    maxLength: {
      name: 'Longitud máxima',
      description: 'Número máximo de caracteres permitidos',
      control: 'number',
      table: {
        type: { summary: 'number' }
      }
    },
    ariaLabel: {
      name: 'ARIA Label',
      description: 'Etiqueta accesible para lectores de pantalla',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    }
  }
};

// ========== DEFAULT STORY ==========
export const Default = {
  args: {
    placeholder: 'Ingresa tu texto aquí...',
    type: 'text',
    size: 'md',
    variant: 'default',
    rounded: 'md'
  }
};

// ========== SIZES STORY ==========
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
      <Input size="xs" placeholder="Extra small" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>SM</h4>
      <Input size="sm" placeholder="Small" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>MD</h4>
      <Input size="md" placeholder="Medium" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>LG</h4>
      <Input size="lg" placeholder="Large" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>XL</h4>
      <Input size="xl" placeholder="Extra large" />
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

// ========== VARIANTS STORY ==========
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
      <Input variant="default" placeholder="Campo normal" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Success</h4>
      <Input variant="success" placeholder="Campo válido" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Warning</h4>
      <Input variant="warning" placeholder="Campo con advertencia" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Error</h4>
      <Input variant="error" placeholder="Campo con error" />
    </div>
  </div>
);

Variants.parameters = {
  docs: {
    description: {
      story: 'Variantes semánticas del sistema: Default neutral, Success para confirmaciones, Warning para advertencias, Error para errores.'
    }
  }
};

// ========== STATES STORY ==========
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
      <Input placeholder="Estado normal" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Hover</h4>
      <Input className="pseudo-hover" placeholder="Estado hover" />
      <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
        (Simulated)
      </small>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Focus</h4>
      <Input className="pseudo-focus" placeholder="Estado focus" />
      <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
        (Simulated)
      </small>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Disabled</h4>
      <Input disabled placeholder="Estado deshabilitado" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Read Only</h4>
      <Input readOnly value="Solo lectura" />
    </div>
  </div>
);

States.parameters = {
  docs: {
    description: {
      story: 'Estados interactivos del componente. Focus y hover muestran feedback visual, disabled previene interacciones, read-only permite leer pero no editar.'
    }
  }
};

// ========== INPUT TYPES STORY ==========
export const InputTypes = () => {
  const [values, setValues] = useState({
    text: '',
    email: '',
    password: '',
    number: '',
    tel: '',
    url: '',
    search: '',
    date: '',
    time: ''
  });

  const handleChange = (type) => (e) => {
    setValues(prev => ({
      ...prev,
      [type]: e.target.value
    }));
  };

  return (
    <div style={{
      display: 'grid',
      gap: 'var(--space-lg)',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      padding: 'var(--space-md)'
    }}>
      <div>
        <h4 style={{ marginBottom: 'var(--space-sm)' }}>Text</h4>
        <Input 
          type="text" 
          placeholder="Texto libre" 
          value={values.text}
          onChange={handleChange('text')}
        />
      </div>
      
      <div>
        <h4 style={{ marginBottom: 'var(--space-sm)' }}>Email</h4>
        <Input 
          type="email" 
          placeholder="correo@ejemplo.com" 
          value={values.email}
          onChange={handleChange('email')}
          autoComplete="email"
        />
      </div>
      
      <div>
        <h4 style={{ marginBottom: 'var(--space-sm)' }}>Password</h4>
        <Input 
          type="password" 
          placeholder="Contraseña segura" 
          value={values.password}
          onChange={handleChange('password')}
          autoComplete="current-password"
        />
      </div>
      
      <div>
        <h4 style={{ marginBottom: 'var(--space-sm)' }}>Number</h4>
        <Input 
          type="number" 
          placeholder="123456" 
          value={values.number}
          onChange={handleChange('number')}
        />
      </div>
      
      <div>
        <h4 style={{ marginBottom: 'var(--space-sm)' }}>Tel</h4>
        <Input 
          type="tel" 
          placeholder="+52 555 123 4567" 
          value={values.tel}
          onChange={handleChange('tel')}
          autoComplete="tel"
        />
      </div>
      
      <div>
        <h4 style={{ marginBottom: 'var(--space-sm)' }}>URL</h4>
        <Input 
          type="url" 
          placeholder="https://ejemplo.com" 
          value={values.url}
          onChange={handleChange('url')}
          autoComplete="url"
        />
      </div>
      
      <div>
        <h4 style={{ marginBottom: 'var(--space-sm)' }}>Search</h4>
        <Input 
          type="search" 
          placeholder="Buscar..." 
          value={values.search}
          onChange={handleChange('search')}
        />
      </div>
      
      <div>
        <h4 style={{ marginBottom: 'var(--space-sm)' }}>Date</h4>
        <Input 
          type="date" 
          value={values.date}
          onChange={handleChange('date')}
        />
      </div>
      
      <div>
        <h4 style={{ marginBottom: 'var(--space-sm)' }}>Time</h4>
        <Input 
          type="time" 
          value={values.time}
          onChange={handleChange('time')}
        />
      </div>
    </div>
  );
};

InputTypes.parameters = {
  docs: {
    description: {
      story: 'Diferentes tipos de input soportados. Cada tipo proporciona comportamiento específico del teclado y validación nativa del navegador.'
    }
  }
};

// ========== INTERACTIVE STORY ==========
export const Interactive = () => {
  const [value, setValue] = useState('');
  const [focusCount, setFocusCount] = useState(0);
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-lg)',
      alignItems: 'center',
      padding: 'var(--space-md)'
    }}>
      <Input 
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocusCount(prev => prev + 1)}
        placeholder="Escribe y haz focus..."
        size="lg"
        ariaLabel="Campo interactivo de demostración"
      />
      
      <small style={{ color: 'var(--text-muted)' }}>
        Valor actual: "{value}"
      </small>
      
      <small style={{ color: 'var(--text-muted)' }}>
        Focus count: {focusCount}
      </small>
      
      <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
        Prueba navegación por teclado: Tab para focus
      </small>
    </div>
  );
};

Interactive.parameters = {
  docs: {
    description: {
      story: 'Ejemplo interactivo que demuestra onChange, onFocus y navegación por teclado. Controla el valor y cuenta los eventos de focus.'
    }
  }
};

// ========== ACCESSIBILITY STORY ==========
export const Accessibility = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-lg)',
    padding: 'var(--space-md)',
    maxWidth: '400px'
  }}>
    <div>
      <Input 
        ariaLabel="Campo de correo electrónico para registro"
        type="email"
        placeholder="correo@ejemplo.com"
        required
        autoComplete="email"
      />
      <small style={{ color: 'var(--text-muted)' }}>
        ✅ ARIA label descriptivo
      </small>
    </div>
    
    <div>
      <Input 
        type="password"
        placeholder="Contraseña"
        ariaDescribedBy="password-help"
        required
        minLength={8}
      />
      <div id="password-help" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
        ✅ Mínimo 8 caracteres, vinculado con aria-describedby
      </div>
    </div>
    
    <div>
      <Input 
        variant="error"
        placeholder="Campo con error"
        ariaErrorMessage="error-message"
        ariaLabel="Campo con error de validación"
      />
      <div id="error-message" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-danger)' }}>
        ✅ Error vinculado con aria-errormessage
      </div>
    </div>
    
    <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
      Prueba con lector de pantalla y navegación por teclado
    </small>
  </div>
);

Accessibility.parameters = {
  docs: {
    description: {
      story: 'Configuración completa de accesibilidad: ARIA labels, aria-describedby para ayuda, aria-errormessage para errores, y navegación por teclado.'
    }
  }
};