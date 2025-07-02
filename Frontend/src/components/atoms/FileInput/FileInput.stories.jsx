// src/components/atoms/FileInput/FileInput.stories.jsx
import React from 'react';
import { FileInput } from './FileInput';

export default {
  title: 'Components/Atoms/FileInput',
  component: FileInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# FileInput Atom

El átomo **FileInput** es el componente base para selección de archivos en nuestro sistema de diseño.

## 🎯 Características principales

- **5 tamaños**: xs, sm, md, lg, xl
- **4 variantes**: default, success, warning, error
- **Estados completos**: normal, hover, focus, disabled
- **Accesibilidad**: ARIA labels, navegación por teclado
- **Theming**: Variables CSS del sistema

## 🔧 Uso básico

\\\`\\\`\\\`jsx
import { FileInput } from './atoms/FileInput';

<FileInput 
  size="md"
  variant="default"
  onChange={handleChange}
  text="Seleccionar archivo"
/>
\\\`\\\`\\\`
        `
      }
    }
  },
  argTypes: {
    text: {
      name: 'Texto',
      description: 'Texto mostrado en el botón',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Seleccionar archivo'" }
      }
    },
    size: {
      name: 'Tamaño',
      description: 'Tamaño del componente',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: "'xs' | 'sm' | 'md' | 'lg' | 'xl'" },
        defaultValue: { summary: 'md' }
      }
    },
    variant: {
      name: 'Variante',
      description: 'Variante de estado del componente',
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
      table: {
        type: { summary: "'default' | 'success' | 'warning' | 'error'" },
        defaultValue: { summary: 'default' }
      }
    },
    accept: {
      name: 'Tipos aceptados',
      description: 'Tipos de archivo permitidos',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    multiple: {
      name: 'Múltiples archivos',
      description: 'Permite seleccionar múltiples archivos',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    disabled: {
      name: 'Deshabilitado',
      description: 'Si el input está deshabilitado',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    required: {
      name: 'Requerido',
      description: 'Si el campo es obligatorio',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    helperText: {
      name: 'Texto de ayuda',
      description: 'Texto de ayuda descriptivo',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    errorText: {
      name: 'Texto de error',
      description: 'Mensaje de error',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    onChange: {
      name: 'Función onChange',
      description: 'Función ejecutada al seleccionar archivo',
      action: 'changed',
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
    text: 'Seleccionar archivo',
    size: 'md',
    variant: 'default'
  }
};

Default.parameters = {
  docs: {
    description: {
      story: 'Configuración por defecto del FileInput. Acepta cualquier tipo de archivo.'
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
      <FileInput size="xs" text="Extra small" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>SM</h4>
      <FileInput size="sm" text="Small" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>MD</h4>
      <FileInput size="md" text="Medium" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>LG</h4>
      <FileInput size="lg" text="Large" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>XL</h4>
      <FileInput size="xl" text="Extra large" />
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
      <FileInput variant="default" text="Campo normal" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Success</h4>
      <FileInput variant="success" text="Campo válido" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Warning</h4>
      <FileInput variant="warning" text="Campo advertencia" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Error</h4>
      <FileInput variant="error" text="Campo error" />
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
      <FileInput size="lg" text="Estado normal" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Hover</h4>
      <FileInput className="pseudo-hover" size="lg" text="Estado hover" />
      <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
        (Simulated)
      </small>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Focus</h4>
      <FileInput className="pseudo-focus" size="lg" text="Estado focus" />
      <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
        (Simulated)
      </small>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Required</h4>
      <FileInput required size="lg" text="Campo requerido" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Disabled</h4>
      <FileInput disabled size="lg" text="Deshabilitado" />
    </div>
  </div>
);

States.parameters = {
  docs: {
    description: {
      story: 'Estados interactivos del componente. Required muestra asterisco, disabled previene interacciones.'
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
    <FileInput 
      size="lg"
      text="Seleccionar cualquier archivo"
      helperText="Haz click para seleccionar un archivo"
      onChange={(e) => console.log('Archivo seleccionado:', e.target.files[0])}
    />
    
    <FileInput 
      accept="image/*"
      size="lg"
      text="Solo imágenes"
      helperText="JPG, PNG, GIF, WebP"
      variant="success"
      onChange={(e) => console.log('Imagen seleccionada:', e.target.files[0])}
    />
    
    <FileInput 
      multiple
      accept=".pdf,.doc,.docx"
      size="lg"
      text="Múltiples documentos"
      helperText="Selecciona varios archivos PDF o Word"
      onChange={(e) => console.log('Documentos seleccionados:', Array.from(e.target.files || []))}
    />
    
    <FileInput 
      accept="video/*"
      size="lg"
      text="Seleccionar video"
      helperText="MP4, WebM, AVI, MOV"
      variant="warning"
      onChange={(e) => console.log('Video seleccionado:', e.target.files[0])}
    />
  </div>
);

Interactive.parameters = {
  docs: {
    description: {
      story: 'Ejemplos interactivos del FileInput. Selecciona archivos para ver la funcionalidad en acción. Revisa la consola del navegador.'
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
    <FileInput 
      ariaLabel="Seleccionar archivo de currículum"
      accept=".pdf,.doc,.docx"
      size="lg"
      text="Subir currículum"
      helperText="Formatos permitidos: PDF, Word"
    />
    
    <FileInput 
      ariaLabel="Seleccionar foto de perfil"
      accept="image/*"
      size="lg"
      text="Foto de perfil"
      helperText="Imagen para tu perfil público"
      required
    />
    
    <FileInput 
      ariaLabel="Archivo no disponible actualmente"
      disabled
      size="lg"
      text="No disponible"
      helperText="Esta función está temporalmente deshabilitada"
    />
    
    <FileInput 
      ariaLabel="Campo con error de validación"
      size="lg"
      text="Campo con error"
      errorText="Este campo es obligatorio"
      variant="error"
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
        <li>✅ ARIA labels para screen readers</li>
        <li>✅ Estados aria-required y aria-invalid</li>
        <li>✅ Navegación por teclado (Tab, Enter, Space)</li>
        <li>✅ Focus visible con outline</li>
        <li>✅ Mensajes de error con role="alert"</li>
        <li>✅ Área táctil mínima de 44px</li>
      </ul>
    </div>
  </div>
);

Accessibility.parameters = {
  docs: {
    description: {
      story: 'Configuración de accesibilidad completa. Todos los FileInput son navegables por teclado y compatibles con screen readers.'
    }
  }
};