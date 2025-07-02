// AppHeader.jsx
import React from 'react';
import { Button } from '../../atoms/Button/Button';
import { TextInput } from '../../molecules/TextInput/TextInput';
import { ThemeSelector } from '../../atoms/ThemeSelector';
import './AppHeader.css';

/**
 * Componente AppHeader - Organism
 * 
 * Header principal de la aplicación con título, búsqueda y usuario.
 * Para usar en MainPage y otras páginas principales.
 */
function AppHeader({
  // Título de la app
  appTitle = 'StreamFlix',
  
  // Usuario
  userName = null,
  onLogout = () => {},
  
  // Búsqueda
  searchValue = '',
  onSearchChange = () => {},
  searchPlaceholder = 'Buscar películas, series...',
  showSearch = true,
  
  // Estilos
  variant = 'default',
  size = 'md',
  
  // Props adicionales
  className = '',
  ...restProps
}) {
  
  // Clases CSS dinámicas
  const headerClasses = [
    'app-header',
    `app-header--variant-${variant}`,
    `app-header--size-${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <header className={headerClasses} {...restProps}>
      {/* Brand/Logo */}
      <div className="app-header__brand">
        <h1 className="app-header__title">{appTitle}</h1>
      </div>

      {/* Búsqueda */}
      {showSearch && (
        <div className="app-header__search">
          <TextInput
            type="search"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={onSearchChange}
            leftIcon="🔍"
            size={size === 'lg' ? 'lg' : 'md'}
            className="search-input"
          />
        </div>
      )}

      {/* Usuario */}
      <div className="app-header__user">
        {userName && (
          <span className="app-header__welcome">
            ¡Hola, {userName}!
          </span>
        )}
        <Button
          variant="outline"
          size={size === 'lg' ? 'md' : 'sm'}
          onClick={onLogout}
          className="logout-button"
        >
          Cerrar Sesión
        </Button>
        <ThemeSelector variant="compact" size={size === 'lg' ? 'lg' : 'sm'} />
      </div>
    </header>
  );
}

export { AppHeader };