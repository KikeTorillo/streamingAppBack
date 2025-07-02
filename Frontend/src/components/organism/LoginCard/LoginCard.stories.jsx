// components/organisms/LoginCard/LoginCard.stories.jsx
import React, { useState } from 'react';
import { LoginCard } from './LoginCard';
import './LoginCard.css';

export default {
  title: 'Components/Organism/LoginCard',
  component: LoginCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# LoginCard Organism

Componente de inicio de sesión que utiliza **Card**, **TextInput** y **Button** del sistema de diseño.
Proporciona validación, estados de carga y manejo completo del formulario de login.

## 🎯 Características

- **Integración completa**: Usa Card, TextInput y Button del sistema
- **Validación en tiempo real**: Validación al escribir y al perder foco
- **Estados de carga**: Loading automático durante autenticación
- **Mensajes de error**: Globales y por campo
- **Accesibilidad completa**: ARIA, navegación por teclado
- **Responsive**: Se adapta a móviles automáticamente

## 🔧 Uso básico

\`\`\`jsx
import { LoginCard } from './organisms/LoginCard';

<LoginCard
  onSubmit={(data) => {
    console.log('Login:', data);
    // { username: 'usuario', password: 'contraseña' }
  }}
  onForgotPassword={(username) => {
    console.log('Recuperar:', username);
  }}
  loading={isLoading}
  error={errorMessage}
/>
\`\`\`

## 📋 Props principales

- \`onSubmit\`: Función ejecutada con los datos del formulario
- \`onForgotPassword\`: Función para recuperar contraseña
- \`loading\`: Estado de carga
- \`error\`: Mensaje de error global
- \`size\`: Tamaño de los campos (xs, sm, md, lg, xl)
        `
      }
    }
  },
  argTypes: {
    loading: {
      name: 'Estado de carga',
      description: 'Si el formulario está procesando',
      control: 'boolean'
    },
    error: {
      name: 'Mensaje de error',
      description: 'Error global del formulario',
      control: 'text'
    },
    size: {
      name: 'Tamaño de campos',
      description: 'Tamaño de TextInput y Button',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl']
    },
    rounded: {
      name: 'Border radius',
      description: 'Radio de bordes',
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl']
    },
    showRegisterLink: {
      name: 'Mostrar enlace de registro',
      control: 'boolean'
    }
  }
};

// ========== EJEMPLOS ==========

export const Default = {
  args: {
    size: 'lg',
    rounded: 'lg',
    loading: false,
    showRegisterLink: true
  },
  parameters: {
    docs: {
      description: {
        story: 'LoginCard básico con todos los elementos estándar.'
      }
    }
  }
};

export const WithError = {
  args: {
    ...Default.args,
    error: 'Credenciales incorrectas. Verifica tu usuario y contraseña.'
  },
  parameters: {
    docs: {
      description: {
        story: 'LoginCard mostrando un mensaje de error global.'
      }
    }
  }
};

export const Loading = {
  args: {
    ...Default.args,
    loading: true
  },
  parameters: {
    docs: {
      description: {
        story: 'LoginCard en estado de carga durante autenticación.'
      }
    }
  }
};

export const Compact = {
  args: {
    size: 'sm',
    rounded: 'md',
    showRegisterLink: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Versión compacta para espacios reducidos.'
      }
    }
  }
};

// ========== EJEMPLO INTERACTIVO ==========

export const InteractiveExample = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data) => {
    setLoading(true);
    setError('');

    // Simular autenticación
    setTimeout(() => {
      if (data.username === 'admin' && data.password === 'password') {
        setLoading(false);
        alert('¡Login exitoso! 🎉');
      } else {
        setLoading(false);
        setError('Credenciales incorrectas. Prueba: admin / password');
      }
    }, 2000);
  };

  const handleForgotPassword = (username) => {
    alert(`Enviando email de recuperación a: ${username}`);
  };

  const handleRegisterClick = () => {
    alert('Redirigiendo a registro...');
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '60vh',
      backgroundColor: 'var(--bg-secondary)',
      padding: 'var(--space-lg)',
      borderRadius: 'var(--radius-lg)'
    }}>
      <LoginCard
        onSubmit={handleSubmit}
        onForgotPassword={handleForgotPassword}
        onRegisterClick={handleRegisterClick}
        loading={loading}
        error={error}
        showRegisterLink={true}
        size="lg"
        rounded="lg"
      />
    </div>
  );
};

InteractiveExample.parameters = {
  docs: {
    description: {
      story: 'Ejemplo completamente funcional. Prueba con: admin / password'
    }
  }
};

// ========== VARIANTES DE DISEÑO ==========

export const DesignVariants = () => (
  <div style={{ 
    display: 'grid', 
    gap: 'var(--space-xl)', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    padding: 'var(--space-lg)'
  }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Estilo Estándar
      </h4>
      <LoginCard
        size="md"
        rounded="lg"
        showRegisterLink={true}
      />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Estilo Redondeado
      </h4>
      <LoginCard
        size="md"
        rounded="xl"
        showRegisterLink={true}
      />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Estilo Compacto
      </h4>
      <LoginCard
        size="sm"
        rounded="md"
        showRegisterLink={false}
      />
    </div>
  </div>
);

DesignVariants.parameters = {
  docs: {
    description: {
      story: 'Diferentes variantes visuales del LoginCard.'
    }
  }
};

// ========== INTEGRACIÓN CON PÁGINA ==========

export const PageIntegration = () => (
  <div style={{ 
    minHeight: '100vh',
    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 'var(--space-lg)'
  }}>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-xl)'
    }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <h1 style={{ 
          fontSize: 'var(--font-size-4xl)', 
          fontWeight: 'var(--font-weight-bold)',
          margin: 0,
          marginBottom: 'var(--space-sm)'
        }}>
          Mi Aplicación
        </h1>
        <p style={{ 
          fontSize: 'var(--font-size-lg)', 
          margin: 0,
          opacity: 0.9
        }}>
          Inicia sesión para continuar
        </p>
      </div>
      
      <LoginCard
        onSubmit={(data) => {
          console.log('Login data:', data);
          alert('Login simulado');
        }}
        onForgotPassword={(username) => {
          console.log('Forgot password for:', username);
          alert('Recuperación simulada');
        }}
        onRegisterClick={() => {
          alert('Ir a registro');
        }}
        showRegisterLink={true}
        size="lg"
        rounded="xl"
      />
    </div>
  </div>
);

PageIntegration.parameters = {
  docs: {
    description: {
      story: 'Ejemplo de integración en una página completa de login.'
    }
  }
};