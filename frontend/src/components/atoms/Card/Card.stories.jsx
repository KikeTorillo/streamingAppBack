import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, CardTitle, CardSubtitle, CardDescription } from './Card';
import './Card.css';

export default {
  title: 'Components/Atoms/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Card Atom

El átomo **Card** es el contenedor base fundamental para agrupar y presentar contenido relacionado en nuestro sistema de diseño. 
Proporciona una superficie consistente, flexible y accesible que puede adaptarse a múltiples contextos y casos de uso.

## 🎯 Características principales

- **3 variantes visuales**: Default, Elevated, Outlined
- **6 tamaños de padding**: XS, SM, MD, LG, XL, 2XL
- **5 niveles de sombra**: SM, MD, LG, XL, None
- **5 opciones de border radius**: SM, MD, LG, XL, Full
- **Estados interactivos**: Hoverable, Clickable con micro-animaciones
- **Componentes auxiliares**: Header, Body, Footer, Title, Subtitle, Description
- **Accesibilidad completa**: ARIA roles, navegación por teclado, focus management
- **Loading state**: Efecto shimmer durante carga
- **Theming**: Variables CSS del sistema, modo oscuro automático

## 📱 Sistema de diseño

Optimizado para sistemas con \`html { font-size: 62.5% }\` donde \`1rem = 10px\`
Usa automáticamente todas las variables CSS del sistema de diseño.

## 🔧 Uso básico

\`\`\`jsx
import { Card, CardHeader, CardTitle, CardBody } from './atoms/Card';

// Card simple
<Card>
  <p>Contenido de la card</p>
</Card>

// Card estructurada
<Card variant="elevated" shadow="lg" rounded="xl">
  <CardHeader>
    <CardTitle>Mi Título</CardTitle>
    <CardSubtitle>Subtítulo opcional</CardSubtitle>
  </CardHeader>
  <CardBody>
    <CardDescription>
      Descripción del contenido de la card...
    </CardDescription>
  </CardBody>
  <CardFooter>
    <button>Acción</button>
  </CardFooter>
</Card>

// Card interactiva
<Card 
  clickable 
  onClick={handleClick}
  hoverable
  rounded="lg"
>
  <CardTitle>Card Clickeable</CardTitle>
  <CardDescription>Haz click en mí</CardDescription>
</Card>
\`\`\`

## 🎨 Variables CSS del sistema

Usa automáticamente las variables del sistema de diseño:
\`\`\`css
:root {
  --bg-primary: #ffffff;
  --text-primary: #111827;
  --border-default: #d1d5db;
  --border-focus: #3b82f6;
  --shadow-sm: 0 0.1rem 0.2rem 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 0.4rem 0.6rem -0.1rem rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 1rem 1.5rem -0.3rem rgba(0, 0, 0, 0.1);
  --space-xs: 0.4rem;
  --space-sm: 0.8rem;
  --space-md: 1.6rem;
  --space-lg: 2.4rem;
  --space-xl: 3.2rem;
  --space-2xl: 4.8rem;
  --space-3xl: 6.4rem;
  --radius-sm: 0.4rem;
  --radius-md: 0.6rem;
  --radius-lg: 0.8rem;
  --radius-xl: 1.2rem;
  --transition-normal: 0.2s ease-in-out;
  /* Y todas las demás del sistema... */
}
\`\`\`

## ♿ Accesibilidad

- **ARIA roles**: Se asigna automáticamente \`role="button"\` para cards clickeables
- **Navegación por teclado**: Soporte para Enter y Space en cards interactivas
- **Focus management**: Outline visible y estados de focus bien definidos
- **Semántica**: Estructura correcta con headers, títulos y descripciones
- **Área táctil**: Mínimo 44px en móviles para cards clickeables

## 🏗️ Atomic Design

Como **átomo**, Card es:
- ✅ **Reutilizable**: Se puede usar en cualquier contexto
- ✅ **Sin dependencias**: No depende de otros componentes del sistema
- ✅ **Propósito único**: Contenedor base con estilos consistentes
- ✅ **Altamente configurable**: Múltiples props para personalización
        `
      }
    }
  },
  argTypes: {
    variant: {
      name: 'Variante',
      description: 'Estilo visual de la card',
      control: 'select',
      options: ['default', 'elevated', 'outlined'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' }
      }
    },
    padding: {
      name: 'Padding',
      description: 'Espaciado interno de la card',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'lg' }
      }
    },
    shadow: {
      name: 'Sombra',
      description: 'Nivel de sombra de la card',
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' }
      }
    },
    rounded: {
      name: 'Border Radius',
      description: 'Curvatura de las esquinas',
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'lg' }
      }
    },
    hoverable: {
      name: 'Hoverable',
      description: 'Activa efectos hover sin ser clickeable',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    clickable: {
      name: 'Clickeable',
      description: 'Hace la card interactiva (alternativa a onClick)',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    fullWidth: {
      name: 'Ancho completo',
      description: 'La card ocupa todo el ancho disponible',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    loading: {
      name: 'Cargando',
      description: 'Muestra efecto shimmer de carga',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    maxWidth: {
      name: 'Ancho máximo',
      description: 'Ancho máximo de la card (CSS value)',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    onClick: {
      name: 'Función onClick',
      description: 'Función a ejecutar al hacer clic',
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

// Template base
const Template = (args) => <Card {...args} />;

// ========== HISTORIAS PRINCIPALES ==========

export const Playground = Template.bind({});
Playground.args = {
  children: 'Personaliza la card usando los controles de abajo',
  variant: 'default',
  padding: 'lg',
  shadow: 'md',
  rounded: 'lg'
};
Playground.parameters = {
  docs: {
    description: {
      story: 'Usa los controles para experimentar con todas las opciones de la Card. Prueba diferentes combinaciones de variantes, padding, sombras y border radius.'
    }
  }
};

// ========== VARIANTES VISUALES ==========

export const AllVariants = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    padding: 'var(--space-md)'
  }}>
    <Card variant="default">
      <CardTitle>Default</CardTitle>
      <CardDescription>Card con estilo por defecto, sombra sutil y fondo limpio.</CardDescription>
    </Card>
    
    <Card variant="elevated">
      <CardTitle>Elevated</CardTitle>
      <CardDescription>Card elevada con sombra más pronunciada para destacar contenido importante.</CardDescription>
    </Card>
    
    <Card variant="outlined">
      <CardTitle>Outlined</CardTitle>
      <CardDescription>Card con borde visible, sin sombra. Ideal para layouts minimalistas.</CardDescription>
    </Card>
  </div>
);
AllVariants.parameters = {
  docs: {
    description: {
      story: 'Las tres variantes principales de Card: Default (sombra estándar), Elevated (sombra pronunciada) y Outlined (con borde, sin sombra).'
    }
  }
};

// ========== TAMAÑOS DE PADDING ==========

export const PaddingSizes = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    padding: 'var(--space-md)'
  }}>
    <Card padding="xs" shadow="sm">
      <CardTitle as="h4">XS</CardTitle>
      <CardDescription>Padding extra pequeño (8px)</CardDescription>
    </Card>
    
    <Card padding="sm" shadow="sm">
      <CardTitle as="h4">SM</CardTitle>
      <CardDescription>Padding pequeño (16px)</CardDescription>
    </Card>
    
    <Card padding="md" shadow="sm">
      <CardTitle as="h4">MD</CardTitle>
      <CardDescription>Padding mediano (24px)</CardDescription>
    </Card>
    
    <Card padding="lg" shadow="sm">
      <CardTitle as="h4">LG</CardTitle>
      <CardDescription>Padding grande (32px)</CardDescription>
    </Card>
    
    <Card padding="xl" shadow="sm">
      <CardTitle as="h4">XL</CardTitle>
      <CardDescription>Padding extra grande (48px)</CardDescription>
    </Card>
    
    <Card padding="2xl" shadow="sm">
      <CardTitle as="h4">2XL</CardTitle>
      <CardDescription>Padding máximo (64px)</CardDescription>
    </Card>
  </div>
);
PaddingSizes.parameters = {
  docs: {
    description: {
      story: 'Diferentes tamaños de padding interno usando las variables de espaciado del sistema de diseño.'
    }
  }
};

// ========== NIVELES DE SOMBRA ==========

export const ShadowLevels = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-xl)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    padding: 'var(--space-xl)',
    backgroundColor: 'var(--bg-secondary)'
  }}>
    <Card shadow="none">
      <CardTitle as="h4">None</CardTitle>
      <CardDescription>Sin sombra</CardDescription>
    </Card>
    
    <Card shadow="sm">
      <CardTitle as="h4">Small</CardTitle>
      <CardDescription>Sombra sutil</CardDescription>
    </Card>
    
    <Card shadow="md">
      <CardTitle as="h4">Medium</CardTitle>
      <CardDescription>Sombra estándar</CardDescription>
    </Card>
    
    <Card shadow="lg">
      <CardTitle as="h4">Large</CardTitle>
      <CardDescription>Sombra pronunciada</CardDescription>
    </Card>
    
    <Card shadow="xl">
      <CardTitle as="h4">Extra Large</CardTitle>
      <CardDescription>Sombra máxima</CardDescription>
    </Card>
  </div>
);
ShadowLevels.parameters = {
  docs: {
    description: {
      story: 'Diferentes niveles de sombra usando las variables del sistema de diseño. Prueba cambiar el fondo en Storybook para ver mejor las diferencias.'
    }
  }
};

// ========== BORDER RADIUS ==========

export const BorderRadius = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    padding: 'var(--space-md)'
  }}>
    <Card rounded="sm">
      <CardTitle as="h4">Small</CardTitle>
      <CardDescription>Radio pequeño (4px)</CardDescription>
    </Card>
    
    <Card rounded="md">
      <CardTitle as="h4">Medium</CardTitle>
      <CardDescription>Radio mediano (6px)</CardDescription>
    </Card>
    
    <Card rounded="lg">
      <CardTitle as="h4">Large</CardTitle>
      <CardDescription>Radio grande (8px)</CardDescription>
    </Card>
    
    <Card rounded="xl">
      <CardTitle as="h4">Extra Large</CardTitle>
      <CardDescription>Radio extra grande (12px)</CardDescription>
    </Card>
    
    <Card rounded="full">
      <CardTitle as="h4">Full</CardTitle>
      <CardDescription>Radio completo (pill shape)</CardDescription>
    </Card>
  </div>
);
BorderRadius.parameters = {
  docs: {
    description: {
      story: 'Diferentes opciones de border radius usando las variables del sistema de diseño.'
    }
  }
};

// ========== ESTADOS INTERACTIVOS ==========

export const InteractiveStates = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    padding: 'var(--space-md)'
  }}>
    <Card>
      <CardTitle>Normal</CardTitle>
      <CardDescription>Card estática sin interactividad</CardDescription>
    </Card>
    
    <Card hoverable>
      <CardTitle>Hoverable</CardTitle>
      <CardDescription>Card con efectos hover (pasa el mouse por encima)</CardDescription>
    </Card>
    
    <Card clickable onClick={() => alert('¡Card clickeada!')}>
      <CardTitle>Clickeable</CardTitle>
      <CardDescription>Card interactiva con onClick. Haz click o presiona Enter/Space</CardDescription>
    </Card>
  </div>
);
InteractiveStates.parameters = {
  docs: {
    description: {
      story: 'Estados interactivos de Card. Hoverable añade efectos visuales, clickable añade funcionalidad y accesibilidad completa.'
    }
  }
};

// ========== ESTRUCTURA COMPLETA ==========

export const StructuredCard = () => (
  <Card maxWidth="400px" variant="elevated" shadow="lg">
    <CardHeader>
      <CardTitle>Producto Destacado</CardTitle>
      <CardSubtitle>Categoría: Electrónicos</CardSubtitle>
    </CardHeader>
    
    <CardBody>
      <CardDescription>
        Este es un ejemplo de card completamente estructurada usando todos los componentes auxiliares disponibles. 
        Ideal para mostrar información organizada y jerárquica.
      </CardDescription>
    </CardBody>
    
    <CardFooter>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ 
          fontSize: 'var(--font-size-lg)', 
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-primary)'
        }}>
          $299.99
        </span>
        <button style={{
          padding: 'var(--space-sm) var(--space-md)',
          backgroundColor: 'var(--color-primary)',
          color: 'var(--text-on-primary)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer'
        }}>
          Comprar
        </button>
      </div>
    </CardFooter>
  </Card>
);
StructuredCard.parameters = {
  docs: {
    description: {
      story: 'Ejemplo de card con estructura completa usando CardHeader, CardBody, CardFooter y todos los elementos auxiliares.'
    }
  }
};

// ========== CASOS DE USO COMUNES ==========

export const UseCases = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-xl)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    padding: 'var(--space-md)'
  }}>
    {/* Card de perfil */}
    <Card variant="elevated" padding="xl">
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: 'var(--color-primary)',
          borderRadius: 'var(--radius-full)',
          margin: '0 auto var(--space-md) auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem'
        }}>
          👤
        </div>
        <CardTitle>Ana García</CardTitle>
        <CardSubtitle>Desarrolladora Frontend</CardSubtitle>
        <CardDescription>
          Especialista en React y sistemas de diseño. 5 años de experiencia creando interfaces modernas.
        </CardDescription>
      </div>
    </Card>

    {/* Card de notificación */}
    <Card variant="outlined" padding="lg" rounded="xl">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: 'var(--color-success-light)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          ✅
        </div>
        <div>
          <CardTitle as="h4">Tarea completada</CardTitle>
          <CardDescription>
            El reporte mensual ha sido generado exitosamente y enviado al equipo.
          </CardDescription>
          <small style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)' }}>
            Hace 2 minutos
          </small>
        </div>
      </div>
    </Card>

    {/* Card de estadística */}
    <Card hoverable padding="lg">
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: 'var(--font-size-4xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-primary)',
          lineHeight: '1'
        }}>
          1,234
        </div>
        <CardTitle as="h4" style={{ margin: 'var(--space-sm) 0 0 0' }}>Usuarios Activos</CardTitle>
        <CardDescription>
          <span style={{ color: 'var(--color-success)' }}>↑ +12%</span> vs mes anterior
        </CardDescription>
      </div>
    </Card>
  </div>
);
UseCases.parameters = {
  docs: {
    description: {
      story: 'Casos de uso comunes: tarjeta de perfil, notificación y estadística. Cada una muestra diferentes patrones de contenido y diseño.'
    }
  }
};

// ========== LOADING STATE ==========

export const LoadingState = () => {
  const [isLoading, setIsLoading] = useState(false);

  const toggleLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <div style={{
      display: 'grid',
      gap: 'var(--space-lg)',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      padding: 'var(--space-md)'
    }}>
      <Card loading={isLoading}>
        <CardTitle>Card con Loading</CardTitle>
        <CardDescription>
          Esta card muestra el efecto shimmer durante la carga. El contenido permanece visible pero con overlay animado.
        </CardDescription>
        <CardFooter>
          <button 
            onClick={toggleLoading}
            style={{
              padding: 'var(--space-sm) var(--space-md)',
              backgroundColor: 'var(--color-primary)',
              color: 'var(--text-on-primary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer'
            }}
          >
            {isLoading ? 'Cargando...' : 'Activar Loading'}
          </button>
        </CardFooter>
      </Card>

      <Card>
        <CardTitle>Card Normal</CardTitle>
        <CardDescription>
          Esta card permanece normal para comparar con el estado de loading. Observa la diferencia en los efectos visuales.
        </CardDescription>
      </Card>
    </div>
  );
};
LoadingState.parameters = {
  docs: {
    description: {
      story: 'Estado de carga con efecto shimmer animado. Útil para indicar que el contenido de la card está siendo actualizado.'
    }
  }
};

// ========== RESPONSIVE ==========

export const ResponsiveExample = () => (
  <div style={{
    display: 'flex',
    gap: 'var(--space-lg)',
    flexDirection: 'column'
  }}>
    <p style={{
      fontSize: 'var(--font-size-base)',
      color: 'var(--text-muted)',
      margin: 0,
      textAlign: 'center'
    }}>
      Redimensiona la ventana para ver el comportamiento responsive:
    </p>
    
    <div style={{
      display: 'grid',
      gap: 'var(--space-lg)',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
    }}>
      <Card padding="xl">
        <CardTitle>Padding Adaptativo</CardTitle>
        <CardDescription>
          En móviles, el padding XL se reduce automáticamente para mejor aprovechamiento del espacio.
        </CardDescription>
      </Card>
      
      <Card clickable onClick={() => alert('¡Funciona en móvil!')}>
        <CardTitle>Área Táctil</CardTitle>
        <CardDescription>
          Las cards clickeables mantienen un área táctil mínima de 44px en dispositivos móviles.
        </CardDescription>
      </Card>
      
      <Card hoverable>
        <CardTitle>Hover Inteligente</CardTitle>
        <CardDescription>
          Los efectos hover se desactivan automáticamente en dispositivos táctiles para mejor UX.
        </CardDescription>
      </Card>
    </div>
    
    <p style={{
      fontSize: 'var(--font-size-sm)',
      color: 'var(--text-muted)',
      margin: 0,
      fontStyle: 'italic',
      textAlign: 'center'
    }}>
      En móviles (&lt;768px): padding reducido, hover desactivado, área táctil optimizada
    </p>
  </div>
);

ResponsiveExample.parameters = {
  docs: {
    description: {
      story: 'Comportamiento responsive automático: padding adaptativo, área táctil optimizada y hover inteligente según el dispositivo.'
    }
  }
};

// ========== MODO OSCURO ==========

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
      <Card variant="default">
        <CardTitle>Default Dark</CardTitle>
        <CardDescription>Card con variante default en modo oscuro con sombras ajustadas.</CardDescription>
      </Card>
      
      <Card variant="elevated">
        <CardTitle>Elevated Dark</CardTitle>
        <CardDescription>Card elevada en modo oscuro con mayor contraste en las sombras.</CardDescription>
      </Card>
      
      <Card variant="outlined">
        <CardTitle>Outlined Dark</CardTitle>
        <CardDescription>Card con borde que se adapta automáticamente a los colores del modo oscuro.</CardDescription>
      </Card>
      
      <Card clickable onClick={() => alert('¡Click en modo oscuro!')}>
        <CardTitle>Interactive Dark</CardTitle>
        <CardDescription>Card interactiva con efectos hover y focus optimizados para modo oscuro.</CardDescription>
      </Card>
    </div>
  </div>
);
DarkModeExample.parameters = {
  docs: {
    description: {
      story: 'Todas las variantes de Card funcionan automáticamente en modo oscuro usando la clase .dark y las variables CSS del sistema.'
    }
  }
};

// ========== ACCESIBILIDAD ==========

export const AccessibilityExample = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    padding: 'var(--space-md)'
  }}>
    <Card 
      clickable 
      onClick={() => alert('Card accesible clickeada')}
      ariaLabel="Tarjeta de producto interactiva"
    >
      <CardTitle>Card Clickeable</CardTitle>
      <CardDescription>
        Esta card es completamente accesible: role="button", navegación por teclado, aria-label descriptivo.
      </CardDescription>
      <small style={{ color: 'var(--text-muted)' }}>
        Prueba con Tab + Enter/Space
      </small>
    </Card>

    <Card tabIndex={0} role="region" ariaLabel="Información del usuario">
      <CardTitle>Card Semántica</CardTitle>
      <CardDescription>
        Card con role="region" personalizado y navegable por teclado para contenido importante.
      </CardDescription>
      <small style={{ color: 'var(--text-muted)' }}>
        Estructurada semánticamente
      </small>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle as="h2">Card Estructurada</CardTitle>
        <CardSubtitle>Con jerarquía semántica</CardSubtitle>
      </CardHeader>
      <CardBody>
        <CardDescription>
          Usa elementos semánticos correctos (h2, p) para una estructura accesible.
        </CardDescription>
      </CardBody>
    </Card>
  </div>
);
AccessibilityExample.parameters = {
  docs: {
    description: {
      story: 'Ejemplos de accesibilidad: navegación por teclado, ARIA labels, roles semánticos y estructura jerárquica correcta.'
    }
  }
};