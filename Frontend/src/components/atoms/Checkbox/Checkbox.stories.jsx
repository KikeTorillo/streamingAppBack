// components/atoms/Checkbox/Checkbox.stories.jsx
import React, { useState } from 'react';
import { Checkbox } from './Checkbox';

export default {
  title: 'Components/Atoms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Checkbox

Componente de checkbox personalizado que sigue el sistema de diseño. Ofrece control total sobre la apariencia y estados del checkbox.

## 🎯 Características

- **Diseño personalizado**: Control total sobre la apariencia
- **Estados**: Normal, hover, focus, disabled, error
- **Tamaños**: xs, sm, md, lg
- **Accesibilidad**: ARIA labels, navegación por teclado
- **Responsive**: Área táctil ampliada en móvil

## 🎨 Variantes

- **Tamaños**: Cuatro tamaños disponibles
- **Estados**: Múltiples estados visuales
- **Con/sin label**: Flexible para diferentes usos
        `
      }
    }
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Estado del checkbox'
    },
    disabled: {
      control: 'boolean',
      description: 'Si está deshabilitado'
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Tamaño del checkbox'
    },
    label: {
      control: 'text',
      description: 'Texto del label'
    },
    helperText: {
      control: 'text',
      description: 'Texto de ayuda'
    },
    error: {
      control: 'text',
      description: 'Mensaje de error'
    },
    required: {
      control: 'boolean',
      description: 'Si es requerido'
    }
  }
};

// Hook para estados controlados
const useCheckboxState = (initialValue = false) => {
  const [checked, setChecked] = useState(initialValue);
  return [checked, (e) => setChecked(e.target.checked)];
};

// ===== HISTORIA BÁSICA =====
export const Default = {
  args: {
    label: 'Acepto los términos y condiciones',
    checked: false
  },
  render: (args) => {
    const [checked, handleChange] = useCheckboxState(args.checked);
    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={handleChange}
      />
    );
  }
};

// ===== TAMAÑOS =====
export const Sizes = {
  render: () => {
    const [xs, setXs] = useCheckboxState(false);
    const [sm, setSm] = useCheckboxState(true);
    const [md, setMd] = useCheckboxState(false);
    const [lg, setLg] = useCheckboxState(true);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Checkbox
          size="xs"
          label="Extra pequeño (xs)"
          checked={xs}
          onChange={setXs}
        />
        <Checkbox
          size="sm"
          label="Pequeño (sm)"
          checked={sm}
          onChange={setSm}
        />
        <Checkbox
          size="md"
          label="Mediano (md)"
          checked={md}
          onChange={setMd}
        />
        <Checkbox
          size="lg"
          label="Grande (lg)"
          checked={lg}
          onChange={setLg}
        />
      </div>
    );
  }
};

// ===== ESTADOS =====
export const States = {
  render: () => {
    const [normal, setNormal] = useCheckboxState(false);
    const [checked, setChecked] = useCheckboxState(true);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Checkbox
          label="Normal (no marcado)"
          checked={normal}
          onChange={setNormal}
        />
        <Checkbox
          label="Marcado"
          checked={checked}
          onChange={setChecked}
        />
        <Checkbox
          label="Deshabilitado (normal)"
          disabled
          checked={false}
        />
        <Checkbox
          label="Deshabilitado (marcado)"
          disabled
          checked={true}
        />
        <Checkbox
          label="Con error"
          error="Este campo es requerido"
          checked={false}
        />
      </div>
    );
  }
};

// ===== CON HELPER TEXT =====
export const WithHelperText = {
  render: () => {
    const [marketing, setMarketing] = useCheckboxState(false);
    const [newsletter, setNewsletter] = useCheckboxState(true);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Checkbox
          label="Recibir emails de marketing"
          helperText="Te enviaremos ofertas y promociones especiales"
          checked={marketing}
          onChange={setMarketing}
        />
        <Checkbox
          label="Suscribirse al newsletter"
          helperText="Recibe nuestras actualizaciones semanales"
          checked={newsletter}
          onChange={setNewsletter}
        />
      </div>
    );
  }
};

// ===== REQUERIDO =====
export const Required = {
  render: () => {
    const [terms, setTerms] = useCheckboxState(false);
    const [privacy, setPrivacy] = useCheckboxState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Checkbox
          label="Acepto los términos y condiciones"
          required
          helperText="Debes aceptar para continuar"
          checked={terms}
          onChange={setTerms}
        />
        <Checkbox
          label="Acepto la política de privacidad"
          required
          error={!privacy ? "Debes aceptar la política de privacidad" : ""}
          checked={privacy}
          onChange={setPrivacy}
        />
      </div>
    );
  }
};

// ===== SIN LABEL =====
export const WithoutLabel = {
  render: () => {
    const [item1, setItem1] = useCheckboxState(false);
    const [item2, setItem2] = useCheckboxState(true);
    const [item3, setItem3] = useCheckboxState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Checkbox checked={item1} onChange={setItem1} />
          <span>Tarea 1</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Checkbox checked={item2} onChange={setItem2} />
          <span>Tarea 2 (completada)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Checkbox checked={item3} onChange={setItem3} />
          <span>Tarea 3</span>
        </div>
      </div>
    );
  }
};

// ===== LISTA DE SELECCIÓN =====
export const SelectionList = {
  render: () => {
    const [selectedItems, setSelectedItems] = useState(['react']);

    const handleItemChange = (value) => (e) => {
      if (e.target.checked) {
        setSelectedItems([...selectedItems, value]);
      } else {
        setSelectedItems(selectedItems.filter(item => item !== value));
      }
    };

    const technologies = [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue.js' },
      { value: 'angular', label: 'Angular' },
      { value: 'svelte', label: 'Svelte' }
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>
          Selecciona tus tecnologías favoritas:
        </h3>
        {technologies.map(tech => (
          <Checkbox
            key={tech.value}
            label={tech.label}
            checked={selectedItems.includes(tech.value)}
            onChange={handleItemChange(tech.value)}
            value={tech.value}
          />
        ))}
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '0.5rem' 
        }}>
          <strong>Seleccionadas:</strong> {selectedItems.join(', ') || 'Ninguna'}
        </div>
      </div>
    );
  }
};

// ===== INTERACTIVO =====
export const Interactive = {
  args: {
    label: 'Checkbox interactivo',
    helperText: 'Puedes interactuar con este checkbox',
    size: 'md',
    required: false,
    disabled: false
  },
  render: (args) => {
    const [checked, handleChange] = useCheckboxState(false);
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Checkbox
          {...args}
          checked={checked}
          onChange={handleChange}
        />
        <div style={{ 
          padding: '1rem', 
          backgroundColor: checked ? '#dcfce7' : '#fef3c7',
          borderRadius: '0.5rem',
          border: `1px solid ${checked ? '#16a34a' : '#d97706'}`
        }}>
          Estado: <strong>{checked ? 'Marcado' : 'No marcado'}</strong>
        </div>
      </div>
    );
  }
};