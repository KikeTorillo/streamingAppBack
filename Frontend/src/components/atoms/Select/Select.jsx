// atoms/Select/Select.jsx
import React, { forwardRef } from 'react';
import './Select.css';

/**
 * Componente Select mejorado que sigue el sistema de diseño
 * Átomo base para campos de selección que mantiene consistencia con Input
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} [props.options=[]] - Array de opciones {value, label, disabled?}
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del select
 * @param {'default'|'error'|'success'|'warning'} [props.variant='default'] - Variante semántica
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='md'] - Radio de bordes
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {string} [props.value] - Valor controlado
 * @param {string} [props.defaultValue] - Valor por defecto (no controlado)
 * @param {function} [props.onChange] - Handler de cambio
 * @param {function} [props.onFocus] - Handler de focus
 * @param {function} [props.onBlur] - Handler de blur
 * @param {string} [props.placeholder] - Texto placeholder (primera opción)
 * @param {boolean} [props.disabled=false] - Si está deshabilitado
 * @param {boolean} [props.required=false] - Si es requerido
 * @param {boolean} [props.autoFocus=false] - Si obtiene foco automáticamente
 * @param {boolean} [props.compact=false] - Padding horizontal reducido
 * @param {string} [props.ariaLabel] - Label para accesibilidad
 * @param {string} [props.ariaDescribedBy] - ID del elemento que describe el select
 * @param {string} [props.ariaErrorMessage] - ID del mensaje de error
 * @param {React.Ref} ref - Referencia al elemento select
 */
const Select = forwardRef(({
  options = [],
  size = 'md',
  variant = 'default',
  rounded = 'md',
  className = '',
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  disabled = false,
  required = false,
  autoFocus = false,
  compact = false,
  ariaLabel,
  ariaDescribedBy,
  ariaErrorMessage,
  ...restProps
}, ref) => {
  
  // Construir las clases CSS dinámicamente (igual que Input)
  const selectClasses = [
    'select-base',
    `select-base--${size}`,
    variant !== 'default' && `select-base--${variant}`,
    rounded !== 'md' && `select-base--rounded-${rounded}`,
    compact && 'select-base--compact',
    className
  ].filter(Boolean).join(' ');

  // Props adicionales para accesibilidad (igual que Input)
  const accessibilityProps = {
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': variant === 'error' ? ariaErrorMessage : undefined,
    'aria-invalid': variant === 'error' ? 'true' : undefined,
    'aria-required': required ? 'true' : undefined
  };

  return (
    <div className="select-wrapper">
      <select
        ref={ref}
        className={selectClasses}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        autoFocus={autoFocus}
        {...accessibilityProps}
        {...restProps}
      >
        {/* Opción placeholder si se proporciona */}
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        
        {/* Renderizar opciones */}
        {options.map((option, index) => {
          // Soportar string simple o objeto {value, label, disabled}
          const optionValue = typeof option === 'string' ? option : option.value;
          const optionLabel = typeof option === 'string' ? option : option.label;
          const optionDisabled = typeof option === 'object' ? option.disabled : false;
          
          return (
            <option
              key={`${optionValue}-${index}`}
              value={optionValue}
              disabled={optionDisabled}
            >
              {optionLabel}
            </option>
          );
        })}
      </select>
      
      {/* Icono de flecha personalizado */}
      <div className="select-base__arrow" aria-hidden="true">
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none"
          className="select-base__arrow-icon"
        >
          <path 
            d="M5 7.5L10 12.5L15 7.5" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
});

Select.displayName = 'Select';

export { Select };