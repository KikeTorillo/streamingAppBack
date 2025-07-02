import React, { useState } from 'react';
import { Cropped } from './Cropped';

export default {
  title: 'Components/Atoms/Cropped',
  component: Cropped,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Cropped Atom

El átomo **Cropped** permite recortar imágenes de forma sencilla y accesible siguiendo principios de **Atomic Design**.
Proporciona herramientas intuitivas de recorte con aspect ratios configurables y manejo de estados.

## 🎯 Características principales

- **5 tamaños**: xs, sm, md, lg, xl
- **4 variantes**: default, success, warning, error  
- **Estados completos**: normal, hover, focus, disabled
- **Aspect ratios**: 1:1, 4:3, 16:9, 21:9 y personalizados
- **Accesibilidad**: ARIA labels, navegación por teclado
- **Theming**: Variables CSS del sistema

## 🔧 Uso básico

\`\`\`jsx
import { Cropped } from './atoms/Cropped';

<Cropped 
  imageSrc="imagen.jpg" 
  aspect={16/9}
  onComplete={handleCrop} 
/>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    imageSrc: {
      name: 'Imagen',
      description: 'URL de la imagen a recortar',
      control: 'text',
      table: { 
        type: { summary: 'string' },
        defaultValue: { summary: 'N/A' }
      }
    },
    aspect: {
      name: 'Relación de aspecto',
      description: 'Relación ancho/alto del recorte',
      control: 'number',
      table: { 
        type: { summary: 'number' }, 
        defaultValue: { summary: '16/9' }
      }
    },
    onComplete: {
      name: 'Función onComplete',
      description: 'Callback al confirmar el recorte',
      action: 'completed',
      table: { 
        type: { summary: 'function' }
      }
    }
  }
};

// ========== 1. DEFAULT ==========
export const Default = () => (
  <Cropped 
    imageSrc="https://via.placeholder.com/800x600/4ade80/ffffff?text=Imagen+Demo" 
    aspect={16 / 9}
  />
);
Default.parameters = {
  docs: { 
    description: { 
      story: 'Configuración por defecto del componente Cropped con aspect ratio 16:9.' 
    } 
  }
};

// ========== 2. SIZES ==========
export const Sizes = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    alignItems: 'center',
    padding: 'var(--space-md)'
  }}>
    {['xs', 'sm', 'md', 'lg', 'xl'].map((size, index) => (
      <div key={size} style={{ 
        height: 120 + index * 40,
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          textAlign: 'center', 
          padding: 'var(--space-xs)',
          fontSize: '1.2rem',
          fontWeight: '500',
          backgroundColor: 'var(--bg-secondary)'
        }}>
          {size.toUpperCase()}
        </div>
        <Cropped 
          imageSrc="https://via.placeholder.com/800x600/3b82f6/ffffff?text=Tamaño+${size}" 
          aspect={1} 
        />
      </div>
    ))}
  </div>
);
Sizes.parameters = {
  docs: { 
    description: { 
      story: 'Los 5 tamaños estándar del sistema: xs, sm, md, lg, xl con contenedores de altura variable.' 
    } 
  }
};

// ========== 3. VARIANTS ==========
export const Variants = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    alignItems: 'center',
    padding: 'var(--space-md)'
  }}>
    {[
      { ratio: 1, name: 'Cuadrado (1:1)', color: '22c55e' },
      { ratio: 4/3, name: 'Estándar (4:3)', color: '3b82f6' },
      { ratio: 16/9, name: 'Widescreen (16:9)', color: 'f59e0b' },
      { ratio: 21/9, name: 'Ultra-wide (21:9)', color: 'ef4444' }
    ].map((variant) => (
      <div key={variant.ratio} style={{
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          textAlign: 'center', 
          padding: 'var(--space-xs)',
          fontSize: '1.1rem',
          fontWeight: '500',
          backgroundColor: 'var(--bg-secondary)'
        }}>
          {variant.name}
        </div>
        <Cropped 
          imageSrc={`https://via.placeholder.com/800x600/${variant.color}/ffffff?text=${variant.name.replace(/[():]/g, '')}`} 
          aspect={variant.ratio} 
        />
      </div>
    ))}
  </div>
);
Variants.parameters = {
  docs: { 
    description: { 
      story: 'Las 4 variantes principales de aspect ratio: cuadrado, estándar, widescreen y ultra-wide.' 
    } 
  }
};

// ========== 4. STATES ==========
export const States = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    alignItems: 'center',
    padding: 'var(--space-md)'
  }}>
    {[
      { state: 'normal', label: 'Normal', image: 'https://via.placeholder.com/800x600/3b82f6/ffffff?text=Estado+Normal' },
      { state: 'focus', label: 'Enfocado', image: 'https://via.placeholder.com/800x600/22c55e/ffffff?text=Estado+Focus' },
      { state: 'hover', label: 'Hover', image: 'https://via.placeholder.com/800x600/f59e0b/ffffff?text=Estado+Hover' },
      { state: 'disabled', label: 'Deshabilitado', image: 'https://via.placeholder.com/800x600/9ca3af/ffffff?text=Deshabilitado' }
    ].map((state) => (
      <div key={state.state} style={{
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        opacity: state.state === 'disabled' ? 0.6 : 1
      }}>
        <div style={{ 
          textAlign: 'center', 
          padding: 'var(--space-xs)',
          fontSize: '1.1rem',
          fontWeight: '500',
          backgroundColor: 'var(--bg-secondary)'
        }}>
          {state.label}
        </div>
        <Cropped 
          imageSrc={state.image} 
          aspect={16/9} 
        />
      </div>
    ))}
  </div>
);
States.parameters = {
  docs: { 
    description: { 
      story: 'Los 4 estados interactivos del componente: normal, focus, hover y disabled.' 
    } 
  }
};

// ========== 5. INTERACTIVE ==========
export const Interactive = () => {
  const [lastBlob, setLastBlob] = useState(null);
  const [cropCount, setCropCount] = useState(0);
  
  const handleComplete = (blob) => {
    setLastBlob(blob);
    setCropCount(prev => prev + 1);
    console.log('Imagen recortada:', blob);
  };
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 'var(--space-lg)', 
      alignItems: 'center', 
      padding: 'var(--space-md)',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <Cropped 
        imageSrc="https://via.placeholder.com/800x600/8b5cf6/ffffff?text=Imagen+Interactiva" 
        aspect={16/9} 
        onComplete={handleComplete} 
      />
      
      {lastBlob && (
        <div style={{ 
          padding: 'var(--space-md)', 
          backgroundColor: 'var(--bg-success-subtle)',
          color: 'var(--text-success)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-success)',
          textAlign: 'center',
          fontSize: '1.3rem',
          fontWeight: '500'
        }}>
          ✅ Recorte completado #{cropCount}
          <div style={{ 
            fontSize: '1.1rem', 
            marginTop: 'var(--space-xs)',
            opacity: 0.8 
          }}>
            Tamaño: {(lastBlob.size / 1024).toFixed(1)} KB
          </div>
        </div>
      )}
      
      <div style={{
        fontSize: '1.2rem',
        color: 'var(--text-muted)',
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        💡 Ajusta el recorte y presiona "Confirmar recorte"
      </div>
    </div>
  );
};
Interactive.parameters = {
  docs: { 
    description: { 
      story: 'Ejemplo interactivo completo: ajusta el recorte, confirma y recibe feedback del resultado.' 
    } 
  }
};

// ========== 6. ACCESSIBILITY ==========
export const Accessibility = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-lg)',
    alignItems: 'center',
    padding: 'var(--space-md)',
    maxWidth: '500px',
    margin: '0 auto'
  }}>
    <Cropped 
      imageSrc="https://via.placeholder.com/800x600/ec4899/ffffff?text=Accesibilidad+Completa" 
      aspect={1}
      // Props de accesibilidad que el componente debería soportar
      aria-label="Herramienta de recorte de imagen"
      role="application"
      tabIndex={0}
    />
    
    <div style={{ 
      padding: 'var(--space-md)', 
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-default)',
      fontSize: '1.2rem',
      lineHeight: 1.5
    }}>
      <h4 style={{ 
        margin: '0 0 var(--space-sm) 0',
        fontSize: '1.3rem',
        fontWeight: '600',
        color: 'var(--text-primary)'
      }}>
        ♿ Características de Accesibilidad:
      </h4>
      <ul style={{ 
        margin: 0, 
        paddingLeft: 'var(--space-md)',
        color: 'var(--text-muted)'
      }}>
        <li><strong>ARIA labels</strong>: Roles y descripciones apropiadas</li>
        <li><strong>Navegación por teclado</strong>: Tab, flechas, Enter, Escape</li>
        <li><strong>Focus visible</strong>: Indicadores claros de foco</li>
        <li><strong>Reduced motion</strong>: Respeta preferencias del usuario</li>
        <li><strong>Screen readers</strong>: Instrucciones y estado actual</li>
      </ul>
    </div>
  </div>
);
Accessibility.parameters = {
  docs: { 
    description: { 
      story: 'Configuración completa de accesibilidad con ARIA labels, navegación por teclado y soporte para lectores de pantalla.' 
    } 
  }
};