// src/components/molecules/FileInputField/FileInputField.jsx
import React, { useState } from 'react';
import './FileInputField.css';
import { FileInput } from '../../atoms/FileInput/FileInput';

/**
 * FileInputField - MOLÉCULA QUE EXTIENDE EL ÁTOMO FILEINPUT
 * Siguiendo exactamente el mismo patrón que TextInput
 * 
 * ✅ ATOMIC DESIGN: Molécula que usa el átomo FileInput
 * ✅ CONSISTENCIA: Misma estructura que TextInput (label + campo + footer)
 * ✅ SISTEMA DE DISEÑO: Variables CSS del sistema
 * ✅ ACCESIBILIDAD: ARIA completo, labels asociados
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.label] - Etiqueta del campo
 * @param {string} [props.helperText] - Texto de ayuda debajo del input
 * @param {string} [props.errorText] - Mensaje de error (sobrescribe helperText y variant)
 * @param {boolean} [props.required=false] - Si el campo es obligatorio
 * @param {boolean} [props.fullWidth=false] - Si ocupa todo el ancho disponible
 * @param {boolean} [props.compact=false] - Versión compacta con spacing reducido
 * @param {string} [props.className=''] - Clases CSS adicionales
 * 
 * // Props heredadas del átomo FileInput
 * @param {string} [props.id] - ID único para el input
 * @param {string} [props.name] - Nombre del campo para formularios
 * @param {string} [props.accept] - Tipos MIME permitidos
 * @param {boolean} [props.multiple=false] - Permite múltiples archivos
 * @param {boolean} [props.disabled=false] - Si está deshabilitado
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del componente
 * @param {'default'|'success'|'warning'|'danger'} [props.variant='default'] - Variante visual
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='md'] - Radio de bordes
 * @param {string} [props.text='Seleccionar archivo'] - Texto del botón
 * @param {function} [props.onChange] - Handler cuando se selecciona archivo
 * @param {function} [props.onFocus] - Handler cuando obtiene foco
 * @param {function} [props.onBlur] - Handler cuando pierde foco
 */
function FileInputField({
  // Props específicas de la molécula
  label,
  helperText,
  errorText,
  required = false,
  fullWidth = false,
  compact = false,
  className = '',
  
  // Props heredadas del átomo FileInput
  id,
  name,
  accept,
  multiple = false,
  disabled = false,
  size = 'md',
  variant = 'default',
  rounded = 'md',
  text = 'Seleccionar archivo',
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
  ariaLabel,
  ariaDescribedBy,
  ...rest
}) {
  // Estados internos para manejo de focus (igual que TextInput)
  const [focused, setFocused] = useState(false);

  // Determinar el estado actual
  const hasError = Boolean(errorText);
  const currentVariant = hasError ? 'danger' : variant;

  // Generar IDs únicos si no se proporcionan
  const inputId = id || `file-input-field-${Math.random().toString(36).substr(2, 9)}`;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = errorText ? `${inputId}-error` : undefined;
  const describedBy = [helperId, errorId, ariaDescribedBy].filter(Boolean).join(' ') || undefined;

  /**
   * Manejador del evento onFocus
   */
  const handleFocus = (event) => {
    setFocused(true);
    onFocus(event);
  };

  /**
   * Manejador del evento onBlur
   */
  const handleBlur = (event) => {
    setFocused(false);
    onBlur(event);
  };

  // Construir clases CSS (siguiendo patrón TextInput)
  const wrapperClasses = [
    'file-input-field-wrapper',
    `file-input-field-wrapper--${size}`,
    `file-input-field-wrapper--${currentVariant}`,
    focused && 'file-input-field-wrapper--focused',
    disabled && 'file-input-field-wrapper--disabled',
    hasError && 'file-input-field-wrapper--error',
    fullWidth && 'file-input-field-wrapper--full-width',
    compact && 'file-input-field-wrapper--compact',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      {/* Label (igual estructura que TextInput) */}
      {label && (
        <label 
          htmlFor={inputId} 
          className={`file-input-field__label ${required ? 'file-input-field__label--required' : ''}`}
        >
          {label}
        </label>
      )}

      {/* FileInput átomo */}
      <FileInput
        id={inputId}
        name={name}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        required={required}
        size={size}
        variant={currentVariant}
        rounded={rounded}
        text={text}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        ariaLabel={ariaLabel || label}
        ariaDescribedBy={describedBy}
        {...rest}
      />

      {/* Footer con mensajes (igual que TextInput) */}
      <div className="file-input-field__footer">
        {/* Texto de ayuda */}
        {helperText && !hasError && (
          <div id={helperId} className="file-input-field__helper-text">
            {helperText}
          </div>
        )}

        {/* Mensaje de error */}
        {errorText && (
          <div id={errorId} className="file-input-field__error-text" role="alert">
            {errorText}
          </div>
        )}
      </div>
    </div>
  );
}

export { FileInputField };