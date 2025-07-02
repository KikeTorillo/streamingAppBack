// src/components/molecules/FileInputField/FileInputField.stories.jsx
import React, { useState } from 'react';
import { FileInputField } from './FileInputField';
import './FileInputField.css';

export default {
  title: 'Components/Molecules/FileInputField',
  component: FileInputField,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# FileInputField - Molécula del Sistema de Diseño

**FileInputField** es la molécula que extiende el átomo FileInput, siguiendo exactamente el mismo patrón arquitectural que TextInput.

## 🏗️ Arquitectura Atomic Design

\`\`\`
FileInputField (Molécula) 🧬
├── Label (elemento)
├── FileInput (Átomo) ⚛️ ← Reutiliza todas las funcionalidades
└── Footer
    └── Messages (helper/error con live regions)
\`\`\`

## 🎯 Características principales

- **Basado en FileInput**: Hereda todas las funcionalidades del átomo
- **Estructura consistente**: Label + Campo + Footer (igual que TextInput)
- **Estados semánticos**: Default, Success, Warning, Danger
- **Tamaños responsive**: XS, SM, MD, LG, XL
- **Accesibilidad completa**: ARIA, labels asociados, live regions
- **Theming automático**: Variables CSS del sistema
- **Mobile-first**: Optimizado para dispositivos móviles

## 🎨 Consistencia visual

Usa exactamente las mismas variables CSS que TextInput:
- Spacing, tipografía, colores idénticos
- Estados focus/hover/disabled coherentes
- Mensajes de error y ayuda uniformes
- Responsive design consistente

## 📱 Casos de uso

Perfecto para formularios donde necesitas:
- Subida de archivos con labels descriptivos
- Validación visual con mensajes de error
- Consistencia con otros campos del formulario
- Integración con DynamicForm
        `
      }
    }
  },
  argTypes: {
    label: {
      name: 'Etiqueta',
      description: 'Etiqueta descriptiva del campo',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    helperText: {
      name: 'Texto de ayuda',
      description: 'Mensaje informativo debajo del campo',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    errorText: {
      name: 'Mensaje de error',
      description: 'Mensaje de error (sobrescribe helperText)',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    required: {
      name: 'Requerido',
      description: 'Marca el campo como obligatorio',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    size: {
      name: 'Tamaño',
      description: 'Tamaño del componente',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'md'" }
      }
    },
    variant: {
      name: 'Variante',
      description: 'Variante visual semántica',
      control: 'select',
      options: ['default', 'success', 'warning', 'danger'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'default'" }
      }
    },
    accept: {
      name: 'Tipos aceptados',
      description: 'Tipos MIME de archivos permitidos',
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
    text: {
      name: 'Texto del botón',
      description: 'Texto del botón de selección',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Seleccionar archivo'" }
      }
    },
    disabled: {
      name: 'Deshabilitado',
      description: 'Deshabilita el campo',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    }
  }
};

// Template base
const Template = (args) => (
  <FileInputField 
    {...args} 
    onChange={(e) => {
      console.log('Archivos seleccionados:', e.target.files);
    }}
  />
);

// ===== STORIES PRINCIPALES =====

export const Playground = Template.bind({});
Playground.args = {
  label: 'Subir archivo',
  helperText: 'Selecciona un archivo de tu dispositivo',
  text: 'Seleccionar archivo',
  size: 'md',
  variant: 'default'
};

// ===== COMPARACIÓN CON TEXTINPUT =====

export const VisualConsistency = () => {
  const [textValue, setTextValue] = useState('');
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 'var(--space-lg)',
      maxWidth: '500px' 
    }}>
      <h3 style={{ margin: '0', color: 'var(--text-primary)' }}>
        🎨 Consistencia Visual con TextInput
      </h3>
      
      {/* Simulación de TextInput para comparar */}
      <div>
        <label style={{
          display: 'block',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--text-primary)',
          fontSize: 'var(--font-size-sm)',
          marginBottom: 'var(--space-xs)'
        }}>
          Campo de texto
        </label>
        <input
          type="text"
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder="Escribe algo..."
          style={{
            width: '100%',
            padding: 'var(--space-sm) var(--space-md)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-base)',
            fontFamily: 'var(--font-family-base)',
            minHeight: '4.0rem'
          }}
        />
        <div style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--text-secondary)',
          marginTop: 'var(--space-xs)'
        }}>
          Texto de ayuda para el campo
        </div>
      </div>
      
      {/* FileInputField */}
      <FileInputField
        label="Campo de archivo"
        helperText="Texto de ayuda para el archivo"
        text="Seleccionar archivo"
        accept="image/*"
      />
      
      <div style={{
        padding: 'var(--space-md)',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)'
      }}>
        ✅ <strong>Misma estructura visual:</strong> Label, Campo, Helper Text<br/>
        ✅ <strong>Mismo espaciado:</strong> Variables CSS idénticas<br/>
        ✅ <strong>Mismas alturas:</strong> Alineación perfecta
      </div>
    </div>
  );
};

// ===== ESTADOS Y VARIANTES =====

export const StatesAndVariants = () => (
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 'var(--space-lg)',
    maxWidth: '800px'
  }}>
    <FileInputField
      label="Estado normal"
      helperText="Campo en estado por defecto"
      text="Seleccionar archivo"
    />
    
    <FileInputField
      label="Campo requerido"
      helperText="Este campo es obligatorio"
      text="Seleccionar archivo"
      required
    />
    
    <FileInputField
      label="Estado de éxito"
      helperText="Archivo validado correctamente"
      text="Archivo válido"
      variant="success"
    />
    
    <FileInputField
      label="Estado de advertencia"
      helperText="Revisa el tipo de archivo"
      text="Revisar archivo"
      variant="warning"
    />
    
    <FileInputField
      label="Estado de error"
      errorText="Tipo de archivo no permitido"
      text="Seleccionar otro archivo"
      variant="danger"
    />
    
    <FileInputField
      label="Campo deshabilitado"
      helperText="No se puede modificar"
      text="Archivo bloqueado"
      disabled
    />
  </div>
);

// ===== TAMAÑOS =====

export const Sizes = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 'var(--space-lg)',
    maxWidth: '600px'
  }}>
    <FileInputField
      label="Extra pequeño (XS)"
      helperText="Tamaño mínimo"
      size="xs"
      text="Archivo XS"
    />
    
    <FileInputField
      label="Pequeño (SM)"
      helperText="Tamaño pequeño"
      size="sm"
      text="Archivo SM"
    />
    
    <FileInputField
      label="Mediano (MD)"
      helperText="Tamaño por defecto"
      size="md"
      text="Archivo MD"
    />
    
    <FileInputField
      label="Grande (LG)"
      helperText="Tamaño grande"
      size="lg"
      text="Archivo LG"
    />
    
    <FileInputField
      label="Extra grande (XL)"
      helperText="Tamaño máximo"
      size="xl"
      text="Archivo XL"
    />
  </div>
);

// ===== TIPOS DE ARCHIVO =====

export const FileTypes = () => (
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'var(--space-lg)',
    maxWidth: '900px'
  }}>
    <FileInputField
      label="Solo imágenes"
      accept="image/*"
      helperText="JPG, PNG, GIF, WebP"
      text="Seleccionar imagen"
    />
    
    <FileInputField
      label="Solo videos"
      accept="video/*"
      helperText="MP4, WebM, AVI, MOV"
      text="Seleccionar video"
    />
    
    <FileInputField
      label="Documentos"
      accept=".pdf,.doc,.docx,.txt"
      helperText="PDF, Word, Texto"
      text="Seleccionar documento"
    />
    
    <FileInputField
      label="Múltiples archivos"
      accept="image/*"
      multiple
      helperText="Selecciona varias imágenes"
      text="Seleccionar imágenes"
    />
  </div>
);

// ===== EJEMPLO COMPLETO FUNCIONAL =====

export const CompleteExample = () => {
  const [formData, setFormData] = useState({
    profilePhoto: null,
    documents: [],
    resume: null
  });
  
  const [errors, setErrors] = useState({});
  
  const handleFileChange = (fieldName) => (event) => {
    const files = Array.from(event.target.files || []);
    const value = event.target.multiple ? files : files[0] || null;
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Limpiar error al seleccionar archivo
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: null
      }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    // Validaciones
    if (!formData.profilePhoto) {
      newErrors.profilePhoto = 'La foto de perfil es obligatoria';
    }
    
    if (!formData.resume) {
      newErrors.resume = 'El currículum es obligatorio';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      console.log('📤 Formulario enviado:', formData);
      alert('¡Formulario enviado correctamente!');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: '600px',
      padding: 'var(--space-xl)',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-default)'
    }}>
      <h3 style={{ 
        margin: '0 0 var(--space-xl) 0',
        color: 'var(--text-primary)',
        fontSize: 'var(--font-size-xl)'
      }}>
        📋 Perfil de Usuario
      </h3>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 'var(--space-lg)' 
      }}>
        <FileInputField
          label="Foto de perfil"
          accept="image/*"
          required
          text="Subir foto"
          helperText="JPG, PNG (máx. 2MB)"
          errorText={errors.profilePhoto}
          variant={errors.profilePhoto ? 'danger' : formData.profilePhoto ? 'success' : 'default'}
          onChange={handleFileChange('profilePhoto')}
        />
        
        <FileInputField
          label="Documentos adicionales"
          accept=".pdf,.doc,.docx"
          multiple
          text="Seleccionar documentos"
          helperText="PDF, Word (opcional)"
          onChange={handleFileChange('documents')}
        />
        
        <FileInputField
          label="Currículum Vitae"
          accept=".pdf"
          required
          text="Subir CV"
          helperText="Solo archivos PDF"
          errorText={errors.resume}
          variant={errors.resume ? 'danger' : formData.resume ? 'success' : 'default'}
          onChange={handleFileChange('resume')}
        />
        
        <button
          type="submit"
          style={{
            padding: 'var(--space-md) var(--space-lg)',
            backgroundColor: 'var(--color-primary)',
            color: 'var(--text-on-primary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-medium)',
            cursor: 'pointer',
            marginTop: 'var(--space-md)'
          }}
        >
          📤 Enviar Perfil
        </button>
      </div>
      
      {/* Preview de archivos seleccionados */}
      {(formData.profilePhoto || formData.documents.length > 0 || formData.resume) && (
        <div style={{
          marginTop: 'var(--space-xl)',
          padding: 'var(--space-lg)',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-default)'
        }}>
          <h4 style={{ 
            margin: '0 0 var(--space-md) 0',
            color: 'var(--text-primary)',
            fontSize: 'var(--font-size-lg)'
          }}>
            📎 Archivos seleccionados
          </h4>
          
          {formData.profilePhoto && (
            <div style={{ marginBottom: 'var(--space-sm)' }}>
              <strong>📸 Foto:</strong> {formData.profilePhoto.name} 
              ({(formData.profilePhoto.size / 1024).toFixed(1)} KB)
            </div>
          )}
          
          {formData.documents.length > 0 && (
            <div style={{ marginBottom: 'var(--space-sm)' }}>
              <strong>📄 Documentos:</strong> {formData.documents.length} archivo(s)
              <ul style={{ margin: '0.5rem 0', paddingLeft: '2rem' }}>
                {formData.documents.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
          
          {formData.resume && (
            <div>
              <strong>📋 CV:</strong> {formData.resume.name} 
              ({(formData.resume.size / 1024).toFixed(1)} KB)
            </div>
          )}
        </div>
      )}
    </form>
  );
};

CompleteExample.parameters = {
  docs: {
    description: {
      story: 'Ejemplo completo de formulario con validación, múltiples tipos de archivo y preview funcional.'
    }
  }
};