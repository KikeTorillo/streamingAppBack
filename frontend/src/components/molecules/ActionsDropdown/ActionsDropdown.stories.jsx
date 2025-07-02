// ===== ACTIONS DROPDOWN STORIES =====
// src/components/molecules/ActionsDropdown/ActionsDropdown.stories.jsx

import React, { useState } from 'react';
import { ActionsDropdown } from './ActionsDropdown';
import './ActionsDropdown.css';

export default {
  title: 'Components/Molecules/ActionsDropdown',
  component: ActionsDropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# ActionsDropdown Molecule

Molécula **ActionsDropdown** es un componente especializado para mostrar menús de acciones contextuales en tablas, listas y cards. 
Combina un Button (átomo) como trigger con un menú desplegable nativo, sin dependencias externas.

## 🎯 Características principales

- **4 posiciones**: Bottom-right, Bottom-left, Top-right, Top-left
- **4 tamaños de trigger**: XS, SM, MD, LG (hereda de Button)
- **2 variantes de trigger**: Ghost, Outline
- **Acciones personalizables**: Label, icon, variant (danger), shortcuts
- **Navegación por teclado**: Escape, flechas, Home, End
- **Click fuera para cerrar**: Backdrop transparente
- **Estados completos**: Disabled, loading, focus
- **Accesibilidad completa**: ARIA, roles, labels
- **Mobile optimized**: Área táctil 44px, menús adaptativos

## 🏗️ Arquitectura (Molécula correcta)

\`\`\`
ActionsDropdown (Molécula) 🧬
├── Button (Átomo) ⚛️ - Trigger
├── Backdrop nativo - Click fuera
└── Menu
    └── Items - Acciones individuales
\`\`\`

## 🔧 Uso básico

\`\`\`jsx
import { ActionsDropdown } from './molecules/ActionsDropdown';

// Acciones básicas
const userActions = [
  {
    label: 'Ver perfil',
    icon: '👁️',
    onClick: (user) => console.log('Ver:', user),
  },
  {
    label: 'Editar',
    icon: '✏️',
    onClick: (user) => editUser(user),
  },
  {
    label: 'Eliminar',
    icon: '🗑️',
    variant: 'danger',
    onClick: (user) => deleteUser(user),
  }
];

// Uso en tabla
<ActionsDropdown
  actions={userActions}
  data={userRowData}
  size="sm"
  position="bottom-right"
/>
\`\`\`

## 🎨 Casos de uso

### En DataTable
\`\`\`jsx
// Columna de acciones en DataTable
const columns = [
  { accessorKey: 'name', header: 'Nombre' },
  { accessorKey: 'email', header: 'Email' },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => (
      <ActionsDropdown
        actions={tableActions}
        data={row.original}
        size="sm"
      />
    )
  }
];
\`\`\`

### En Cards
\`\`\`jsx
// En esquina superior derecha de cards
<Card>
  <div style={{ position: 'relative' }}>
    <ActionsDropdown
      actions={cardActions}
      data={cardData}
      position="bottom-left"
      variant="ghost"
    />
  </div>
  <CardContent>...</CardContent>
</Card>
\`\`\`

## ⌨️ Navegación por teclado

- **Tab**: Focus en trigger
- **Enter/Space**: Abrir menú
- **Escape**: Cerrar menú y volver al trigger
- **↓**: Siguiente acción
- **↑**: Acción anterior
- **Home**: Primera acción
- **End**: Última acción

## 📱 Responsive

- **Desktop**: Menú posicionado relativamente
- **Tablet**: Menús más anchos, área táctil aumentada
- **Mobile**: Menús centrados, touch-friendly

## ♿ Accesibilidad

- **ARIA**: menubutton, menu, menuitem roles
- **Labels**: Descriptivos para lectores de pantalla
- **Focus management**: Focus correcto al abrir/cerrar
- **High contrast**: Bordes y contrastes reforzados
        `
      }
    }
  },
  argTypes: {
    actions: {
      name: 'Acciones',
      description: 'Array de objetos con las acciones del menú',
      control: 'object',
      table: {
        type: { summary: 'Array<{label, icon, onClick, variant?, disabled?, shortcut?, description?}>' }
      }
    },
    data: {
      name: 'Datos',
      description: 'Objeto con los datos que se pasan a onClick de cada acción',
      control: 'object',
      table: {
        type: { summary: 'Object' }
      }
    },
    size: {
      name: 'Tamaño del trigger',
      description: 'Tamaño del botón trigger (hereda de Button)',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      table: {
        type: { summary: "'xs' | 'sm' | 'md' | 'lg'" },
        defaultValue: { summary: "'sm'" }
      }
    },
    variant: {
      name: 'Variante del trigger',
      description: 'Variante visual del botón trigger',
      control: 'select',
      options: ['ghost', 'outline'],
      table: {
        type: { summary: "'ghost' | 'outline'" },
        defaultValue: { summary: "'ghost'" }
      }
    },
    position: {
      name: 'Posición del menú',
      description: 'Dónde aparece el menú relativo al trigger',
      control: 'select',
      options: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
      table: {
        type: { summary: "'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'" },
        defaultValue: { summary: "'bottom-right'" }
      }
    },
    disabled: {
      name: 'Deshabilitado',
      description: 'Si el dropdown está deshabilitado',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    triggerIcon: {
      name: 'Ícono del trigger',
      description: 'Ícono mostrado en el botón trigger',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'⋮'" }
      }
    },
    triggerLabel: {
      name: 'Label del trigger',
      description: 'Label para accesibilidad (aria-label)',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Opciones'" }
      }
    }
  }
};

// ===== DATOS DE EJEMPLO =====

// Usuario de ejemplo
const SAMPLE_USER = {
  id: 1,
  name: 'Ana García',
  email: 'ana.garcia@example.com',
  role: 'Administrador',
  status: 'active'
};

// Acciones básicas
const BASIC_ACTIONS = [
  {
    label: 'Ver detalle',
    icon: '👁️',
    onClick: (data) => alert(`Ver detalles de: ${data.name}`),
    description: 'Ver información completa del usuario'
  },
  {
    label: 'Editar',
    icon: '✏️',
    onClick: (data) => alert(`Editar usuario: ${data.name}`),
    description: 'Modificar datos del usuario'
  },
  {
    label: 'Eliminar',
    icon: '🗑️',
    variant: 'danger',
    onClick: (data) => alert(`Eliminar usuario: ${data.name}`),
    description: 'Eliminar usuario permanentemente'
  }
];

// Acciones con shortcuts
const ACTIONS_WITH_SHORTCUTS = [
  {
    label: 'Copiar',
    icon: '📋',
    onClick: (data) => navigator.clipboard?.writeText(data.email),
    shortcut: '⌘C'
  },
  {
    label: 'Compartir',
    icon: '🔗',
    onClick: (data) => alert(`Compartir: ${data.name}`),
    shortcut: '⌘S'
  },
  {
    label: 'Exportar',
    icon: '📤',
    onClick: (data) => alert(`Exportar: ${data.name}`),
    shortcut: '⌘E'
  },
  {
    label: 'Imprimir',
    icon: '🖨️',
    onClick: (data) => window.print(),
    shortcut: '⌘P'
  }
];

// Acciones mixtas
const MIXED_ACTIONS = [
  {
    label: 'Activar',
    icon: '✅',
    onClick: (data) => alert(`Activar: ${data.name}`)
  },
  {
    label: 'Suspender',
    icon: '⏸️',
    onClick: (data) => alert(`Suspender: ${data.name}`)
  },
  {
    label: 'Restablecer contraseña',
    icon: '🔑',
    onClick: (data) => alert(`Restablecer contraseña: ${data.name}`)
  },
  {
    label: 'Enviar notificación',
    icon: '📧',
    onClick: (data) => alert(`Enviar notificación a: ${data.name}`)
  },
  {
    label: 'Ver historial',
    icon: '📜',
    onClick: (data) => alert(`Ver historial de: ${data.name}`)
  },
  {
    label: 'Eliminar',
    icon: '🗑️',
    variant: 'danger',
    onClick: (data) => alert(`¡ELIMINAR! ${data.name}`),
    description: 'Esta acción no se puede deshacer'
  }
];

// ========== STORY DEFAULT ==========
export const Default = {
  args: {
    actions: BASIC_ACTIONS,
    data: SAMPLE_USER,
    size: 'sm',
    variant: 'ghost',
    position: 'bottom-right',
    disabled: false,
    triggerIcon: '⋮',
    triggerLabel: 'Opciones de usuario'
  }
};

Default.parameters = {
  docs: {
    description: {
      story: 'ActionsDropdown básico con 3 acciones: Ver, Editar, Eliminar. Usado típicamente en tablas de administración.'
    }
  }
};

// ========== TAMAÑOS DEL TRIGGER ==========
export const TriggerSizes = () => (
  <div style={{
    display: 'flex',
    gap: 'var(--space-xl)',
    alignItems: 'center',
    padding: 'var(--space-xl)',
    flexWrap: 'wrap'
  }}>
    <div style={{ textAlign: 'center' }}>
      <p style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-sm)' }}>Extra Small</p>
      <ActionsDropdown actions={BASIC_ACTIONS} data={SAMPLE_USER} size="xs" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <p style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-sm)' }}>Small</p>
      <ActionsDropdown actions={BASIC_ACTIONS} data={SAMPLE_USER} size="sm" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <p style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-sm)' }}>Medium</p>
      <ActionsDropdown actions={BASIC_ACTIONS} data={SAMPLE_USER} size="md" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <p style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-sm)' }}>Large</p>
      <ActionsDropdown actions={BASIC_ACTIONS} data={SAMPLE_USER} size="lg" />
    </div>
  </div>
);

// ========== POSICIONES DEL MENÚ ==========
export const MenuPositions = () => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'var(--space-3xl)',
    padding: 'var(--space-3xl)',
    minHeight: '40rem'
  }}>
    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
      <div>
        <p style={{ marginBottom: 'var(--space-sm)' }}>Bottom Right</p>
        <ActionsDropdown 
          actions={BASIC_ACTIONS} 
          data={SAMPLE_USER} 
          position="bottom-right"
        />
      </div>
    </div>
    
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
      <div>
        <p style={{ marginBottom: 'var(--space-sm)' }}>Bottom Left</p>
        <ActionsDropdown 
          actions={BASIC_ACTIONS} 
          data={SAMPLE_USER} 
          position="bottom-left"
        />
      </div>
    </div>
    
    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
      <div>
        <p style={{ marginBottom: 'var(--space-sm)' }}>Top Right</p>
        <ActionsDropdown 
          actions={BASIC_ACTIONS} 
          data={SAMPLE_USER} 
          position="top-right"
        />
      </div>
    </div>
    
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
      <div>
        <p style={{ marginBottom: 'var(--space-sm)' }}>Top Left</p>
        <ActionsDropdown 
          actions={BASIC_ACTIONS} 
          data={SAMPLE_USER} 
          position="top-left"
        />
      </div>
    </div>
  </div>
);

// ========== VARIANTES DE TRIGGER ==========
export const TriggerVariants = () => (
  <div style={{
    display: 'flex',
    gap: 'var(--space-xl)',
    alignItems: 'center',
    padding: 'var(--space-xl)'
  }}>
    <div style={{ textAlign: 'center' }}>
      <p style={{ marginBottom: 'var(--space-sm)' }}>Ghost (Invisible)</p>
      <ActionsDropdown actions={BASIC_ACTIONS} data={SAMPLE_USER} variant="ghost" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <p style={{ marginBottom: 'var(--space-sm)' }}>Outline (Con borde)</p>
      <ActionsDropdown actions={BASIC_ACTIONS} data={SAMPLE_USER} variant="outline" />
    </div>
  </div>
);

// ========== ACCIONES CON SHORTCUTS ==========
export const WithShortcuts = () => (
  <div style={{ padding: 'var(--space-xl)' }}>
    <p style={{ marginBottom: 'var(--space-md)' }}>
      Acciones con atajos de teclado (shortcuts)
    </p>
    <ActionsDropdown 
      actions={ACTIONS_WITH_SHORTCUTS} 
      data={SAMPLE_USER}
      triggerLabel="Acciones con shortcuts"
    />
  </div>
);

// ========== SIMULACIÓN EN TABLA ==========
export const InTableContext = () => {
  const users = [
    { id: 1, name: 'Ana García', email: 'ana@example.com', role: 'Admin' },
    { id: 2, name: 'Carlos López', email: 'carlos@example.com', role: 'Usuario' },
    { id: 3, name: 'María Rodríguez', email: 'maria@example.com', role: 'Editor' }
  ];

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <h3 style={{ marginBottom: 'var(--space-lg)' }}>Simulación en tabla de usuarios</h3>
      
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 'var(--font-size-sm)'
      }}>
        <thead>
          <tr style={{ borderBottom: '0.1rem solid var(--border-default)' }}>
            <th style={{ padding: 'var(--space-md)', textAlign: 'left' }}>Nombre</th>
            <th style={{ padding: 'var(--space-md)', textAlign: 'left' }}>Email</th>
            <th style={{ padding: 'var(--space-md)', textAlign: 'left' }}>Rol</th>
            <th style={{ padding: 'var(--space-md)', textAlign: 'center', width: '6rem' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ borderBottom: '0.1rem solid var(--border-light)' }}>
              <td style={{ padding: 'var(--space-md)' }}>{user.name}</td>
              <td style={{ padding: 'var(--space-md)', color: 'var(--text-secondary)' }}>{user.email}</td>
              <td style={{ padding: 'var(--space-md)' }}>
                <span style={{
                  padding: '0.2rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: user.role === 'Admin' ? 'var(--color-primary-light)' : 'var(--bg-muted)',
                  color: user.role === 'Admin' ? 'var(--color-primary)' : 'var(--text-secondary)',
                  fontSize: 'var(--font-size-xs)'
                }}>
                  {user.role}
                </span>
              </td>
              <td style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
                <ActionsDropdown 
                  actions={BASIC_ACTIONS} 
                  data={user}
                  size="sm"
                  triggerLabel={`Acciones para ${user.name}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ========== ESTADO DISABLED ==========
export const DisabledState = () => (
  <div style={{ padding: 'var(--space-xl)' }}>
    <p style={{ marginBottom: 'var(--space-md)', color: 'var(--text-muted)' }}>
      Dropdown deshabilitado (sin interacción)
    </p>
    <ActionsDropdown 
      actions={BASIC_ACTIONS} 
      data={SAMPLE_USER}
      disabled={true}
      triggerLabel="Acciones deshabilitadas"
    />
  </div>
);

// ========== ACCIONES MIXTAS (MUCHAS OPCIONES) ==========
export const ManyActions = () => (
  <div style={{ padding: 'var(--space-xl)' }}>
    <p style={{ marginBottom: 'var(--space-md)' }}>
      Menú con muchas acciones (scroll automático)
    </p>
    <ActionsDropdown 
      actions={MIXED_ACTIONS} 
      data={SAMPLE_USER}
      triggerLabel="Muchas acciones"
    />
  </div>
);

// ========== PLAYGROUND INTERACTIVO ==========
export const Playground = () => {
  const [lastAction, setLastAction] = useState('');

  const interactiveActions = [
    {
      label: 'Acción 1',
      icon: '🎯',
      onClick: (data) => setLastAction(`Ejecutaste: Acción 1 en ${data.name}`)
    },
    {
      label: 'Acción 2',
      icon: '⚡',
      onClick: (data) => setLastAction(`Ejecutaste: Acción 2 en ${data.name}`)
    },
    {
      label: 'Acción Peligrosa',
      icon: '⚠️',
      variant: 'danger',
      onClick: (data) => setLastAction(`¡CUIDADO! Acción peligrosa en ${data.name}`)
    }
  ];

  return (
    <div style={{ padding: 'var(--space-xl)' }}>
      <h3 style={{ marginBottom: 'var(--space-lg)' }}>Playground Interactivo</h3>
      
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <ActionsDropdown 
          actions={interactiveActions} 
          data={SAMPLE_USER}
          triggerLabel="Probar acciones"
        />
      </div>
      
      {lastAction && (
        <div style={{
          padding: 'var(--space-md)',
          backgroundColor: 'var(--color-primary-light)',
          border: '0.1rem solid var(--color-primary)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-primary)',
          fontSize: 'var(--font-size-sm)'
        }}>
          <strong>Resultado:</strong> {lastAction}
        </div>
      )}
    </div>
  );
};