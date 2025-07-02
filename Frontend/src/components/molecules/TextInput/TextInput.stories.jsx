import React, { useState } from 'react';
import { TextInput } from './TextInput';
import './TextInput.css';

export default {
  title: 'Components/Molecules/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# TextInput Component

Campo de entrada de texto avanzado que **extiende el átomo Input mejorado** siguiendo principios de **Atomic Design**. 
Añade funcionalidades como etiquetas, iconos, validación y mensajes de ayuda manteniendo total consistencia con el sistema de diseño.

## 🎯 Características principales

- **Basado en Input mejorado**: Reutiliza TODAS las mejoras del átomo (variantes semánticas, border radius, responsive, etc.)
- **4 variantes visuales**: Default, Success, Warning, Error
- **5 tamaños responsive**: XS, SM, MD, LG, XL (heredados del átomo)
- **Estados completos**: Normal, Focus, Hover, Disabled, Read-only (heredados del átomo)
- **Iconos interactivos**: Emojis, clases CSS, componentes React con click handlers
- **Validación avanzada**: Mensajes de error, ayuda, contador inteligente de caracteres
- **Accesibilidad completa**: ARIA attributes, labels asociados, live regions
- **Theming automático**: Variables CSS del sistema, modo oscuro nativo
- **Mobile-first**: Área táctil de 44px, optimización iOS

## 🏗️ Arquitectura Atomic Design

\`\`\`
TextInput (Molécula) 🧬
├── Label (elemento)
├── Container
│   ├── LeftIcon (elemento + clickeable)
│   ├── Input (Átomo mejorado) ⚛️ ← Reutiliza todas las mejoras
│   └── RightIcon (elemento + clickeable)
└── Footer
    ├── Messages (helper/error con live regions)
    └── CharCounter (inteligente con estados)
\`\`\`

## 📱 Sistema de diseño

Optimizado para sistemas con \`html { font-size: 62.5% }\` donde \`1rem = 10px\`
Usa automáticamente TODAS las variables CSS del sistema de diseño actualizado.

## 🔧 Uso básico

\`\`\`jsx
import { TextInput } from './molecules/TextInput';

// Uso simple (hereda TODAS las mejoras del átomo Input)
<TextInput 
  placeholder="Escribe aquí..."
  onChange={handleChange}
/>

// Con variantes semánticas del átomo
<TextInput 
  variant="success"
  rounded="lg"
  placeholder="Campo exitoso"
/>

// Campo completo con todas las funcionalidades
<TextInput 
  label="Correo electrónico"
  type="email"
  placeholder="usuario@ejemplo.com"
  value={email}
  onChange={handleEmailChange}
  required
  errorText={emailError}
  helperText="Te enviaremos confirmaciones a este correo"
  leftIcon="📧"
  rightIcon="✅"
  onRightIconClick={validateEmail}
  maxLength={50}
  showCharCount
  variant="success"
  rounded="xl"
  autoComplete="email"
/>
\`\`\`

## 🎨 Variables CSS del sistema

El componente usa automáticamente las mismas variables que el átomo Input mejorado:

\`\`\`css
:root {
  /* Variables heredadas del átomo Input mejorado */
  --text-primary: #111827;
  --text-muted: #6b7280;
  --text-placeholder: #9ca3af;
  --bg-primary: #ffffff;
  --bg-hover: #f9fafb;
  --border-default: #d1d5db;
  --border-focus: #3b82f6;
  --color-danger: #ef4444;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger-light: #fef2f2;
  --color-success-light: #f0fdf4;
  --color-warning-light: #fefce8;
  --radius-sm: 0.4rem;
  --radius-md: 0.6rem;
  --radius-lg: 0.8rem;
  --radius-xl: 1.2rem;
  --radius-full: 9999px;
  --space-xs: 0.4rem;
  --space-sm: 0.8rem;
  --space-md: 1.6rem;
  --space-lg: 2.4rem;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --transition-normal: 0.2s ease-in-out;
  /* Y todas las demás del sistema... */
}
\`\`\`

## 🎯 Características del componente

**Como molécula en Atomic Design:**
- **Hereda del átomo Input**: Variantes semánticas (error, success, warning), border radius personalizable, responsive con área táctil, validación HTML5, modo oscuro automático
- **Añade funcionalidades de molécula**: Label dinámico que cambia color según estado, iconos bidireccionales interactivos, mensajes con live regions, contador inteligente de caracteres

**Casos de uso ideales:**
- Formularios complejos que requieren validación visual
- Campos con iconos interactivos (búsqueda, toggle password, validación)
- Interfaces que necesitan feedback inmediato al usuario
- Aplicaciones con modo oscuro automático

## ♿ Accesibilidad mejorada

- **ARIA live regions**: Mensajes de error anunciados automáticamente
- **Labels dinámicos**: Cambian color según estado/foco
- **Iconos accesibles**: \`aria-hidden\`, roles y navegación por teclado
- **Área táctil**: Mínimo 44px en móviles para iconos clickeables
- **Focus management**: Estados heredados y mejorados del átomo Input
- **Screen reader**: Descripciones contextuales completas

## 🎭 Herencia del átomo Input

TextInput hereda automáticamente todas las mejoras del átomo Input:
- ✅ Variantes semánticas (error, success, warning)
- ✅ Border radius personalizable
- ✅ Estados hover/focus mejorados
- ✅ Responsive con área táctil
- ✅ Validación HTML5 
- ✅ Modo oscuro automático
- ✅ Performance optimizations
        `
      }
    }
  },
  argTypes: {
    placeholder: {
      name: 'Placeholder',
      description: 'Texto de ayuda mostrado cuando el campo está vacío (heredado del átomo Input mejorado)',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    value: {
      name: 'Valor',
      description: 'Valor controlado del input (heredado del átomo Input)',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    type: {
      name: 'Tipo',
      description: 'Tipo de input HTML (heredado del átomo Input mejorado)',
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time', 'datetime-local'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'text'" }
      }
    },
    size: {
      name: 'Tamaño',
      description: 'Tamaño del input (heredado del átomo Input con responsive)',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'md'" }
      }
    },
    variant: {
      name: 'Variante',
      description: 'Estilo visual del input (usando las variantes del átomo Input mejorado)',
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'default'" }
      }
    },
    rounded: {
      name: 'Radio de bordes',
      description: 'Curvatura de las esquinas (heredado del átomo Input mejorado)',
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'md'" }
      }
    },
    label: {
      name: 'Etiqueta',
      description: 'Etiqueta descriptiva del campo (añadida por TextInput)',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    helperText: {
      name: 'Texto de ayuda',
      description: 'Texto informativo debajo del input (añadido por TextInput)',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    errorText: {
      name: 'Mensaje de error',
      description: 'Mensaje de error con live regions (sobrescribe variant y helperText)',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    leftIcon: {
      name: 'Icono izquierdo',
      description: 'Icono a mostrar a la izquierda (ahora clickeable)',
      control: 'text',
      table: {
        type: { summary: 'string | ReactNode' }
      }
    },
    rightIcon: {
      name: 'Icono derecho',
      description: 'Icono a mostrar a la derecha (clickeable)',
      control: 'text',
      table: {
        type: { summary: 'string | ReactNode' }
      }
    },
    disabled: {
      name: 'Deshabilitado',
      description: 'Deshabilita el input (heredado del átomo Input)',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    readOnly: {
      name: 'Solo lectura',
      description: 'Campo de solo lectura (heredado del átomo Input mejorado)',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    required: {
      name: 'Requerido',
      description: 'Marca el campo como obligatorio (validación HTML5 heredada)',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    fullWidth: {
      name: 'Ancho completo',
      description: 'El input ocupa todo el ancho del contenedor',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    compact: {
      name: 'Compacto',
      description: 'Versión compacta con spacing reducido (heredado del átomo)',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    maxLength: {
      name: 'Longitud máxima',
      description: 'Número máximo de caracteres (heredado del átomo Input)',
      control: 'number',
      table: {
        type: { summary: 'number' }
      }
    },
    showCharCount: {
      name: 'Mostrar contador',
      description: 'Muestra contador inteligente de caracteres con animaciones',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    autoComplete: {
      name: 'Auto Complete',
      description: 'Valor para autocompletado del navegador (heredado del átomo)',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    onChange: { 
      name: 'Función onChange',
      description: 'Función a ejecutar cuando cambia el valor (heredado del átomo Input)',
      action: 'changed',
      table: {
        type: { summary: 'function' }
      }
    },
    onRightIconClick: { 
      name: 'Click icono derecho',
      description: 'Función a ejecutar al hacer click en el icono derecho',
      action: 'rightIconClicked',
      table: {
        type: { summary: 'function' }
      }
    },
    onLeftIconClick: { 
      name: 'Click icono izquierdo',
      description: 'Función a ejecutar al hacer click en el icono izquierdo (NUEVO)',
      action: 'leftIconClicked',
      table: {
        type: { summary: 'function' }
      }
    },
    className: {
      name: 'Clases CSS',
      description: 'Clases CSS adicionales para personalización',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    }
  }
};

// Template base con estado
const Template = (args) => {
  const [value, setValue] = useState(args.value || '');
  
  const handleChange = (e) => {
    setValue(e.target.value);
    args.onChange?.(e);
  };

  return (
    <TextInput 
      {...args} 
      value={value} 
      onChange={handleChange} 
    />
  );
};

// ========== HISTORIAS PRINCIPALES ==========

export const Playground = Template.bind({});
Playground.args = {
  placeholder: 'Personalízame...',
  label: 'Campo personalizable',
  size: 'md',
  variant: 'default',
  rounded: 'md'
};
Playground.parameters = {
  docs: {
    description: {
      story: 'Usa los controles de abajo para experimentar con todas las opciones del TextInput mejorado. Este componente hereda automáticamente todas las mejoras del átomo Input.'
    }
  }
};

// ========== HERENCIA DEL ÁTOMO INPUT ==========

export const ComponentArchitecture = () => (
  <div style={{ 
    maxWidth: '500px',
    margin: '0 auto'
  }}>
    <TextInput
      label="TextInput - Molécula completa"
      placeholder="Heredando capacidades del átomo Input"
      leftIcon="⚛️"
      rightIcon="🧬"
      helperText="Combinando átomo base + funcionalidades de molécula"
      maxLength={60}
      showCharCount
      variant="success"
      rounded="lg"
      onRightIconClick={() => alert('¡Arquitectura Atomic Design!')}
    />
    <div style={{ 
      marginTop: '2rem', 
      padding: '1.6rem', 
      backgroundColor: 'var(--bg-secondary)', 
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-default)'
    }}>
      <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.4rem', fontWeight: '600', color: 'var(--text-primary)' }}>
        Arquitectura Atomic Design:
      </h4>
      <p style={{ margin: '0', fontSize: '1.3rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
        <strong>⚛️ Hereda del átomo Input</strong>: Variantes semánticas, border radius, responsive, validación HTML5, modo oscuro<br/>
        <strong>🧬 Añade como molécula</strong>: Label dinámico, iconos interactivos, mensajes con live regions, contador inteligente
      </p>
    </div>
  </div>
);
ComponentArchitecture.parameters = {
  docs: {
    description: {
      story: 'TextInput sigue perfectamente Atomic Design: hereda automáticamente todas las capacidades del átomo Input y añade funcionalidades de molécula.'
    }
  }
};

// ========== VARIANTES HEREDADAS ==========

export const InheritedVariants = () => {
  const [values, setValues] = useState({
    default: '',
    success: 'correo@valido.com',
    warning: 'usuario',
    error: 'email-invalido'
  });

  const handleChange = (variant) => (e) => {
    setValues(prev => ({ ...prev, [variant]: e.target.value }));
  };

  return (
    <div style={{ 
      display: 'grid', 
      gap: '2.4rem', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
    }}>
      <TextInput
        label="Default (heredado del átomo)"
        placeholder="Estado normal del átomo Input"
        variant="default"
        rounded="md"
        value={values.default}
        onChange={handleChange('default')}
        helperText="Usa las mismas variables CSS del sistema"
        leftIcon="📝"
      />
      <TextInput
        label="Success (heredado del átomo)"
        placeholder="Variante success del átomo"
        variant="success"
        rounded="lg"
        value={values.success}
        onChange={handleChange('success')}
        helperText="Background y border del átomo Input mejorado"
        leftIcon="✅"
      />
      <TextInput
        label="Warning (heredado del átomo)"
        placeholder="Variante warning del átomo"
        variant="warning"
        rounded="xl"
        value={values.warning}
        onChange={handleChange('warning')}
        helperText="Colores y estados heredados automáticamente"
        leftIcon="⚠️"
      />
      <TextInput
        label="Error (heredado del átomo)"
        placeholder="Variante error del átomo"
        variant="error"
        rounded="full"
        value={values.error}
        onChange={handleChange('error')}
        errorText="Mensaje de error con live regions de TextInput"
        leftIcon="❌"
      />
    </div>
  );
};
InheritedVariants.parameters = {
  docs: {
    description: {
      story: 'Todas las variantes y border radius son heredadas directamente del átomo Input mejorado. TextInput solo añade la funcionalidad de labels, iconos y mensajes.'
    }
  }
};

// ========== BORDER RADIUS HEREDADO ==========

export const InheritedBorderRadius = () => (
  <div style={{
    display: 'flex',
    gap: '1.6rem',
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
    <TextInput rounded="sm" placeholder="Small" label="Border Radius SM" leftIcon="📐" />
    <TextInput rounded="md" placeholder="Medium (default)" label="Border Radius MD" leftIcon="📐" />
    <TextInput rounded="lg" placeholder="Large" label="Border Radius LG" leftIcon="📐" />
    <TextInput rounded="xl" placeholder="Extra Large" label="Border Radius XL" leftIcon="📐" />
    <TextInput rounded="full" placeholder="Full" label="Border Radius Full" leftIcon="📐" />
  </div>
);
InheritedBorderRadius.parameters = {
  docs: {
    description: {
      story: 'Todas las opciones de border radius son heredadas del átomo Input mejorado sin modificación.'
    }
  }
};

// ========== ICONOS CLICKEABLES MEJORADOS ==========

export const ClickableIcons = () => {
  const [values, setValues] = useState({
    search: '',
    password: '',
    validation: '',
    both: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleChange = (key) => (e) => {
    setValues(prev => ({ ...prev, [key]: e.target.value }));
  };

  const handleSearch = () => {
    alert(`Buscando: "${values.search}"`);
  };

  const handleClearSearch = () => {
    setValues(prev => ({ ...prev, search: '' }));
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const validateField = async () => {
    setIsValidating(true);
    // Simular validación
    setTimeout(() => {
      setIsValidating(false);
      alert('Campo validado correctamente');
    }, 1500);
  };

  const handleBothIcons = (side) => {
    alert(`Click en icono ${side}`);
  };

  return (
    <div style={{ 
      display: 'grid', 
      gap: '2rem',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
    }}>
      <TextInput
        label="Búsqueda con iconos dinámicos"
        placeholder="Buscar productos..."
        leftIcon="🔍"
        rightIcon={values.search ? "❌" : "🎯"}
        value={values.search}
        onChange={handleChange('search')}
        onLeftIconClick={handleSearch}
        onRightIconClick={values.search ? handleClearSearch : undefined}
        helperText="Click en la lupa para buscar, en la X para limpiar"
        variant={values.search ? 'success' : 'default'}
      />
      
      <TextInput
        type={showPassword ? 'text' : 'password'}
        label="Contraseña con toggle"
        placeholder="Tu contraseña segura"
        leftIcon="🔒"
        rightIcon={showPassword ? "🙈" : "👁️"}
        value={values.password}
        onChange={handleChange('password')}
        onRightIconClick={togglePassword}
        helperText="Click en el ojo para mostrar/ocultar"
        variant={values.password.length >= 8 ? 'success' : 'default'}
      />
      
      <TextInput
        label="Validación en tiempo real"
        placeholder="Email para validar"
        leftIcon="📧"
        rightIcon={isValidating ? "⏳" : "✅"}
        value={values.validation}
        onChange={handleChange('validation')}
        onRightIconClick={validateField}
        helperText={isValidating ? "Validando..." : "Click en ✅ para validar"}
        variant={values.validation.includes('@') ? 'success' : 'default'}
        className={isValidating ? 'text-input__icon--loading' : ''}
      />
      
      <TextInput
        label="Ambos iconos clickeables"
        placeholder="Click en cualquier icono"
        leftIcon="👈"
        rightIcon="👉"
        value={values.both}
        onChange={handleChange('both')}
        onLeftIconClick={() => handleBothIcons('izquierdo')}
        onRightIconClick={() => handleBothIcons('derecho')}
        helperText="Ambos iconos son interactivos"
        variant="warning"
        rounded="lg"
      />
    </div>
  );
};
ClickableIcons.parameters = {
  docs: {
    description: {
      story: 'Sistema de iconos clickeables mejorado. Ahora tanto leftIcon como rightIcon pueden ser interactivos con mejor feedback visual y área táctil optimizada para móviles.'
    }
  }
};

// ========== VALIDACIÓN AVANZADA ==========

export const AdvancedValidation = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validación en tiempo real
    const newErrors = { ...errors };
    
    switch (field) {
      case 'email':
        if (value && !value.includes('@')) {
          newErrors.email = 'Formato de email inválido';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        if (value && value.length < 8) {
          newErrors.password = 'Mínimo 8 caracteres requeridos';
        } else {
          delete newErrors.password;
        }
        break;
      case 'confirmPassword':
        if (value && value !== formData.password) {
          newErrors.confirmPassword = 'Las contraseñas no coinciden';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      case 'username':
        if (value && value.length < 3) {
          newErrors.username = 'Mínimo 3 caracteres';
        } else if (value && !/^[a-zA-Z0-9]+$/.test(value)) {
          newErrors.username = 'Solo letras y números permitidos';
        } else {
          delete newErrors.username;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const getVariant = (field) => {
    if (errors[field]) return 'error';
    if (formData[field] && !errors[field]) return 'success';
    return 'default';
  };

  return (
    <div style={{ 
      display: 'grid', 
      gap: '2rem',
      gridTemplateColumns: '1fr',
      maxWidth: '400px'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '2rem', fontWeight: '600', color: 'var(--text-primary)' }}>
        Registro con Validación Live
      </h3>
      
      <TextInput
        type="email"
        label="Correo electrónico"
        placeholder="tu@ejemplo.com"
        leftIcon="📧"
        rightIcon={formData.email && !errors.email ? "✅" : ""}
        value={formData.email}
        onChange={handleChange('email')}
        required
        errorText={errors.email}
        helperText={errors.email ? '' : 'Usaremos este email para contactarte'}
        variant={getVariant('email')}
        autoComplete="email"
        rounded="lg"
      />
      
      <TextInput
        type="text"
        label="Nombre de usuario"
        placeholder="usuario123"
        leftIcon="👤"
        value={formData.username}
        onChange={handleChange('username')}
        required
        errorText={errors.username}
        helperText={errors.username ? '' : 'Solo letras y números, mínimo 3 caracteres'}
        variant={getVariant('username')}
        maxLength={20}
        showCharCount
        pattern="[a-zA-Z0-9]+"
        rounded="lg"
      />
      
      <TextInput
        type="password"
        label="Contraseña"
        placeholder="Mínimo 8 caracteres"
        leftIcon="🔒"
        value={formData.password}
        onChange={handleChange('password')}
        required
        errorText={errors.password}
        helperText={errors.password ? '' : 'Usa una contraseña segura'}
        variant={getVariant('password')}
        maxLength={50}
        showCharCount
        autoComplete="new-password"
        rounded="lg"
      />
      
      <TextInput
        type="password"
        label="Confirmar contraseña"
        placeholder="Repite la contraseña"
        leftIcon="🔒"
        rightIcon={formData.confirmPassword && !errors.confirmPassword ? "✅" : ""}
        value={formData.confirmPassword}
        onChange={handleChange('confirmPassword')}
        required
        errorText={errors.confirmPassword}
        helperText={errors.confirmPassword ? '' : 'Debe coincidir con la contraseña anterior'}
        variant={getVariant('confirmPassword')}
        autoComplete="new-password"
        rounded="lg"
      />
    </div>
  );
};
AdvancedValidation.parameters = {
  docs: {
    description: {
      story: 'Sistema avanzado de validación con live regions, feedback visual inmediato y estados dinámicos. Los errores se anuncian automáticamente a lectores de pantalla.'
    }
  }
};

// ========== CONTADOR INTELIGENTE ==========

export const IntelligentCounter = () => {
  const [tweet, setTweet] = useState('');
  const [bio, setBio] = useState('Desarrollador Frontend apasionado por crear experiencias increíbles para usuarios de todo el mundo');
  const [post, setPost] = useState('');

  const getTweetVariant = () => {
    if (tweet.length >= 280) return 'error';
    if (tweet.length > 260) return 'warning';
    return 'default';
  };

  const getBioVariant = () => {
    if (bio.length >= 160) return 'error';
    if (bio.length > 140) return 'warning';
    if (bio.length > 50) return 'success';
    return 'default';
  };

  return (
    <div style={{ 
      display: 'grid', 
      gap: '2rem',
      gridTemplateColumns: '1fr'
    }}>
      <TextInput
        label="Tweet"
        placeholder="¿Qué está pasando?"
        value={tweet}
        onChange={(e) => setTweet(e.target.value)}
        maxLength={280}
        showCharCount
        helperText="Comparte lo que piensas con el mundo"
        variant={getTweetVariant()}
        leftIcon="🐦"
        rightIcon={tweet.length > 250 ? "⚠️" : ""}
        rounded="lg"
      />
      
      <TextInput
        label="Biografía del perfil"
        placeholder="Cuéntanos sobre ti..."
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        maxLength={160}
        showCharCount
        helperText="Descripción que aparecerá en tu perfil público"
        variant={getBioVariant()}
        leftIcon="👤"
        rightIcon={bio.length >= 160 ? "🚫" : bio.length > 140 ? "⚠️" : bio.length > 50 ? "✅" : ""}
        rounded="xl"
      />
      
      <TextInput
        label="Post de blog"
        placeholder="Escribe un resumen de tu artículo..."
        value={post}
        onChange={(e) => setPost(e.target.value)}
        maxLength={500}
        showCharCount
        helperText="Resumen que aparecerá en la lista de artículos"
        variant={post.length > 450 ? 'warning' : post.length > 100 ? 'success' : 'default'}
        leftIcon="📝"
        rounded="lg"
      />
    </div>
  );
};
IntelligentCounter.parameters = {
  docs: {
    description: {
      story: 'Contador inteligente que cambia automáticamente de color y añade iconos dinámicos según se acerca al límite. Incluye animaciones y feedback visual mejorado.'
    }
  }
};

// ========== RESPONSIVE Y MÓVIL ==========

export const ResponsiveMobile = () => (
  <div style={{
    display: 'flex',
    gap: '1.6rem',
    flexDirection: 'column'
  }}>
    <p style={{
      fontSize: '1.4rem',
      color: 'var(--text-muted)',
      margin: 0,
      fontFamily: 'var(--font-family-base)'
    }}>
      Redimensiona la ventana para ver el comportamiento responsive heredado del átomo Input:
    </p>
    
    <div style={{
      display: 'grid',
      gap: '1.6rem',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
    }}>
      <TextInput 
        size="xs" 
        label="XS - Se ajusta en móvil"
        placeholder="Área táctil mínima 44px"
        leftIcon="📱"
        rightIcon="👆"
        onRightIconClick={() => alert('Área táctil 44px')}
        helperText="Heredado del átomo Input"
      />
      
      <TextInput 
        size="lg" 
        label="LG - Se reduce en móvil"
        placeholder="Optimizado para touch"
        leftIcon="🖥️"
        rightIcon="📱"
        helperText="Responsive automático"
        variant="success"
        rounded="lg"
      />
      
      <TextInput 
        size="xl" 
        label="XL - iOS optimizado"
        placeholder="Sin zoom en iOS"
        leftIcon="📲"
        rightIcon="🍎"
        helperText="font-size: max(1.6rem, 16px)"
        variant="warning"
        rounded="xl"
      />
    </div>
    
    <p style={{
      fontSize: '1.2rem',
      color: 'var(--text-muted)',
      margin: 0,
      fontStyle: 'italic'
    }}>
      En móviles (&lt;768px): área táctil mínima 44px para iconos, sin zoom en iOS, footer adaptativo
    </p>
  </div>
);

ResponsiveMobile.parameters = {
  docs: {
    description: {
      story: 'Comportamiento responsive completamente heredado del átomo Input mejorado. TextInput añade optimizaciones adicionales para iconos clickeables y layout del footer.'
    }
  }
};

// ========== CASOS DE USO COMUNES ==========

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div style={{ 
      display: 'grid', 
      gap: '2rem',
      gridTemplateColumns: '1fr',
      maxWidth: '350px',
      padding: '2.4rem',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      backgroundColor: 'var(--bg-primary)',
      boxShadow: 'var(--shadow-lg)'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '2.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>
        Iniciar Sesión
      </h3>
      
      <TextInput
        type="email"
        label="Usuario o Email"
        placeholder="tu@ejemplo.com"
        leftIcon="👤"
        rightIcon={formData.username ? "✅" : ""}
        value={formData.username}
        onChange={handleChange('username')}
        required
        fullWidth
        helperText="Usa tu email registrado"
        variant={formData.username.includes('@') ? 'success' : 'default'}
        autoComplete="email"
        rounded="lg"
      />
      
      <TextInput
        type={showPassword ? 'text' : 'password'}
        label="Contraseña"
        placeholder="••••••••"
        leftIcon="🔒"
        rightIcon={showPassword ? "🙈" : "👁️"}
        value={formData.password}
        onChange={handleChange('password')}
        onRightIconClick={() => setShowPassword(!showPassword)}
        required
        fullWidth
        helperText="Mínimo 6 caracteres"
        variant={formData.password.length >= 6 ? 'success' : 'default'}
        autoComplete="current-password"
        rounded="lg"
      />
      
      <button style={{
        padding: '1.4rem 2rem',
        backgroundColor: 'var(--color-primary)',
        color: 'var(--text-on-primary)',
        border: 'none',
        borderRadius: 'var(--radius-lg)',
        fontSize: '1.6rem',
        fontWeight: '500',
        cursor: 'pointer',
        marginTop: '0.8rem',
        transition: 'var(--transition-normal)'
      }}>
        Entrar
      </button>
    </div>
  );
};
LoginForm.parameters = {
  docs: {
    description: {
      story: 'Formulario de login moderno usando TextInput mejorado. Demuestra iconos interactivos, validación visual y herencia completa del átomo Input.'
    }
  }
};

export const SearchInterface = () => {
  const [searchData, setSearchData] = useState({
    query: '',
    category: '',
    tags: ''
  });

  const handleChange = (field) => (e) => {
    setSearchData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSearch = () => {
    alert(`Buscando: "${searchData.query}" en categoría: "${searchData.category}"`);
  };

  const handleClear = (field) => {
    setSearchData(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div style={{ 
      display: 'grid', 
      gap: '2rem',
      gridTemplateColumns: '1fr',
      maxWidth: '600px',
      padding: '2.4rem',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      backgroundColor: 'var(--bg-secondary)'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '2.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>
        Búsqueda Avanzada
      </h3>
      
      <TextInput
        type="search"
        label="Términos de búsqueda"
        placeholder="Buscar productos, marcas, categorías..."
        leftIcon="🔍"
        rightIcon={searchData.query ? "❌" : "🎯"}
        value={searchData.query}
        onChange={handleChange('query')}
        onLeftIconClick={handleSearch}
        onRightIconClick={searchData.query ? () => handleClear('query') : undefined}
        helperText="Presiona la lupa para buscar o Enter"
        variant={searchData.query ? 'success' : 'default'}
        size="lg"
        rounded="xl"
        fullWidth
      />
      
      <div style={{
        display: 'grid',
        gap: '1.6rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
      }}>
        <TextInput
          label="Categoría"
          placeholder="ej: electrónicos"
          leftIcon="📂"
          rightIcon={searchData.category ? "❌" : ""}
          value={searchData.category}
          onChange={handleChange('category')}
          onRightIconClick={searchData.category ? () => handleClear('category') : undefined}
          helperText="Filtra por categoría específica"
          rounded="lg"
        />
        
        <TextInput
          label="Tags"
          placeholder="ej: ofertas, nuevo"
          leftIcon="🏷️"
          rightIcon={searchData.tags ? "❌" : ""}
          value={searchData.tags}
          onChange={handleChange('tags')}
          onRightIconClick={searchData.tags ? () => handleClear('tags') : undefined}
          helperText="Separa tags con comas"
          rounded="lg"
        />
      </div>
    </div>
  );
};
SearchInterface.parameters = {
  docs: {
    description: {
      story: 'Interfaz de búsqueda avanzada mostrando múltiples TextInput coordinados con iconos interactivos y diferentes tamaños heredados del átomo.'
    }
  }
};

// ========== MODO OSCURO ==========

export const DarkModeExample = () => (
  <div className="dark" style={{
    padding: '2.4rem',
    backgroundColor: 'var(--bg-primary)',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--border-default)'
  }}>
    <div style={{
      display: 'grid',
      gap: '2rem',
      gridTemplateColumns: '1fr'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '2rem', fontWeight: '600', color: 'var(--text-primary)' }}>
        TextInput en Modo Oscuro
      </h3>
      
      <TextInput 
        label="Campo normal"
        placeholder="TextInput heredando modo oscuro del átomo" 
        leftIcon="🌙"
        helperText="Variables CSS automáticas del sistema"
        rounded="lg"
      />
      
      <TextInput 
        label="Campo con error"
        placeholder="Campo con error en modo oscuro" 
        leftIcon="❌"
        errorText="Error con live regions en modo oscuro"
        variant="error"
        rounded="lg"
      />
      
      <TextInput 
        label="Campo exitoso"
        placeholder="Campo validado en modo oscuro" 
        value="Contenido válido en dark mode"
        leftIcon="✅"
        rightIcon="🌟"
        variant="success"
        helperText="Variante success heredada del átomo"
        readOnly
        rounded="lg"
        onRightIconClick={() => alert('¡Funciona en modo oscuro!')}
      />
      
      <TextInput 
        label="Campo con contador"
        placeholder="Escribir en modo oscuro..." 
        leftIcon="✍️"
        helperText="Contador inteligente en modo oscuro"
        maxLength={50}
        showCharCount
        variant="warning"
        rounded="lg"
      />
    </div>
  </div>
);
DarkModeExample.parameters = {
  docs: {
    description: {
      story: 'TextInput en modo oscuro heredando automáticamente del átomo Input mejorado. Todas las variantes, iconos y funcionalidades se adaptan automáticamente usando la clase .dark.'
    }
  }
};