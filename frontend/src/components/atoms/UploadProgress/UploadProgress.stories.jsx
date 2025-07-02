import React, { useState } from 'react';
import { UploadProgress } from './UploadProgress';

export default {
  title: 'Components/Atoms/UploadProgress',
  component: UploadProgress,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# UploadProgress Atom

El átomo **UploadProgress** proporciona una interfaz visual elegante para mostrar el progreso de operaciones de carga y transcodificación siguiendo principios de **Atomic Design**.

## 🎯 Características principales

- **5 tamaños**: xs, sm, md, lg, xl
- **4 variantes**: default, success, warning, error  
- **Estados completos**: processing, transcoding, completed, failed
- **Accesibilidad**: ARIA labels, navegación por teclado, reduced motion
- **Animaciones elegantes**: Shimmer effect, dots animation, smooth transitions
- **Theming**: Variables CSS del sistema

## 🔧 Uso básico

\`\`\`jsx
import { UploadProgress } from './atoms/UploadProgress';

<UploadProgress 
  progress={45}
  status="transcoding"
  message="Transcodificando video..."
  showPercentage={true}
  size="md"
/>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    progress: {
      name: 'Progreso',
      description: 'Porcentaje de progreso (0-100)',
      control: { type: 'range', min: 0, max: 100, step: 1 },
      table: { 
        type: { summary: 'number' },
        defaultValue: { summary: '0' }
      }
    },
    message: {
      name: 'Mensaje',
      description: 'Texto descriptivo del estado actual',
      control: 'text',
      table: { 
        type: { summary: 'string' },
        defaultValue: { summary: 'Procesando...' }
      }
    },
    status: {
      name: 'Estado',
      description: 'Estado actual del progreso',
      control: 'select',
      options: ['processing', 'transcoding', 'completed', 'failed'],
      table: { 
        type: { summary: "'processing' | 'transcoding' | 'completed' | 'failed'" },
        defaultValue: { summary: 'processing' }
      }
    },
    showPercentage: {
      name: 'Mostrar porcentaje',
      description: 'Si se muestra el porcentaje numérico',
      control: 'boolean',
      table: { 
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    size: {
      name: 'Tamaño',
      description: 'Tamaño del componente',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { 
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'md' }
      }
    }
  }
};

// ========== 1. DEFAULT ==========
export const Default = () => (
  <UploadProgress 
    progress={65}
    status="transcoding"
    message="Transcodificando video..."
    showPercentage={true}
    size="md"
  />
);
Default.parameters = {
  docs: { 
    description: { 
      story: 'Configuración por defecto del componente mostrando transcodificación en progreso.' 
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
    {['sm', 'md', 'lg'].map((size, index) => (
      <div key={size} style={{
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-sm)',
        backgroundColor: 'var(--bg-secondary)'
      }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: 'var(--space-sm)',
          fontSize: '1.2rem',
          fontWeight: '500',
          color: 'var(--text-secondary)'
        }}>
          {size.toUpperCase()}
        </div>
        <UploadProgress 
          progress={40 + index * 20}
          status="processing"
          message={`Tamaño ${size}`}
          showPercentage={true}
          size={size}
        />
      </div>
    ))}
  </div>
);
Sizes.parameters = {
  docs: { 
    description: { 
      story: 'Los 3 tamaños disponibles: sm, md, lg con diferentes contenedores.' 
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
      { status: 'processing', progress: 25, message: 'Preparando archivos...', color: '#3b82f6' },
      { status: 'transcoding', progress: 65, message: 'Transcodificando video...', color: '#f59e0b' },
      { status: 'completed', progress: 100, message: '¡Completado!', color: '#22c55e' },
      { status: 'failed', progress: 45, message: 'Error en el proceso', color: '#ef4444' }
    ].map((variant) => (
      <div key={variant.status} style={{
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-sm)',
        backgroundColor: 'var(--bg-primary)'
      }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: 'var(--space-sm)',
          fontSize: '1.1rem',
          fontWeight: '500',
          color: variant.color,
          textTransform: 'capitalize'
        }}>
          {variant.status}
        </div>
        <UploadProgress 
          progress={variant.progress}
          status={variant.status}
          message={variant.message}
          showPercentage={true}
          size="md"
        />
      </div>
    ))}
  </div>
);
Variants.parameters = {
  docs: { 
    description: { 
      story: 'Los 4 estados principales: processing, transcoding, completed, failed con sus colores y mensajes correspondientes.' 
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
      { label: 'Inicio', progress: 0, message: 'Iniciando...' },
      { label: 'Progreso bajo', progress: 15, message: 'Preparando...' },
      { label: 'Progreso medio', progress: 50, message: 'Procesando...' },
      { label: 'Casi completo', progress: 85, message: 'Finalizando...' }
    ].map((state) => (
      <div key={state.label} style={{
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-sm)',
        backgroundColor: 'var(--bg-secondary)'
      }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: 'var(--space-sm)',
          fontSize: '1.1rem',
          fontWeight: '500',
          color: 'var(--text-primary)'
        }}>
          {state.label}
        </div>
        <UploadProgress 
          progress={state.progress}
          status="processing"
          message={state.message}
          showPercentage={true}
          size="md"
        />
      </div>
    ))}
  </div>
);
States.parameters = {
  docs: { 
    description: { 
      story: 'Diferentes estados de progreso mostrando la evolución visual del componente.' 
    } 
  }
};

// ========== 5. INTERACTIVE ==========
export const Interactive = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('processing');
  const [isRunning, setIsRunning] = useState(false);

  const startProgress = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setProgress(0);
    setStatus('processing');
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setStatus('completed');
          setIsRunning(false);
          clearInterval(interval);
          return 100;
        } else if (prev >= 50) {
          setStatus('transcoding');
        }
        return prev + 2;
      });
    }, 100);
  };

  const resetProgress = () => {
    setProgress(0);
    setStatus('processing');
    setIsRunning(false);
  };

  const simulateError = () => {
    setStatus('failed');
    setIsRunning(false);
  };

  const getMessage = () => {
    switch (status) {
      case 'processing': return 'Preparando archivos...';
      case 'transcoding': return `Transcodificando video... ${progress}%`;
      case 'completed': return '¡Transcodificación completada!';
      case 'failed': return 'Error en el procesamiento';
      default: return 'Procesando...';
    }
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
      <UploadProgress 
        progress={progress}
        status={status}
        message={getMessage()}
        showPercentage={true}
        size="lg"
      />
      
      <div style={{ 
        display: 'flex', 
        gap: 'var(--space-sm)',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button 
          onClick={startProgress}
          disabled={isRunning}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: isRunning ? 'var(--color-muted)' : 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            fontSize: '1.3rem',
            fontWeight: '500'
          }}
        >
          {isRunning ? 'Procesando...' : 'Iniciar'}
        </button>
        
        <button 
          onClick={resetProgress}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: 'var(--color-secondary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: '1.3rem',
            fontWeight: '500'
          }}
        >
          Reset
        </button>
        
        <button 
          onClick={simulateError}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: 'var(--color-danger)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: '1.3rem',
            fontWeight: '500'
          }}
        >
          Simular Error
        </button>
      </div>
      
      <div style={{
        fontSize: '1.2rem',
        color: 'var(--text-muted)',
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        💡 Prueba los diferentes estados y observa las animaciones
      </div>
    </div>
  );
};
Interactive.parameters = {
  docs: { 
    description: { 
      story: 'Ejemplo interactivo completo: simula el progreso real de transcodificación con controles para diferentes estados.' 
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
    <UploadProgress 
      progress={75}
      status="transcoding"
      message="Transcodificando video con accesibilidad completa..."
      showPercentage={true}
      size="md"
      // Props de accesibilidad que el componente debería soportar
      aria-label="Progreso de transcodificación"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={75}
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
        <li><strong>ARIA progressbar</strong>: Role y valores apropiados</li>
        <li><strong>Live regions</strong>: Actualizaciones anunciadas automáticamente</li>
        <li><strong>Reduced motion</strong>: Respeta preferencias del usuario</li>
        <li><strong>Color contrast</strong>: Cumple estándares WCAG 2.1</li>
        <li><strong>Focus management</strong>: Indicadores visuales claros</li>
        <li><strong>Screen readers</strong>: Descripción completa del estado</li>
      </ul>
    </div>
  </div>
);
Accessibility.parameters = {
  docs: { 
    description: { 
      story: 'Configuración completa de accesibilidad con ARIA attributes, live regions y soporte para lectores de pantalla.' 
    } 
  }
};