// ===== DATA TABLE STORIES =====
// src/components/organism/DataTable/DataTable.stories.jsx

import React, { useState } from 'react';
import { DataTable } from './DataTable';
import { Button } from '../../atoms/Button/Button';
import './DataTable.css';

export default {
  title: 'Components/Organism/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# DataTable Organism

Organismo completo para mostrar datos tabulares con funcionalidades avanzadas. **Refactorizado desde el componente Table original** para ser un organismo correcto que usa el sistema de diseño.

## 🎯 Características implementadas

- **✅ Organismo correcto**: Movido de atoms/ a organism/ donde pertenece
- **✅ Sistema de diseño**: Usa Button, TextInput, Select y variables CSS
- **✅ Sin dependencias externas**: Eliminada dependencia de @headlessui/react
- **✅ TanStack React Table**: Funcionalidades avanzadas de tabla
- **✅ Estados completos**: Loading, empty, error con componentes del sistema
- **✅ Responsive design**: Mobile, tablet, desktop
- **✅ Accesibilidad**: ARIA, navegación por teclado, lectores de pantalla
- **✅ Búsqueda global**: Con debounce para performance
- **✅ Paginación**: Configurable con múltiples tamaños
- **✅ Ordenamiento**: Por columnas clickeables
- **✅ Acciones CRUD**: Ver, editar, eliminar por fila
- **✅ Variantes**: Default, striped, bordered, compact

## 🏗️ Arquitectura (Organismo correcto)

\`\`\`
DataTable (Organism) 🧬
├── Controls
│   ├── TextInput (Molécula) 🧬 - Búsqueda
│   └── Select (Átomo) ⚛️ - Tamaño de página
├── Table
│   ├── Header con ordenamiento
│   ├── Body con datos/skeleton
│   └── ActionsDropdown (sin dependencias)
├── Footer
│   ├── Info de resultados
│   └── Pagination con Button (Átomo) ⚛️
└── Estados especiales
    └── EmptyState (Molécula) 🧬
\`\`\`

## 🔧 Uso básico

\`\`\`jsx
import { DataTable } from './organism/DataTable';

// Columnas para usuarios
const userColumns = [
  { accessorKey: 'id', header: 'ID', size: 80 },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Rol', size: 120 },
  { accessorKey: 'createdAt', header: 'Creado', size: 150 }
];

// Datos de ejemplo
const users = [
  { id: 1, email: 'admin@app.com', role: 'Admin', createdAt: '2024-01-15' },
  { id: 2, email: 'user@app.com', role: 'Usuario', createdAt: '2024-01-16' }
];

// Uso básico
<DataTable
  data={users}
  columns={userColumns}
  onEdit={(user) => console.log('Editar:', user)}
  onDelete={(user) => console.log('Eliminar:', user)}
  onView={(user) => console.log('Ver:', user)}
/>
\`\`\`

## 📊 Uso avanzado con estados

\`\`\`jsx
// Con todos los estados y configuraciones
<DataTable
  data={data}
  columns={columns}
  loading={isLoading}
  error={errorMessage}
  searchPlaceholder="Buscar usuarios..."
  pageSizeOptions={[10, 25, 50, 100]}
  defaultPageSize={25}
  variant="striped"
  emptyTitle="No hay usuarios"
  emptyDescription="Crea tu primer usuario"
  emptyIcon="👥"
  onEdit={handleEdit}
  onDelete={handleDelete}
  onView={handleView}
/>
\`\`\`

## 🎨 Variantes disponibles

- **Default**: Tabla estándar con hover
- **Striped**: Filas alternadas con color
- **Bordered**: Bordes en todas las celdas
- **Compact**: Espaciado reducido para más datos

## 📱 Responsive

- **Desktop**: Tabla completa con todas las funcionalidades
- **Tablet**: Controles apilados, tabla scrolleable
- **Mobile**: Menú de acciones adaptado, paginación centrada

## ♿ Accesibilidad

- **ARIA**: Roles de tabla, labels descriptivos
- **Navegación por teclado**: Tab, Enter, Escape
- **Lectores de pantalla**: Anuncios de ordenamiento y paginación
- **Reduced motion**: Respeta preferencias del usuario
        `
      }
    }
  },
  argTypes: {
    data: {
      name: 'Datos',
      description: 'Array de objetos con los datos a mostrar',
      control: 'object',
      table: {
        type: { summary: 'Array<Object>' }
      }
    },
    columns: {
      name: 'Columnas',
      description: 'Configuración de columnas compatible con TanStack React Table',
      control: 'object',
      table: {
        type: { summary: 'Array<ColumnDef>' }
      }
    },
    loading: {
      name: 'Cargando',
      description: 'Muestra skeleton loading en lugar de datos',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    error: {
      name: 'Error',
      description: 'Mensaje de error a mostrar',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    variant: {
      name: 'Variante',
      description: 'Estilo visual de la tabla',
      control: 'select',
      options: ['default', 'striped', 'bordered', 'compact'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' }
      }
    },
    searchPlaceholder: {
      name: 'Placeholder búsqueda',
      description: 'Texto del campo de búsqueda',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Buscar...' }
      }
    },
    pageSizeOptions: {
      name: 'Opciones de paginación',
      description: 'Array con los tamaños de página disponibles',
      control: 'object',
      table: {
        type: { summary: 'Array<number>' },
        defaultValue: { summary: '[10, 25, 50, 100]' }
      }
    },
    showActions: {
      name: 'Mostrar acciones',
      description: 'Muestra la columna de acciones',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    onEdit: {
      name: 'Función editar',
      description: 'Callback cuando se hace click en editar',
      action: 'edit',
      table: {
        type: { summary: 'function' }
      }
    },
    onDelete: {
      name: 'Función eliminar',
      description: 'Callback cuando se hace click en eliminar',
      action: 'delete',
      table: {
        type: { summary: 'function' }
      }
    },
    onView: {
      name: 'Función ver',
      description: 'Callback cuando se hace click en ver',
      action: 'view',
      table: {
        type: { summary: 'function' }
      }
    }
  }
};

// ===== DATOS MOCK PARA DEMOS =====
const MOCK_USERS = [
  { 
    id: 1, 
    email: 'admin@streamapp.com', 
    role: 'Administrador', 
    status: 'Activo',
    createdAt: '2024-01-15',
    lastLogin: '2024-06-20'
  },
  { 
    id: 2, 
    email: 'editor@streamapp.com', 
    role: 'Editor', 
    status: 'Activo',
    createdAt: '2024-01-20',
    lastLogin: '2024-06-19'
  },
  { 
    id: 3, 
    email: 'user1@example.com', 
    role: 'Usuario', 
    status: 'Inactivo',
    createdAt: '2024-02-01',
    lastLogin: '2024-05-15'
  },
  { 
    id: 4, 
    email: 'user2@example.com', 
    role: 'Usuario', 
    status: 'Activo',
    createdAt: '2024-02-10',
    lastLogin: '2024-06-18'
  },
  { 
    id: 5, 
    email: 'moderator@streamapp.com', 
    role: 'Moderador', 
    status: 'Activo',
    createdAt: '2024-03-01',
    lastLogin: '2024-06-21'
  }
];

const MOCK_MOVIES = [
  {
    id: 1,
    title: 'Spider-Man: No Way Home',
    category: 'Acción',
    year: 2021,
    duration: '148 min',
    rating: 8.4,
    status: 'Publicado'
  },
  {
    id: 2,
    title: 'Dune',
    category: 'Sci-Fi',
    year: 2021,
    duration: '155 min',
    rating: 8.0,
    status: 'Publicado'
  },
  {
    id: 3,
    title: 'The Batman',
    category: 'Acción',
    year: 2022,
    duration: '176 min',
    rating: 7.8,
    status: 'Borrador'
  },
  {
    id: 4,
    title: 'Top Gun: Maverick',
    category: 'Acción',
    year: 2022,
    duration: '130 min',
    rating: 8.3,
    status: 'Publicado'
  }
];

// ===== CONFIGURACIONES DE COLUMNAS =====
const userColumns = [
  { 
    accessorKey: 'id', 
    header: 'ID', 
    size: 80,
    cell: ({ getValue }) => (
      <span className="data-table__cell--center">#{getValue()}</span>
    )
  },
  { 
    accessorKey: 'email', 
    header: 'Correo Electrónico',
    cell: ({ getValue }) => (
      <span className="data-table__cell--truncate">{getValue()}</span>
    )
  },
  { 
    accessorKey: 'role', 
    header: 'Rol',
    size: 120,
    cell: ({ getValue }) => {
      const role = getValue();
      const variant = role === 'Administrador' ? 'info' : 
                    role === 'Editor' ? 'warning' : 'success';
      return (
        <span className={`data-table__badge data-table__badge--${variant}`}>
          {role}
        </span>
      );
    }
  },
  { 
    accessorKey: 'status', 
    header: 'Estado',
    size: 100,
    cell: ({ getValue }) => {
      const status = getValue();
      const variant = status === 'Activo' ? 'success' : 'danger';
      return (
        <span className={`data-table__badge data-table__badge--${variant}`}>
          {status}
        </span>
      );
    }
  },
  { 
    accessorKey: 'createdAt', 
    header: 'Fecha de Registro',
    size: 150,
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString('es-ES')
  }
];

const movieColumns = [
  { 
    accessorKey: 'id', 
    header: 'ID', 
    size: 60,
    cell: ({ getValue }) => `#${getValue()}`
  },
  { 
    accessorKey: 'title', 
    header: 'Título',
    cell: ({ getValue }) => (
      <span className="data-table__cell--truncate">{getValue()}</span>
    )
  },
  { 
    accessorKey: 'category', 
    header: 'Categoría',
    size: 120
  },
  { 
    accessorKey: 'year', 
    header: 'Año',
    size: 80,
    cell: ({ getValue }) => (
      <span className="data-table__cell--center">{getValue()}</span>
    )
  },
  { 
    accessorKey: 'duration', 
    header: 'Duración',
    size: 100,
    cell: ({ getValue }) => (
      <span className="data-table__cell--center">{getValue()}</span>
    )
  },
  { 
    accessorKey: 'rating', 
    header: 'Rating',
    size: 80,
    cell: ({ getValue }) => (
      <span className="data-table__cell--center">⭐ {getValue()}</span>
    )
  },
  { 
    accessorKey: 'status', 
    header: 'Estado',
    size: 100,
    cell: ({ getValue }) => {
      const status = getValue();
      const variant = status === 'Publicado' ? 'success' : 'warning';
      return (
        <span className={`data-table__badge data-table__badge--${variant}`}>
          {status}
        </span>
      );
    }
  }
];

// ===== TEMPLATE BASE =====
const Template = (args) => {
  const [data, setData] = useState(args.data);

  const handleEdit = (row) => {
    console.log('Editar:', row);
    args.onEdit?.(row);
  };

  const handleDelete = (row) => {
    console.log('Eliminar:', row);
    if (window.confirm(`¿Eliminar el elemento con ID ${row.id}?`)) {
      setData(prevData => prevData.filter(item => item.id !== row.id));
    }
    args.onDelete?.(row);
  };

  const handleView = (row) => {
    console.log('Ver detalles:', row);
    args.onView?.(row);
  };

  return (
    <DataTable
      {...args}
      data={data}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onView={handleView}
    />
  );
};

// ========== HISTORIAS PRINCIPALES ==========

export const Playground = Template.bind({});
Playground.args = {
  data: MOCK_USERS,
  columns: userColumns,
  variant: 'default',
  loading: false,
  searchPlaceholder: 'Buscar usuarios...',
  pageSizeOptions: [10, 25, 50],
  defaultPageSize: 10
};
Playground.parameters = {
  docs: {
    description: {
      story: 'Usa los controles para experimentar con todas las opciones del DataTable. Este organismo combina múltiples componentes del sistema de diseño.'
    }
  }
};

// ========== GESTIÓN DE USUARIOS ==========
export const UsersTable = () => (
  <div style={{ padding: 'var(--space-lg)' }}>
    <div style={{ marginBottom: 'var(--space-lg)' }}>
      <h2 style={{ 
        margin: '0 0 var(--space-sm) 0',
        fontSize: 'var(--font-size-xl)',
        color: 'var(--text-primary)'
      }}>
        Gestión de Usuarios
      </h2>
      <p style={{ 
        margin: 0,
        color: 'var(--text-secondary)',
        fontSize: 'var(--font-size-sm)'
      }}>
        Administra las cuentas de usuario y sus permisos
      </p>
    </div>
    
    <DataTable
      data={MOCK_USERS}
      columns={userColumns}
      searchPlaceholder="Buscar por email o rol..."
      emptyTitle="No hay usuarios registrados"
      emptyDescription="Crea tu primer usuario para comenzar"
      emptyIcon="👥"
      onEdit={(user) => console.log('Editar usuario:', user)}
      onDelete={(user) => console.log('Eliminar usuario:', user)}
      onView={(user) => console.log('Ver perfil:', user)}
    />
  </div>
);

UsersTable.parameters = {
  docs: {
    description: {
      story: 'Ejemplo de uso real para gestión de usuarios con columnas personalizadas, badges de estado y acciones CRUD.'
    }
  }
};

// ========== GESTIÓN DE PELÍCULAS ==========
export const MoviesTable = () => (
  <div style={{ padding: 'var(--space-lg)' }}>
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: 'var(--space-lg)',
      flexWrap: 'wrap',
      gap: 'var(--space-md)'
    }}>
      <div>
        <h2 style={{ 
          margin: '0 0 var(--space-sm) 0',
          fontSize: 'var(--font-size-xl)',
          color: 'var(--text-primary)'
        }}>
          Catálogo de Películas
        </h2>
        <p style={{ 
          margin: 0,
          color: 'var(--text-secondary)',
          fontSize: 'var(--font-size-sm)'
        }}>
          {MOCK_MOVIES.length} películas en total
        </p>
      </div>
      
      <Button variant="primary" size="sm">
        ➕ Agregar Película
      </Button>
    </div>
    
    <DataTable
      data={MOCK_MOVIES}
      columns={movieColumns}
      variant="striped"
      searchPlaceholder="Buscar películas..."
      defaultPageSize={25}
      emptyTitle="No hay películas en el catálogo"
      emptyDescription="Agrega tu primera película al catálogo"
      emptyIcon="🎬"
      onEdit={(movie) => console.log('Editar película:', movie)}
      onDelete={(movie) => console.log('Eliminar película:', movie)}
      onView={(movie) => console.log('Ver detalles:', movie)}
    />
  </div>
);

MoviesTable.parameters = {
  docs: {
    description: {
      story: 'Ejemplo para gestión de películas con variante striped, headers contextuales y acciones específicas del dominio.'
    }
  }
};

// ========== VARIANTES ==========
export const VariantDefault = Template.bind({});
VariantDefault.args = {
  data: MOCK_USERS.slice(0, 3),
  columns: userColumns,
  variant: 'default'
};

export const VariantStriped = Template.bind({});
VariantStriped.args = {
  data: MOCK_USERS.slice(0, 3),
  columns: userColumns,
  variant: 'striped'
};

export const VariantBordered = Template.bind({});
VariantBordered.args = {
  data: MOCK_USERS.slice(0, 3),
  columns: userColumns,
  variant: 'bordered'
};

export const VariantCompact = Template.bind({});
VariantCompact.args = {
  data: MOCK_USERS,
  columns: userColumns,
  variant: 'compact'
};

// ========== ESTADOS ==========
export const LoadingState = () => (
  <DataTable
    data={MOCK_USERS}
    columns={userColumns}
    loading={true}
    searchPlaceholder="Cargando datos..."
  />
);

LoadingState.parameters = {
  docs: {
    description: {
      story: 'Estado de loading con skeleton rows animados mientras se cargan los datos del servidor.'
    }
  }
};

export const EmptyState = () => (
  <DataTable
    data={[]}
    columns={userColumns}
    emptyTitle="No hay usuarios registrados"
    emptyDescription="Crea tu primer usuario para comenzar a gestionar tu plataforma"
    emptyIcon="👥"
  />
);

EmptyState.parameters = {
  docs: {
    description: {
      story: 'Estado vacío cuando no hay datos para mostrar, con mensaje personalizable.'
    }
  }
};

export const ErrorState = () => (
  <DataTable
    data={[]}
    columns={userColumns}
    error="Error al conectar con el servidor. Verifica tu conexión a internet."
  />
);

ErrorState.parameters = {
  docs: {
    description: {
      story: 'Estado de error con mensaje personalizable y botón de reintento.'
    }
  }
};

// ========== SIN ACCIONES ==========
export const WithoutActions = Template.bind({});
WithoutActions.args = {
  data: MOCK_USERS.slice(0, 3),
  columns: userColumns,
  showActions: false
};

WithoutActions.parameters = {
  docs: {
    description: {
      story: 'Tabla sin columna de acciones para casos donde solo se muestra información.'
    }
  }
};

// ========== RESPONSIVE DEMO ==========
export const ResponsiveDemo = () => (
  <div>
    <div style={{ 
      marginBottom: 'var(--space-lg)',
      padding: 'var(--space-md)',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-default)'
    }}>
      <h3 style={{ 
        margin: '0 0 var(--space-sm) 0',
        fontSize: 'var(--font-size-base)',
        color: 'var(--text-primary)'
      }}>
        📱 Responsive Design
      </h3>
      <p style={{ 
        margin: 0,
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)'
      }}>
        Cambia el tamaño de la ventana para ver cómo se adapta la tabla en diferentes dispositivos.
      </p>
    </div>
    
    <DataTable
      data={MOCK_MOVIES}
      columns={movieColumns}
      variant="bordered"
      searchPlaceholder="Prueba la búsqueda responsive..."
      defaultPageSize={5}
    />
  </div>
);

ResponsiveDemo.parameters = {
  docs: {
    description: {
      story: 'Demostración del comportamiento responsive del DataTable en diferentes tamaños de pantalla.'
    }
  }
};