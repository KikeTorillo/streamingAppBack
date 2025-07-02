// molecules/TextSelect/TextSelect.stories.jsx
import React, { useState } from 'react';
import { TextSelect } from './TextSelect';
import './TextSelect.css';

export default {
  title: 'Components/Molecules/TextSelect',
  component: TextSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# TextSelect Component

Campo de selección avanzado que **extiende el átomo Select** siguiendo principios de **Atomic Design**. 
Mantiene total consistencia con TextInput y añade funcionalidades como etiquetas, iconos, validación y mensajes de ayuda.

## 🎯 Características principales

- **Basado en Select mejorado**: Reutiliza TODAS las mejoras del átomo (variantes semánticas, border radius, responsive, etc.)
- **4 variantes visuales**: Default, Success, Warning, Error
- **5 tamaños responsive**: XS, SM, MD, LG, XL (heredados del átomo)
- **Estados completos**: Normal, Focus, Hover, Disabled (heredados del átomo)
- **Iconos izquierdos**: Emojis, clases CSS, componentes React con click handlers
- **Validación avanzada**: Mensajes de error, ayuda, live regions
- **Accesibilidad completa**: ARIA attributes, labels asociados, navegación por teclado
- **Theming automático**: Variables CSS del sistema, modo oscuro nativo
- **Mobile-first**: Área táctil de 44px, optimización iOS

## 🏗️ Arquitectura Atomic Design

\`\`\`
TextSelect (Molécula) 🧬
├── Label (elemento dinámico)
├── Container
│   ├── LeftIcon (elemento + clickeable)
│   ├── Select (Átomo mejorado) ⚛️ ← Reutiliza todas las mejoras
│   └── Arrow (icono integrado del átomo)
└── Footer
    └── Messages (helper/error con live regions)
\`\`\`

## 📱 Sistema de diseño

Optimizado para sistemas con \`html { font-size: 62.5% }\` donde \`1rem = 10px\`
Usa automáticamente TODAS las variables CSS del sistema de diseño actualizado.

## 🔧 Uso básico

\`\`\`jsx
import { TextSelect } from './molecules/TextSelect';

const countries = [
  { value: 'mx', label: 'México' },
  { value: 'us', label: 'Estados Unidos' },
  { value: 'ca', label: 'Canadá' },
  { value: 'es', label: 'España', disabled: true }
];

// Uso simple (hereda TODAS las mejoras del átomo Select)
<TextSelect 
  options={countries}
  placeholder="Selecciona tu país"
  onChange={handleChange}
/>

// Con variantes semánticas del átomo
<TextSelect 
  options={countries}
  variant="success"
  rounded="lg"
  placeholder="País seleccionado"
/>

// Campo completo con todas las funcionalidades
<TextSelect 
  label="País de residencia"
  options={countries}
  value={selectedCountry}
  onChange={handleCountryChange}
  required
  errorText={countryError}
  helperText="Selecciona tu país para personalizar la experiencia"
  leftIcon="🌍"
  onLeftIconClick={openCountryModal}
  variant="success"
  rounded="xl"
  size="lg"
/>
\`\`\`

## 🎨 Variables CSS del sistema

El componente usa automáticamente las mismas variables que el átomo Select y TextInput:

\`\`\`css
:root {
  /* Variables heredadas del sistema completo */
  --text-primary: #111827;
  --text-muted: #6b7280;
  --bg-primary: #ffffff;
  --border-default: #d1d5db;
  --border-focus: #3b82f6;
  --color-danger: #ef4444;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger-light: #fef2f2;
  --color-success-light: #f0fdf4;
  --color-warning-light: #fefce8;
  /* Y todas las demás del sistema... */
}
\`\`\`

## 🎯 Características del componente

**Como molécula en Atomic Design:**
- **Hereda del átomo Select**: Variantes semánticas (error, success, warning), border radius personalizable, responsive con área táctil, validación HTML5, modo oscuro automático
- **Añade funcionalidades de molécula**: Label dinámico que cambia color según estado, iconos izquierdos interactivos, mensajes con live regions

**Casos de uso ideales:**
- Formularios complejos que requieren validación visual
- Campos con iconos informativos (categoría, país, tipo)
- Interfaces que necesitan feedback inmediato al usuario
- Aplicaciones con modo oscuro automático

## ♿ Accesibilidad mejorada

- **ARIA live regions**: Mensajes de error anunciados automáticamente
- **Labels dinámicos**: Cambian color según estado/foco
- **Iconos accesibles**: \`aria-hidden\`, roles y navegación por teclado
- **Área táctil**: Mínimo 44px en móviles para iconos clickeables
- **Focus management**: Estados heredados y mejorados del átomo Select
- **Screen reader**: Descripciones contextuales completas

## 🎭 Herencia del átomo Select

TextSelect hereda automáticamente todas las mejoras del átomo Select:
- ✅ Variantes semánticas (error, success, warning)
- ✅ Border radius personalizable
- ✅ Estados hover/focus mejorados
- ✅ Responsive con área táctil
- ✅ Validación HTML5 
- ✅ Modo oscuro automático
- ✅ Flecha personalizada con animaciones
        `
      }
    }
  },
  argTypes: {
    options: {
      name: 'Opciones',
      description: 'Array de opciones para el select',
      control: 'object',
      table: {
        type: { summary: 'Array<{value: string, label: string, disabled?: boolean}>' }
      }
    },
    placeholder: {
      name: 'Placeholder',
      description: 'Texto mostrado cuando no hay selección',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Selecciona una opción'" }
      }
    },
    value: {
      name: 'Valor',
      description: 'Valor controlado del select',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    size: {
      name: 'Tamaño',
      description: 'Tamaño del select (heredado del átomo Select con responsive)',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'md'" }
      }
    },
    variant: {
      name: 'Variante',
      description: 'Estilo visual del select (usando las variantes del átomo Select mejorado)',
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'default'" }
      }
    },
    rounded: {
      name: 'Radio de bordes',
      description: 'Curvatura de las esquinas (heredado del átomo Select mejorado)',
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'md'" }
      }
    },
    label: {
      name: 'Etiqueta',
      description: 'Etiqueta descriptiva del campo (añadida por TextSelect)',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    helperText: {
      name: 'Texto de ayuda',
      description: 'Texto informativo debajo del select (añadido por TextSelect)',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    errorText: {
      name: 'Mensaje de error',
      description: 'Mensaje de error con live regions (sobrescribe helperText y variant)',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    leftIcon: {
      name: 'Icono izquierdo',
      description: 'Icono a la izquierda del campo (emoji, clase CSS o componente React)',
      control: 'text',
      table: {
        type: { summary: 'string | React.ReactNode' }
      }
    },
    disabled: {
      name: 'Deshabilitado',
      description: 'Si el campo está deshabilitado',
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
    fullWidth: {
      name: 'Ancho completo',
      description: 'Si ocupa todo el ancho disponible',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    }
  }
};

// ========== DATOS DE EJEMPLO ==========
const countries = [
  { value: 'mx', label: 'México' },
  { value: 'us', label: 'Estados Unidos' },
  { value: 'ca', label: 'Canadá' },
  { value: 'br', label: 'Brasil' },
  { value: 'ar', label: 'Argentina' },
  { value: 'es', label: 'España' },
  { value: 'fr', label: 'Francia' },
  { value: 'de', label: 'Alemania' },
  { value: 'it', label: 'Italia' },
  { value: 'jp', label: 'Japón' },
  { value: 'cn', label: 'China', disabled: true },
  { value: 'in', label: 'India' }
];

const categories = [
  { value: 'tech', label: 'Tecnología' },
  { value: 'design', label: 'Diseño' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'finance', label: 'Finanzas' },
  { value: 'hr', label: 'Recursos Humanos' },
  { value: 'sales', label: 'Ventas' }
];

const priorities = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
  { value: 'urgent', label: 'Urgente' }
];

// ========== ESTADOS BÁSICOS ==========
export const Default = {
  args: {
    options: countries,
    placeholder: "Selecciona tu país",
    label: "País de residencia",
    helperText: "Selecciona tu país para personalizar la experiencia"
  }
};

export const WithValue = {
  args: {
    options: categories,
    value: "design",
    label: "Categoría",
    placeholder: "Selecciona una categoría"
  }
};

export const Required = {
  args: {
    options: priorities,
    label: "Prioridad",
    placeholder: "Selecciona la prioridad",
    required: true,
    helperText: "Este campo es obligatorio"
  }
};

export const Disabled = {
  args: {
    options: countries,
    label: "País (Deshabilitado)",
    placeholder: "No disponible",
    disabled: true,
    helperText: "Esta opción no está disponible temporalmente"
  }
};

// ========== TAMAÑOS ==========
export const Sizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
    <TextSelect options={categories} size="xs" label="Extra Small (XS)" placeholder="Tamaño XS" />
    <TextSelect options={categories} size="sm" label="Small (SM)" placeholder="Tamaño SM" />
    <TextSelect options={categories} size="md" label="Medium (MD)" placeholder="Tamaño MD" />
    <TextSelect options={categories} size="lg" label="Large (LG)" placeholder="Tamaño LG" />
    <TextSelect options={categories} size="xl" label="Extra Large (XL)" placeholder="Tamaño XL" />
  </div>
);

// ========== VARIANTES ==========
export const Variants = () => (
  <div style={{ display: 'grid', gap: 'var(--space-lg)', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
    <TextSelect 
      options={countries} 
      variant="default" 
      label="Default" 
      placeholder="Estado normal"
      helperText="Campo en estado normal"
    />
    <TextSelect 
      options={countries} 
      variant="success" 
      label="Success" 
      placeholder="Estado exitoso"
      helperText="Campo validado correctamente"
    />
    <TextSelect 
      options={countries} 
      variant="warning" 
      label="Warning" 
      placeholder="Estado de advertencia"
      helperText="Revisa tu selección"
    />
    <TextSelect 
      options={countries} 
      variant="error" 
      label="Error" 
      placeholder="Estado de error"
      errorText="Debes seleccionar una opción válida"
    />
  </div>
);

// ========== BORDER RADIUS ==========
export const BorderRadius = () => (
  <div style={{ display: 'grid', gap: 'var(--space-lg)', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
    <TextSelect options={categories} rounded="sm" label="Small" placeholder="Border radius pequeño" />
    <TextSelect options={categories} rounded="md" label="Medium" placeholder="Border radius medio" />
    <TextSelect options={categories} rounded="lg" label="Large" placeholder="Border radius grande" />
    <TextSelect options={categories} rounded="xl" label="Extra Large" placeholder="Border radius extra grande" />
    <TextSelect options={categories} rounded="full" label="Full" placeholder="Border radius completo" />
  </div>
);

// ========== CON ICONOS ==========
export const WithIcons = () => (
  <div style={{ display: 'grid', gap: 'var(--space-lg)', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
    <TextSelect 
      options={countries}
      label="País de residencia"
      placeholder="Selecciona tu país"
      leftIcon="🌍"
      helperText="Icono emoji decorativo"
    />
    <TextSelect 
      options={categories}
      label="Categoría profesional"
      placeholder="Selecciona tu área"
      leftIcon="💼"
      helperText="Icono con información contextual"
    />
    <TextSelect 
      options={priorities}
      label="Nivel de prioridad"
      placeholder="Selecciona la prioridad"
      leftIcon="⚡"
      helperText="Icono que refuerza el significado"
    />
  </div>
);

// ========== ICONOS CLICKEABLES ==========
export const ClickableIcons = () => {
  const [showCountryInfo, setShowCountryInfo] = useState(false);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <TextSelect 
        options={countries}
        label="País con información"
        placeholder="Selecciona tu país"
        leftIcon="ℹ️"
        onLeftIconClick={() => setShowCountryInfo(!showCountryInfo)}
        helperText="Haz clic en el icono para más información"
      />
      
      {showCountryInfo && (
        <div style={{ 
          padding: 'var(--space-md)', 
          backgroundColor: 'var(--color-primary-light)', 
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-primary)'
        }}>
          💡 <strong>Información:</strong> Selecciona tu país para personalizar la experiencia y obtener contenido relevante para tu región.
        </div>
      )}
    </div>
  );
};

// ========== VALIDACIÓN AVANZADA ==========
export const ValidationExample = () => {
  const [formData, setFormData] = useState({
    country: '',
    category: '',
    priority: ''
  });
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    if (!value) {
      newErrors[name] = 'Este campo es obligatorio';
    } else {
      delete newErrors[name];
    }
    
    setErrors(newErrors);
  };

  const handleChange = (name) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', maxWidth: '400px' }}>
      <h3 style={{ color: 'var(--text-primary)' }}>Formulario con Validación</h3>
      
      <TextSelect 
        options={countries}
        label="País de residencia"
        placeholder="Selecciona tu país"
        value={formData.country}
        onChange={handleChange('country')}
        required
        errorText={errors.country}
        helperText={!errors.country ? "Selecciona tu país" : undefined}
        leftIcon="🌍"
        variant={errors.country ? 'error' : formData.country ? 'success' : 'default'}
      />
      
      <TextSelect 
        options={categories}
        label="Área profesional"
        placeholder="Selecciona tu área"
        value={formData.category}
        onChange={handleChange('category')}
        required
        errorText={errors.category}
        helperText={!errors.category ? "Tu área de especialización" : undefined}
        leftIcon="💼"
        variant={errors.category ? 'error' : formData.category ? 'success' : 'default'}
      />
      
      <TextSelect 
        options={priorities}
        label="Prioridad de contacto"
        placeholder="Selecciona la prioridad"
        value={formData.priority}
        onChange={handleChange('priority')}
        required
        errorText={errors.priority}
        helperText={!errors.priority ? "¿Qué tan urgente es?" : undefined}
        leftIcon="⚡"
        variant={errors.priority ? 'error' : formData.priority ? 'success' : 'default'}
      />
      
      <div style={{ 
        marginTop: 'var(--space-md)',
        padding: 'var(--space-md)',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--font-size-sm)'
      }}>
        <strong>Datos del formulario:</strong>
        <pre style={{ marginTop: 'var(--space-xs)' }}>
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

// ========== ACCESIBILIDAD ==========
export const AccessibilityExample = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', maxWidth: '500px' }}>
    <h3 style={{ color: 'var(--text-primary)' }}>Ejemplos de Accesibilidad</h3>
    
    <TextSelect 
      options={countries}
      label="Campo completamente accesible"
      placeholder="Navega con Tab + Enter/Space"
      helperText="Este campo es navegable por teclado y compatible con screen readers"
      leftIcon="♿"
      ariaLabel="Selector de país con soporte de accesibilidad completo"
    />
    
    <TextSelect 
      options={priorities}
      label="Campo con error accesible"
      placeholder="Error anunciado automáticamente"
      errorText="Los errores se anuncian automáticamente a los screen readers"
      leftIcon="🔊"
      required
    />
    
    <div style={{ 
      padding: 'var(--space-md)', 
      backgroundColor: 'var(--color-success-light)', 
      borderRadius: 'var(--radius-md)',
      fontSize: 'var(--font-size-sm)',
      color: 'var(--text-primary)'
    }}>
      <strong>✅ Características de accesibilidad:</strong>
      <ul style={{ marginTop: 'var(--space-xs)', paddingLeft: 'var(--space-lg)' }}>
        <li>Labels asociados correctamente</li>
        <li>ARIA live regions para mensajes de error</li>
        <li>Navegación por teclado completa</li>
        <li>Área táctil mínima de 44px en móviles</li>
        <li>Descripciones contextuales para screen readers</li>
        <li>Estados focus visibles y contrastados</li>
      </ul>
    </div>
  </div>
);

// ========== RESPONSIVE ==========
export const ResponsiveExample = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
    <h3 style={{ color: 'var(--text-primary)' }}>Diseño Responsive</h3>
    
    <div style={{ display: 'grid', gap: 'var(--space-md)', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
      <TextSelect 
        options={countries}
        label="Móvil optimizado"
        placeholder="Área táctil 44px"
        size="sm"
        helperText="Optimizado para dispositivos móviles"
        leftIcon="📱"
      />
      
      <TextSelect 
        options={categories}
        label="Tablet y desktop"
        placeholder="Escalable según pantalla"
        size="md"
        helperText="Se adapta al tamaño de pantalla"
        leftIcon="💻"
      />
      
      <TextSelect 
        options={priorities}
        label="Pantallas grandes"
        placeholder="Máxima legibilidad"
        size="lg"
        helperText="Optimizado para pantallas grandes"
        leftIcon="🖥️"
      />
    </div>
    
    <div style={{ 
      padding: 'var(--space-md)', 
      backgroundColor: 'var(--color-primary-light)', 
      borderRadius: 'var(--radius-md)',
      fontSize: 'var(--font-size-sm)',
      color: 'var(--text-primary)'
    }}>
      <strong>📱 Características responsive:</strong>
      <ul style={{ marginTop: 'var(--space-xs)', paddingLeft: 'var(--space-lg)' }}>
        <li>Área táctil mínima de 44px en móviles</li>
        <li>Tamaños de fuente escalables</li>
        <li>Spacing adaptativo según dispositivo</li>
        <li>Iconos con tamaño táctil apropiado</li>
        <li>Sin zoom automático en iOS</li>
      </ul>
    </div>
  </div>
);

// ========== FORMULARIO COMPLETO ==========
export const CompleteFormExample = () => {
  const [formData, setFormData] = useState({
    country: '',
    category: '',
    priority: '',
    department: '',
    experience: ''
  });

  const departments = [
    { value: 'engineering', label: 'Ingeniería' },
    { value: 'design', label: 'Diseño' },
    { value: 'product', label: 'Producto' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Ventas' },
    { value: 'support', label: 'Soporte' }
  ];

  const experienceLevels = [
    { value: 'junior', label: 'Junior (0-2 años)' },
    { value: 'mid', label: 'Mid-level (2-5 años)' },
    { value: 'senior', label: 'Senior (5-8 años)' },
    { value: 'lead', label: 'Lead (8+ años)' },
    { value: 'director', label: 'Director/VP' }
  ];

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Formulario enviado:\n' + JSON.stringify(formData, null, 2));
  };

  return (
    <form onSubmit={handleSubmit} style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 'var(--space-lg)', 
      maxWidth: '600px',
      padding: 'var(--space-lg)',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)'
    }}>
      <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>
        Perfil Profesional Completo
      </h3>
      
      <div style={{ display: 'grid', gap: 'var(--space-md)', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <TextSelect 
          options={countries}
          label="País de residencia"
          placeholder="Selecciona tu país"
          value={formData.country}
          onChange={handleChange('country')}
          required
          leftIcon="🌍"
          helperText="Tu ubicación principal"
          variant={formData.country ? 'success' : 'default'}
        />
        
        <TextSelect 
          options={categories}
          label="Área profesional"
          placeholder="Tu especialización"
          value={formData.category}
          onChange={handleChange('category')}
          required
          leftIcon="💼"
          helperText="Tu área de expertiz"
          variant={formData.category ? 'success' : 'default'}
        />
      </div>
      
      <div style={{ display: 'grid', gap: 'var(--space-md)', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <TextSelect 
          options={departments}
          label="Departamento"
          placeholder="Selecciona departamento"
          value={formData.department}
          onChange={handleChange('department')}
          leftIcon="🏢"
          helperText="Tu departamento actual"
          variant={formData.department ? 'success' : 'default'}
        />
        
        <TextSelect 
          options={experienceLevels}
          label="Nivel de experiencia"
          placeholder="Tu nivel actual"
          value={formData.experience}
          onChange={handleChange('experience')}
          leftIcon="📈"
          helperText="Años de experiencia"
          variant={formData.experience ? 'success' : 'default'}
        />
        
        <TextSelect 
          options={priorities}
          label="Prioridad de contacto"
          placeholder="Selecciona prioridad"
          value={formData.priority}
          onChange={handleChange('priority')}
          leftIcon="⚡"
          helperText="¿Qué tan urgente?"
          variant={formData.priority ? 'success' : 'default'}
        />
      </div>
      
      <button 
        type="submit"
        style={{
          padding: 'var(--space-md) var(--space-lg)',
          backgroundColor: 'var(--color-primary)',
          color: 'var(--text-white)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-base)',
          fontWeight: 'var(--font-weight-semibold)',
          cursor: 'pointer',
          transition: 'all var(--transition-normal)',
          marginTop: 'var(--space-md)'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = 'var(--color-primary-hover)'}
        onMouseOut={(e) => e.target.style.backgroundColor = 'var(--color-primary)'}
      >
        Enviar Información 🚀
      </button>
      
      {Object.values(formData).some(value => value) && (
        <div style={{ 
          marginTop: 'var(--space-md)',
          padding: 'var(--space-md)',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-sm)'
        }}>
          <strong style={{ color: 'var(--text-primary)' }}>Vista previa del perfil:</strong>
          <pre style={{ 
            marginTop: 'var(--space-xs)', 
            color: 'var(--text-secondary)',
            overflow: 'auto'
          }}>
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}
    </form>
  );
};

// ========== INTEGRACIÓN CON OTROS COMPONENTES ==========
export const IntegrationExample = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', maxWidth: '500px' }}>
      <h3 style={{ color: 'var(--text-primary)' }}>Integración con Otros Componentes</h3>
      
      <TextSelect 
        options={countries}
        label="Selecciona tu país"
        placeholder="Elige un país"
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
        leftIcon="🌍"
        helperText="Esto activará opciones adicionales"
      />
      
      {selectedCountry && (
        <div style={{ 
          padding: 'var(--space-md)', 
          backgroundColor: 'var(--color-success-light)', 
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-primary)'
        }}>
          ✅ País seleccionado: <strong>{countries.find(c => c.value === selectedCountry)?.label}</strong>
        </div>
      )}
      
      <label style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 'var(--space-sm)',
        color: 'var(--text-primary)',
        cursor: 'pointer'
      }}>
        <input 
          type="checkbox" 
          checked={showAdvanced}
          onChange={(e) => setShowAdvanced(e.target.checked)}
          style={{ transform: 'scale(1.2)' }}
        />
        Mostrar opciones avanzadas
      </label>
      
      {showAdvanced && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 'var(--space-md)',
          padding: 'var(--space-md)',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '0.1rem dashed var(--border-primary)'
        }}>
          <TextSelect 
            options={categories}
            label="Categoría avanzada"
            placeholder="Opciones adicionales"
            leftIcon="⚙️"
            size="sm"
          />
          
          <TextSelect 
            options={priorities}
            label="Configuración especial"
            placeholder="Configuración experta"
            leftIcon="🔧"
            size="sm"
            variant="warning"
            helperText="Solo para usuarios avanzados"
          />
        </div>
      )}
      
      <div style={{ 
        padding: 'var(--space-md)', 
        backgroundColor: 'var(--color-primary-light)', 
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-primary)'
      }}>
        <strong>🧩 Características de integración:</strong>
        <ul style={{ marginTop: 'var(--space-xs)', paddingLeft: 'var(--space-lg)' }}>
          <li>Compatible con formularios controlados y no controlados</li>
          <li>Se integra perfectamente con librerías como React Hook Form</li>
          <li>Callbacks personalizables para interacciones complejas</li>
          <li>Estado sincronizable con otros componentes</li>
          <li>Estilos consistentes con todo el sistema de diseño</li>
        </ul>
      </div>
    </div>
  );
};

CompleteFormExample.parameters = {
  docs: {
    description: {
      story: 'Ejemplo completo de un formulario profesional usando múltiples TextSelect con validación visual y datos reales.'
    }
  }
};

IntegrationExample.parameters = {
  docs: {
    description: {
      story: 'Ejemplo de integración con otros componentes, mostrando interacciones dinámicas y estado compartido.'
    }
  }
};