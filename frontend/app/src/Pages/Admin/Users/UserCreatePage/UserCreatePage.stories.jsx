// ===== USER CREATE PAGE STORIES =====
// src/Pages/Admin/Users/UserCreatePage.stories.jsx

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { UserCreatePage } from './UserCreatePage';
import './UserCreatePage.css';

// ===== WRAPPER CON ROUTER Y MOCK USER =====
const RouterWrapper = ({ children }) => {
  React.useEffect(() => {
    if (!sessionStorage.getItem('sessionUser')) {
      sessionStorage.setItem('sessionUser', JSON.stringify({
        id: 1,
        email: 'admin@streamapp.com',
        roleId: 1,
        role: 'admin'
      }));
    }
    
    return () => {
      sessionStorage.removeItem('sessionUser');
    };
  }, []);

  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

export default {
  title: 'Pages/Admin/UserCreatePage',
  component: UserCreatePage,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <RouterWrapper>
        <Story />
      </RouterWrapper>
    )
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# UserCreatePage

Página para crear nuevos usuarios usando DynamicForm del sistema de diseño.

## Componentes integrados
- **AdminLayout**: Layout con breadcrumbs
- **DynamicForm**: Formulario con validaciones
- **Button**: Acciones del header

## Funcionalidades
- ✅ Formulario con validaciones
- ✅ Campos: email, password, rol, estado
- ✅ Validación de contraseñas coincidentes
- ✅ Integración con createUserService
- ✅ Estados de loading/success/error
- ✅ Información sobre roles y seguridad
        `
      }
    }
  }
};

// ========== PÁGINA PRINCIPAL ==========
export const Default = () => <UserCreatePage />;

Default.parameters = {
  docs: {
    description: {
      story: 'Página completa para crear usuarios con formulario dinámico, validaciones y estados de carga.'
    }
  }
};