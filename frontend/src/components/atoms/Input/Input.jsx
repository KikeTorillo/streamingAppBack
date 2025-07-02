// atoms/Input.jsx
import React, { forwardRef } from 'react';
import './Input.css';

/**
 * Componente Input mejorado que sigue el sistema de diseño
 * Átomo base para campos de entrada de texto
 * 
 * @param {Object} props - Propiedades del componente
 * @param {'text'|'password'|'email'|'number'|'tel'|'url'|'search'|'date'|'time'|'datetime-local'} [props.type='text'] - Tipo de input
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del input
 * @param {'default'|'error'|'success'|'warning'} [props.variant='default'] - Variante semántica
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='md'] - Radio de bordes
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {string} [props.value] - Valor controlado
 * @param {string} [props.defaultValue] - Valor por defecto (no controlado)
 * @param {function} [props.onChange] - Handler de cambio
 * @param {function} [props.onFocus] - Handler de focus
 * @param {function} [props.onBlur] - Handler de blur
 * @param {string} [props.placeholder] - Texto placeholder
 * @param {boolean} [props.disabled=false] - Si está deshabilitado
 * @param {boolean} [props.readOnly=false] - Si es solo lectura
 * @param {boolean} [props.required=false] - Si es requerido
 * @param {boolean} [props.autoFocus=false] - Si obtiene foco automáticamente
 * @param {boolean} [props.compact=false] - Padding horizontal reducido
 * @param {string} [props.ariaLabel] - Label para accesibilidad
 * @param {string} [props.ariaDescribedBy] - ID del elemento que describe el input
 * @param {string} [props.ariaErrorMessage] - ID del mensaje de error
 * @param {string} [props.autoComplete] - Valor autocomplete
 * @param {number|string} [props.maxLength] - Longitud máxima
 * @param {number|string} [props.minLength] - Longitud mínima
 * @param {string} [props.pattern] - Patrón regex para validación
 * @param {React.Ref} ref - Referencia al elemento input
 */
const Input = forwardRef(({
  type = 'text',
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
  readOnly = false,
  required = false,
  autoFocus = false,
  compact = false,
  ariaLabel,
  ariaDescribedBy,
  ariaErrorMessage,
  autoComplete,
  maxLength,
  minLength,
  pattern,
  ...restProps
}, ref) => {
  
  // Construir las clases CSS dinámicamente
  const inputClasses = [
    'input-base',
    `input-base--${size}`,
    variant !== 'default' && `input-base--${variant}`,
    rounded !== 'md' && `input-base--rounded-${rounded}`,
    compact && 'input-base--compact',
    className
  ].filter(Boolean).join(' ');

  // Props adicionales para accesibilidad
  const accessibilityProps = {
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': variant === 'error' ? ariaErrorMessage : undefined,
    'aria-invalid': variant === 'error' ? 'true' : undefined,
    'aria-required': required ? 'true' : undefined
  };

  // Props de validación HTML
  const validationProps = {
    required,
    maxLength,
    minLength,
    pattern,
    autoComplete
  };

  return (
    <input
      ref={ref}
      type={type}
      className={inputClasses}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      autoFocus={autoFocus}
      {...accessibilityProps}
      {...validationProps}
      {...restProps}
    />
  );
});

Input.displayName = 'Input';

export { Input };