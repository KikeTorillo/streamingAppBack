// components/atoms/Checkbox/Checkbox.jsx
import React from 'react';
import './Checkbox.css';

/**
 * Componente Checkbox del sistema de diseño
 * 
 * @param {Object} props - Propiedades del componente
 * @param {boolean} [props.checked=false] - Estado del checkbox
 * @param {function} [props.onChange] - Función ejecutada al cambiar
 * @param {boolean} [props.disabled=false] - Si está deshabilitado
 * @param {string} [props.label] - Texto del label
 * @param {string} [props.helperText] - Texto de ayuda
 * @param {string} [props.error] - Mensaje de error
 * @param {'xs'|'sm'|'md'|'lg'} [props.size='md'] - Tamaño del checkbox
 * @param {string} [props.name] - Nombre del input
 * @param {string} [props.value] - Valor del input
 * @param {string} [props.id] - ID del input
 * @param {boolean} [props.required=false] - Si es requerido
 * @param {string} [props.className=''] - Clases adicionales
 */
function Checkbox({
  checked = false,
  onChange,
  disabled = false,
  label,
  helperText,
  error,
  size = 'md',
  name,
  value,
  id,
  required = false,
  className = '',
  ...props
}) {
  const inputId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  
  const checkboxClasses = [
    'checkbox',
    `checkbox--${size}`,
    error && 'checkbox--error',
    disabled && 'checkbox--disabled',
    className
  ].filter(Boolean).join(' ');

  const containerClasses = [
    'checkbox-container',
    disabled && 'checkbox-container--disabled'
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className="checkbox-wrapper">
        <input
          type="checkbox"
          id={inputId}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={checkboxClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            [
              helperText && `${inputId}-helper`,
              error && `${inputId}-error`
            ].filter(Boolean).join(' ') || undefined
          }
          {...props}
        />
        
        {/* Custom checkbox visual */}
        <div className="checkbox-custom">
          <svg 
            className="checkbox-check" 
            viewBox="0 0 16 16" 
            fill="none"
            aria-hidden="true"
          >
            <path 
              d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
              fill="currentColor"
            />
          </svg>
        </div>
        
        {label && (
          <label htmlFor={inputId} className="checkbox-label">
            {label}
            {required && <span className="checkbox-required">*</span>}
          </label>
        )}
      </div>
      
      {helperText && !error && (
        <div id={`${inputId}-helper`} className="checkbox-helper">
          {helperText}
        </div>
      )}
      
      {error && (
        <div id={`${inputId}-error`} className="checkbox-error">
          {error}
        </div>
      )}
    </div>
  );
}

export { Checkbox };