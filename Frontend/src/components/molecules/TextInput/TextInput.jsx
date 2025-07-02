// molecules/TextInput.jsx
import React, { useState, forwardRef } from 'react';
import './TextInput.css';
import { Input } from '../../atoms/Input/Input';

/**
 * Componente TextInput mejorado - Molécula que extiende el átomo Input
 * Siguiendo principios de Atomic Design y usando el sistema de diseño actualizado
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.placeholder=''] - Texto de ayuda del input
 * @param {string} [props.value] - Valor controlado del input
 * @param {string} [props.defaultValue] - Valor por defecto (no controlado)
 * @param {function} [props.onChange] - Handler para cambios de valor
 * @param {function} [props.onBlur] - Handler para pérdida de foco
 * @param {function} [props.onFocus] - Handler para obtención de foco
 * @param {'text'|'password'|'email'|'number'|'tel'|'url'|'search'|'date'|'time'|'datetime-local'} [props.type='text'] - Tipo de input HTML
 * @param {string} [props.name] - Nombre del campo (necesario para formularios)
 * @param {string} [props.id] - ID único del input
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del input (heredado del átomo)
 * @param {'default'|'success'|'warning'|'error'} [props.variant='default'] - Variante visual
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='md'] - Radio de bordes (heredado del átomo)
 * @param {boolean} [props.disabled=false] - Si el input está deshabilitado
 * @param {boolean} [props.readOnly=false] - Si el input es de solo lectura
 * @param {boolean} [props.required=false] - Si el campo es obligatorio
 * @param {boolean} [props.autoFocus=false] - Si obtiene foco automáticamente
 * @param {boolean} [props.fullWidth=false] - Si ocupa todo el ancho disponible
 * @param {boolean} [props.compact=false] - Versión compacta con spacing reducido
 * @param {string} [props.label] - Etiqueta del campo
 * @param {string} [props.helperText] - Texto de ayuda debajo del input
 * @param {string} [props.errorText] - Mensaje de error (sobrescribe helperText y variant)
 * @param {string|React.ReactNode} [props.leftIcon] - Icono izquierdo
 * @param {string|React.ReactNode} [props.rightIcon] - Icono derecho
 * @param {function} [props.onRightIconClick] - Handler para click en icono derecho
 * @param {function} [props.onLeftIconClick] - Handler para click en icono izquierdo
 * @param {number} [props.maxLength] - Longitud máxima del texto
 * @param {number} [props.minLength] - Longitud mínima del texto
 * @param {boolean} [props.showCharCount=false] - Mostrar contador de caracteres
 * @param {string} [props.pattern] - Patrón regex para validación
 * @param {string} [props.autoComplete] - Atributo autocomplete HTML
 * @param {string} [props.ariaLabel] - Label para accesibilidad
 * @param {string} [props.ariaDescribedBy] - ID del elemento que describe el input
 * @param {string} [props.ariaErrorMessage] - ID del mensaje de error
 * @param {React.Ref} ref - Referencia al elemento input
 */
const TextInput = forwardRef(({
    placeholder = '',
    value,
    defaultValue,
    onChange,
    onBlur,
    onFocus,
    type = 'text',
    name,
    id,
    className = '',
    size = 'md',
    variant = 'default',
    rounded = 'md',
    disabled = false,
    readOnly = false,
    required = false,
    autoFocus = false,
    fullWidth = false,
    compact = false,
    label,
    helperText,
    errorText,
    leftIcon,
    rightIcon,
    onRightIconClick,
    onLeftIconClick,
    maxLength,
    minLength,
    showCharCount = false,
    pattern,
    autoComplete,
    ariaLabel,
    ariaDescribedBy,
    ariaErrorMessage,
    ...restProps
}, ref) => {
    // Estado interno para manejar focus
    const [isFocused, setIsFocused] = useState(false);
    
    // Determinar variante basada en error (error tiene prioridad)
    const currentVariant = errorText ? 'error' : variant;
    
    // Construir clases CSS dinámicamente para el wrapper
    const wrapperClasses = [
        'text-input-wrapper',
        `text-input-wrapper--${size}`,
        `text-input-wrapper--${currentVariant}`,
        isFocused && 'text-input-wrapper--focused',
        fullWidth && 'text-input-wrapper--full-width',
        disabled && 'text-input-wrapper--disabled',
        compact && 'text-input-wrapper--compact',
        className
    ].filter(Boolean).join(' ');

    // Clases adicionales para el Input del átomo
    const inputAdditionalClasses = [
        `text-input--${currentVariant}`,
        leftIcon && 'text-input--with-left-icon',
        rightIcon && 'text-input--with-right-icon'
    ].filter(Boolean).join(' ');

    // Handlers de eventos
    const handleFocus = (e) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    // Función para renderizar iconos (mejorada)
    const renderIcon = (icon) => {
        if (React.isValidElement(icon)) {
            return icon;
        }
        
        if (typeof icon === 'string') {
            // Detectar clases de iconos
            if (icon.includes('fa-') || icon.includes('icon-') || icon.includes('bi-') || icon.includes('material-icons')) {
                return <i className={icon} aria-hidden="true" />;
            }
            // Para emojis y texto
            return <span aria-hidden="true">{icon}</span>;
        }
        
        return icon;
    };

    // IDs únicos para accesibilidad
    const inputId = id || name || `text-input-${Math.random().toString(36).substr(2, 9)}`;
    const helperTextId = helperText ? `${inputId}-helper` : undefined;
    const errorTextId = errorText ? `${inputId}-error` : undefined;
    
    // Construir aria-describedby
    const describedByIds = [
        ariaDescribedBy,
        helperTextId,
        errorTextId
    ].filter(Boolean);

    // Calcular datos del contador de caracteres
    const currentLength = value?.length || 0;
    const isNearLimit = maxLength && currentLength > maxLength * 0.8;
    const isAtLimit = maxLength && currentLength >= maxLength;

    // Props para el Input del átomo (heredando todas las nuevas características)
    const inputProps = {
        ref,
        id: inputId,
        type,
        name,
        value,
        defaultValue,
        onChange,
        onFocus: handleFocus,
        onBlur: handleBlur,
        placeholder,
        disabled,
        readOnly,
        required,
        autoFocus,
        maxLength,
        minLength,
        pattern,
        autoComplete,
        size,
        variant: currentVariant, // Usar la variante del átomo también
        rounded,
        compact: compact,
        className: inputAdditionalClasses,
        ariaLabel,
        ariaDescribedBy: describedByIds.length > 0 ? describedByIds.join(' ') : undefined,
        ariaErrorMessage: errorText ? errorTextId : ariaErrorMessage,
        ...restProps
    };

    return (
        <div className={wrapperClasses}>
            {/* Label */}
            {label && (
                <label 
                    htmlFor={inputId} 
                    className={`text-input__label ${required ? 'text-input__label--required' : ''}`}
                >
                    {label}
                </label>
            )}

            {/* Input container */}
            <div className="text-input__container">
                {/* Left icon */}
                {leftIcon && (
                    <span 
                        className={`text-input__icon text-input__icon--left ${onLeftIconClick ? 'text-input__icon--clickable' : ''}`}
                        onClick={onLeftIconClick}
                        role={onLeftIconClick ? 'button' : undefined}
                        tabIndex={onLeftIconClick ? 0 : undefined}
                        aria-label={onLeftIconClick ? 'Acción del icono izquierdo' : undefined}
                        onKeyDown={onLeftIconClick ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onLeftIconClick(e);
                            }
                        } : undefined}
                    >
                        {renderIcon(leftIcon)}
                    </span>
                )}

                {/* Input field - Usando el átomo Input mejorado */}
                <Input {...inputProps} />

                {/* Right icon */}
                {rightIcon && (
                    <span 
                        className={`text-input__icon text-input__icon--right ${onRightIconClick ? 'text-input__icon--clickable' : ''}`}
                        onClick={onRightIconClick}
                        role={onRightIconClick ? 'button' : undefined}
                        tabIndex={onRightIconClick ? 0 : undefined}
                        aria-label={onRightIconClick ? 'Acción del icono derecho' : undefined}
                        onKeyDown={onRightIconClick ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onRightIconClick(e);
                            }
                        } : undefined}
                    >
                        {renderIcon(rightIcon)}
                    </span>
                )}
            </div>

            {/* Footer con mensajes y contador */}
            {(helperText || errorText || (showCharCount && maxLength)) && (
                <div className="text-input__footer">
                    <div className="text-input__messages">
                        {/* Error text (prioridad sobre helper text) */}
                        {errorText && (
                            <span 
                                id={errorTextId}
                                className="text-input__error-text"
                                role="alert"
                                aria-live="polite"
                            >
                                {errorText}
                            </span>
                        )}

                        {/* Helper text (solo si no hay error) */}
                        {helperText && !errorText && (
                            <span 
                                id={helperTextId}
                                className="text-input__helper-text"
                            >
                                {helperText}
                            </span>
                        )}
                    </div>

                    {/* Character count */}
                    {showCharCount && maxLength && (
                        <span 
                            className="text-input__char-count"
                            data-warning={isNearLimit && !isAtLimit}
                            data-danger={isAtLimit}
                            aria-label={`${currentLength} de ${maxLength} caracteres`}
                        >
                            {currentLength}/{maxLength}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
});

// Display name para debugging
TextInput.displayName = 'TextInput';

export { TextInput };