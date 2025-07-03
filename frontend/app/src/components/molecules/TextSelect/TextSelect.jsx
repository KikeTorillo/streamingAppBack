// molecules/TextSelect/TextSelect.jsx
import React, { useState, forwardRef } from 'react';
import './TextSelect.css';
import { Select } from '../../atoms/Select/Select';

/**
 * Componente TextSelect mejorado - Molécula que extiende el átomo Select
 * Siguiendo principios de Atomic Design igual que TextInput
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} [props.options=[]] - Array de opciones {value, label, disabled?}
 * @param {string} [props.placeholder='Selecciona una opción'] - Texto placeholder
 * @param {string} [props.value] - Valor controlado del select
 * @param {string} [props.defaultValue] - Valor por defecto (no controlado)
 * @param {function} [props.onChange] - Handler para cambios de valor
 * @param {function} [props.onBlur] - Handler para pérdida de foco
 * @param {function} [props.onFocus] - Handler para obtención de foco
 * @param {string} [props.name] - Nombre del campo (necesario para formularios)
 * @param {string} [props.id] - ID único del select
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del select (heredado del átomo)
 * @param {'default'|'success'|'warning'|'error'} [props.variant='default'] - Variante visual
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='md'] - Radio de bordes (heredado del átomo)
 * @param {boolean} [props.disabled=false] - Si el select está deshabilitado
 * @param {boolean} [props.required=false] - Si el campo es obligatorio
 * @param {boolean} [props.autoFocus=false] - Si obtiene foco automáticamente
 * @param {boolean} [props.fullWidth=false] - Si ocupa todo el ancho disponible
 * @param {boolean} [props.compact=false] - Versión compacta con spacing reducido
 * @param {string} [props.label] - Etiqueta del campo
 * @param {string} [props.helperText] - Texto de ayuda debajo del select
 * @param {string} [props.errorText] - Mensaje de error (sobrescribe helperText y variant)
 * @param {string|React.ReactNode} [props.leftIcon] - Icono izquierdo
 * @param {function} [props.onLeftIconClick] - Handler para click en icono izquierdo
 * @param {boolean} [props.searchable=false] - Si permite búsqueda (funcionalidad futura)
 * @param {string} [props.ariaLabel] - Label para accesibilidad
 * @param {string} [props.ariaDescribedBy] - ID del elemento que describe el select
 * @param {string} [props.ariaErrorMessage] - ID del mensaje de error
 * @param {React.Ref} ref - Referencia al elemento select
 */
const TextSelect = forwardRef(({
    options = [],
    placeholder = 'Selecciona una opción',
    value,
    defaultValue,
    onChange,
    onBlur,
    onFocus,
    name,
    id,
    className = '',
    size = 'md',
    variant = 'default',
    rounded = 'md',
    disabled = false,
    required = false,
    autoFocus = false,
    fullWidth = false,
    compact = false,
    label,
    helperText,
    errorText,
    leftIcon,
    onLeftIconClick,
    searchable = false,
    ariaLabel,
    ariaDescribedBy,
    ariaErrorMessage,
    ...restProps
}, ref) => {
    // Estado interno para manejar focus (igual que TextInput)
    const [isFocused, setIsFocused] = useState(false);
    
    // Determinar variante basada en error (error tiene prioridad)
    const currentVariant = errorText ? 'error' : variant;
    
    // Construir clases CSS dinámicamente para el wrapper
    const wrapperClasses = [
        'text-select-wrapper',
        `text-select-wrapper--${size}`,
        `text-select-wrapper--${currentVariant}`,
        isFocused && 'text-select-wrapper--focused',
        fullWidth && 'text-select-wrapper--full-width',
        disabled && 'text-select-wrapper--disabled',
        compact && 'text-select-wrapper--compact',
        className
    ].filter(Boolean).join(' ');

    // Clases adicionales para el Select del átomo
    const selectAdditionalClasses = [
        `text-select--${currentVariant}`,
        leftIcon && 'text-select--with-left-icon'
    ].filter(Boolean).join(' ');

    // Handlers de eventos (igual que TextInput)
    const handleFocus = (e) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    // Generar IDs únicos para accesibilidad
    const selectId = id || `text-select-${Math.random().toString(36).substr(2, 9)}`;
    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;

    // Texto a mostrar en footer
    const footerText = errorText || helperText;
    const isError = !!errorText;

    // ARIA describedby dinámico
    const describedBy = [
        ariaDescribedBy,
        footerText && (isError ? errorId : helperId)
    ].filter(Boolean).join(' ');

    return (
        <div className={wrapperClasses}>
            {/* Label (igual que TextInput) */}
            {label && (
                <label 
                    htmlFor={selectId}
                    className={`text-select__label ${required ? 'text-select__label--required' : ''}`}
                >
                    {label}
                </label>
            )}

            {/* Container con iconos */}
            <div className="text-select__container">
                {/* Icono izquierdo (si existe) */}
                {leftIcon && (
                    <div 
                        className={`text-select__icon text-select__icon--left ${
                            onLeftIconClick ? 'text-select__icon--clickable' : ''
                        }`}
                        onClick={onLeftIconClick}
                        role={onLeftIconClick ? 'button' : undefined}
                        tabIndex={onLeftIconClick ? 0 : undefined}
                        aria-hidden={!onLeftIconClick}
                    >
                        {leftIcon}
                    </div>
                )}

                {/* Select base */}
                <Select
                    ref={ref}
                    id={selectId}
                    name={name}
                    options={options}
                    placeholder={placeholder}
                    value={value}
                    defaultValue={defaultValue}
                    onChange={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    size={size}
                    variant={currentVariant}
                    rounded={rounded}
                    disabled={disabled}
                    required={required}
                    autoFocus={autoFocus}
                    compact={compact}
                    className={selectAdditionalClasses}
                    ariaLabel={ariaLabel}
                    ariaDescribedBy={describedBy || undefined}
                    ariaErrorMessage={isError ? errorId : undefined}
                    {...restProps}
                />
            </div>

            {/* Footer con mensajes (igual que TextInput) */}
            {footerText && (
                <div className="text-select__footer">
                    <div 
                        id={isError ? errorId : helperId}
                        className={`text-select__message ${isError ? 'text-select__message--error' : 'text-select__message--helper'}`}
                        aria-live={isError ? 'polite' : undefined}
                        aria-atomic={isError ? 'true' : undefined}
                    >
                        {footerText}
                    </div>
                </div>
            )}
        </div>
    );
});

TextSelect.displayName = 'TextSelect';

export { TextSelect };