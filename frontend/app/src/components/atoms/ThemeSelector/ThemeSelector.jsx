import React from 'react';
import { useTheme } from '../../../app/context/ThemeContext';
import './ThemeSelector.css';

function ThemeSelector({
  size = 'md',
  variant = 'default',
  showLabels = false,
  className = '',
  ...restProps
}) {
  const { theme, setTheme, toggleMode, palette } = useTheme();

  const handleChange = (e) => {
    setTheme(e.target.value);
  };

  const selectorClasses = [
    'theme-selector',
    `theme-selector--size-${size}`,
    `theme-selector--variant-${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={selectorClasses} {...restProps}>
      {showLabels && <label className="theme-selector__label">Tema</label>}
      <select
        className="theme-selector__select"
        value={theme}
        onChange={handleChange}
        aria-label="Selector de tema"
      >
        <optgroup label="Por Defecto">
          <option value="light">Claro</option>
          <option value="dark">Oscuro</option>
        </optgroup>
        <optgroup label="Océano">
          <option value="ocean-light">Claro</option>
          <option value="ocean-dark">Oscuro</option>
        </optgroup>
        <optgroup label="Bosque">
          <option value="forest-light">Claro</option>
          <option value="forest-dark">Oscuro</option>
        </optgroup>
        <optgroup label="Atardecer">
          <option value="sunset-light">Claro</option>
          <option value="sunset-dark">Oscuro</option>
        </optgroup>
        <optgroup label="Violeta">
          <option value="purple-light">Claro</option>
          <option value="purple-dark">Oscuro</option>
        </optgroup>
      </select>
      <button
        type="button"
        className="theme-selector__toggle"
        onClick={toggleMode}
        aria-label="Alternar modo claro/oscuro"
      >
        {palette === 'default' && (theme === 'dark' ? '🌙' : '☀️')}
        {palette !== 'default' && (theme.endsWith('dark') ? '🌙' : '☀️')}
      </button>
    </div>
  );
}

export { ThemeSelector };
