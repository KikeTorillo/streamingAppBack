// molecules/DynamicForm/DynamicForm.jsx
import React, { useState, useEffect } from 'react';
import { TextInput } from '../TextInput/TextInput';
import { TextSelect } from '../TextSelect/TextSelect'; // ← NUEVA IMPORTACIÓN
import { Button } from '../../atoms/Button/Button';
import { FileInputField } from '../FileInputField/FileInputField';
import { Checkbox } from '../../atoms/Checkbox/Checkbox'; // ← AGREGAR ESTA LÍNEA
import './DynamicForm.css';

/**
 * Componente DynamicForm mejorado - Usa TextSelect del sistema de diseño
 * Integración completa con TextInput y TextSelect para máxima consistencia
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.fields - Array de configuración de campos
 * @param {function} props.onSubmit - Función llamada al enviar el formulario
 * @param {function} [props.onChange] - Función llamada cuando cambian los datos
 * @param {Object} [props.initialData={}] - Datos iniciales del formulario
 * @param {number} [props.columnsPerRow=1] - Número de columnas en desktop
 * @param {number} [props.tabletColumns=2] - Columnas en tablet
 * @param {number} [props.mobileColumns=1] - Columnas en móvil
 * @param {boolean} [props.responsive=true] - Si adapta columnas según pantalla
 * @param {boolean} [props.validateOnChange=false] - Validar al cambiar
 * @param {boolean} [props.validateOnBlur=true] - Validar al perder foco
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {boolean} [props.disabled=false] - Si todo el formulario está deshabilitado
 * @param {boolean} [props.compact=false] - Versión compacta
 * @param {string} [props.className=''] - Clases CSS adicionales
 * 
 * // Props heredadas para componentes del sistema
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.fieldSize='md'] - Tamaño para TextInput y TextSelect
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.fieldRounded='md'] - Border radius para campos
 * @param {'primary'|'secondary'|'success'|'danger'|'outline'|'ghost'|'warning'} [props.submitVariant='primary'] - Variante del botón
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.submitSize='md'] - Tamaño del botón
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.submitRounded='md'] - Border radius del botón
 * @param {string} [props.submitText='Enviar'] - Texto del botón
 * @param {string|React.ReactNode} [props.submitIcon] - Icono del botón
 * @param {boolean} [props.submitFullWidth=false] - Botón ancho completo
 */
const DynamicForm = ({
  fields = [],
  onSubmit,
  onChange = () => { },
  initialData = {},
  columnsPerRow = 1,
  tabletColumns = 2,
  mobileColumns = 1,
  responsive = true,
  validateOnChange = false,
  validateOnBlur = true,
  loading = false,
  disabled = false,
  compact = false,
  className = '',

  // Props para componentes del sistema
  fieldSize = 'md',
  fieldRounded = 'md',
  submitVariant = 'primary',
  submitSize = 'md',
  submitRounded = 'md',
  submitText = 'Enviar',
  submitIcon,
  submitFullWidth = false
}) => {
  // Estado del formulario con datos iniciales
  const [formData, setFormData] = useState(() => {
    const initialFormData = { ...initialData };

    fields.forEach(field => {
      const fieldName = typeof field === 'string' ? field : field.name;
      const fieldType = typeof field === 'string' ? 'text' : (field.type || 'text');
      const defaultValue = typeof field === 'string' ? '' : (field.defaultValue || '');

      // Solo usar defaultValue si no hay dato inicial
      if (!(fieldName in initialFormData)) {
        switch (fieldType) {
          case 'checkbox':
            initialFormData[fieldName] = defaultValue || false;
            break;
          default:
            initialFormData[fieldName] = defaultValue;
        }
      }
    });

    return initialFormData;
  });

  // Estados para validación
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Detectar tamaño de pantalla usando breakpoints del sistema
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) { // Mobile breakpoint del sistema
        setScreenSize('mobile');
      } else if (width < 1024) { // Tablet breakpoint del sistema
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mantener la última referencia de onChange para evitar loops
  const onChangeRef = React.useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Efecto para notificar cambios en los datos sin provocar ciclos infinitos
  useEffect(() => {
    onChangeRef.current(formData);
  }, [formData]);

  // Función para obtener el número de columnas según el tamaño de pantalla
  const getResponsiveColumns = () => {
    if (!responsive) return columnsPerRow;

    switch (screenSize) {
      case 'mobile':
        return mobileColumns;
      case 'tablet':
        return tabletColumns;
      default:
        return columnsPerRow;
    }
  };

  // Función para validar un campo
  const validateField = (field, value) => {
    const fieldName = typeof field === 'string' ? field : field.name;
    const fieldRequired = typeof field === 'string' ? false : (field.required || false);
    const fieldValidation = typeof field === 'string' ? null : field.validation;
    const fieldType = typeof field === 'string' ? 'text' : (field.type || 'text');

    if (fieldRequired && (!value || value.toString().trim() === '')) {
      return 'Este campo es requerido';
    }

    // Validaciones por tipo usando las mismas que TextInput
    if (value && value.toString().trim() !== '') {
      switch (fieldType) {
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Por favor ingresa un email válido';
          }
          break;
        case 'tel':
          if (!/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
            return 'Por favor ingresa un teléfono válido';
          }
          break;
        case 'url':
          try {
            new URL(value);
          } catch {
            return 'Por favor ingresa una URL válida';
          }
          break;
        case 'number':
          if (isNaN(Number(value))) {
            return 'Por favor ingresa un número válido';
          }
          break;
      }
    }

    // Validación personalizada
    if (fieldValidation && typeof fieldValidation === 'function') {
      const customError = fieldValidation(value);
      if (customError !== true) {
        return customError;
      }
    }

    return null;
  };

  // Manejar cambios en los campos
  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Validar si está habilitado
    if (validateOnChange) {
      const field = fields.find(f => (typeof f === 'string' ? f : f.name) === fieldName);
      const error = validateField(field, value);

      setErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
    }
  };

  // Manejar pérdida de foco
  const handleFieldBlur = (fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));

    if (validateOnBlur) {
      const field = fields.find(f => (typeof f === 'string' ? f : f.name) === fieldName);
      const error = validateField(field, formData[fieldName]);

      setErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    const allTouched = {};

    // Validar todos los campos
    fields.forEach(field => {
      const fieldName = typeof field === 'string' ? field : field.name;
      const value = formData[fieldName];
      const error = validateField(field, value);

      allTouched[fieldName] = true;
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    setTouched(allTouched);

    // Si no hay errores, enviar
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  // Función para obtener clases de grid column
  const getFieldGridClasses = (field) => {
    const fieldWidth = typeof field === 'string' ? 'auto' : (field.width || 'auto');
    const fieldType = typeof field === 'string' ? 'text' : (field.type || 'text');

    const classes = ['dynamic-form__field'];

    // Agregar clase de tipo
    classes.push(`dynamic-form__field--${fieldType}`);

    // Agregar clase de ancho
    if (fieldWidth !== 'auto') {
      classes.push(`dynamic-form__field--${fieldWidth}`);
    }

    return classes;
  };

  // Función para normalizar opciones (compatible con TextSelect)
  const normalizeOptions = (options) => {
    if (!options || !Array.isArray(options)) return [];

    return options.map(option => {
      if (typeof option === 'string') {
        return { value: option, label: option };
      }

      // Si tiene 'id' y 'name' (formato actual), convertir a 'value' y 'label'
      if (option.id && option.name) {
        return {
          value: option.id,
          label: option.name,
          disabled: option.disabled
        };
      }

      // Si ya tiene 'value' y 'label', mantener como está
      if (option.value && option.label) {
        return option;
      }

      // Fallback
      return {
        value: option.value || option.id || option,
        label: option.label || option.name || option.toString(),
        disabled: option.disabled
      };
    });
  };

  // Función para renderizar cada campo
  const renderField = (field, index) => {
    const fieldName = typeof field === 'string' ? field : field.name;
    const fieldLabel = typeof field === 'string' ? field : (field.label || field.name);
    const fieldType = typeof field === 'string' ? 'text' : (field.type || 'text');
    const fieldPlaceholder = typeof field === 'string' ? '' : (field.placeholder || '');
    const fieldRequired = typeof field === 'string' ? false : (field.required || false);
    const fieldOptions = typeof field === 'string' ? [] : (field.options || []);
    const fieldDisabled = typeof field === 'string' ? false : (field.disabled || disabled);
    const fieldHelperText = typeof field === 'string' ? null : field.helperText;
    const fieldLeftIcon = typeof field === 'string' ? null : field.leftIcon;
    const fieldRightIcon = typeof field === 'string' ? null : field.rightIcon;
    const fieldMaxLength = typeof field === 'string' ? null : field.maxLength;
    const fieldShowCharCount = typeof field === 'string' ? false : field.showCharCount;

    const fieldError = errors[fieldName];
    const fieldTouched = touched[fieldName];
    const hasError = fieldError && fieldTouched;

    const fieldClasses = getFieldGridClasses(field);

    // Para campos que TextInput puede manejar directamente
    if (['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time', 'datetime-local'].includes(fieldType)) {
      return (
        <div key={index} className={fieldClasses.join(' ')}>
          <TextInput
            type={fieldType}
            name={fieldName}
            label={fieldLabel}
            placeholder={fieldPlaceholder}
            value={formData[fieldName] || ''}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            onBlur={() => handleFieldBlur(fieldName)}
            required={fieldRequired}
            disabled={fieldDisabled}
            errorText={hasError ? fieldError : ''}
            helperText={!hasError ? fieldHelperText : ''}
            leftIcon={fieldLeftIcon}
            rightIcon={fieldRightIcon}
            maxLength={fieldMaxLength}
            showCharCount={fieldShowCharCount}
            size={fieldSize}
            rounded={fieldRounded}
            compact={compact}
            fullWidth
            variant={hasError ? 'error' : 'default'}
            autoComplete={fieldType === 'email' ? 'email' : fieldType === 'tel' ? 'tel' : undefined}
          />
        </div>
      );
    }

    // Para campos de tipo file
    if (fieldType === 'file') {
      return (
        <div key={index} className={fieldClasses.join(' ')}>
          <FileInputField
            label={fieldLabel}
            name={fieldName}
            accept={field.accept}
            multiple={field.multiple || false}
            text={field.text || fieldPlaceholder || 'Seleccionar archivo'}
            helperText={!hasError ? fieldHelperText : ''}
            errorText={hasError ? fieldError : ''}
            required={fieldRequired}
            disabled={fieldDisabled}
            size={fieldSize}
            rounded={fieldRounded}
            variant={hasError ? 'danger' : (field.variant || 'default')}
            fullWidth={true}
            compact={compact}
            onChange={(e) => {
              // Manejar archivos de manera especial
              const files = Array.from(e.target.files || []);
              const value = field.multiple ? files : files[0] || null;
              handleFieldChange(fieldName, value);
            }}
            onBlur={() => handleFieldBlur(fieldName)}
          />
        </div>
      );
    }

    // ✨ NUEVO: Para campos select - USAR TEXTSELECT
    if (fieldType === 'select') {
      const normalizedOptions = normalizeOptions(fieldOptions);

      return (
        <div key={index} className={fieldClasses.join(' ')}>
          <TextSelect
            name={fieldName}
            label={fieldLabel}
            placeholder={fieldPlaceholder || 'Selecciona una opción'}
            options={normalizedOptions}
            value={formData[fieldName] || ''}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            onBlur={() => handleFieldBlur(fieldName)}
            required={fieldRequired}
            disabled={fieldDisabled}
            errorText={hasError ? fieldError : ''}
            helperText={!hasError ? fieldHelperText : ''}
            leftIcon={fieldLeftIcon}
            size={fieldSize}
            rounded={fieldRounded}
            compact={compact}
            fullWidth
            variant={hasError ? 'error' : 'default'}
          />
        </div>
      );
    }

    if (fieldType === 'checkbox') {
      return (
        <div key={index} className={fieldClasses.join(' ')}>
          <Checkbox
            id={fieldName}
            name={fieldName}
            value={fieldName}
            checked={Boolean(formData[fieldName])}
            onChange={(e) => handleFieldChange(fieldName, e.target.checked)}
            onBlur={() => handleFieldBlur(fieldName)}
            disabled={fieldDisabled}
            required={fieldRequired}
            label={fieldLabel}
            helperText={!hasError ? fieldHelperText : ''}
            error={hasError ? fieldError : ''}
            size={field.size || fieldSize} // Permitir override por campo
            className={field.className || ''}
          />
        </div>
      );
    }

    // Para campos radio
    if (fieldType === 'radio') {
      return (
        <div key={index} className={fieldClasses.join(' ')}>
          <label className="dynamic-form__label">
            {fieldLabel}
            {fieldRequired && <span style={{ color: 'var(--color-danger)' }}> *</span>}
          </label>
          <div className="dynamic-form__radio-container">
            {fieldOptions.map((option, optIndex) => (
              <div key={optIndex} className="dynamic-form__radio-item">
                <input
                  id={`${fieldName}_${optIndex}`}
                  type="radio"
                  name={fieldName}
                  className="dynamic-form__radio"
                  value={typeof option === 'string' ? option : option.value}
                  checked={formData[fieldName] === (typeof option === 'string' ? option : option.value)}
                  onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                  onBlur={() => handleFieldBlur(fieldName)}
                  required={fieldRequired}
                  disabled={fieldDisabled}
                />
                <label
                  htmlFor={`${fieldName}_${optIndex}`}
                  className="dynamic-form__radio-label"
                >
                  {typeof option === 'string' ? option : option.label}
                </label>
              </div>
            ))}
          </div>
          {hasError && (
            <span className="dynamic-form__error-message" role="alert">
              {fieldError}
            </span>
          )}
          {!hasError && fieldHelperText && (
            <span className="dynamic-form__helper-text">
              {fieldHelperText}
            </span>
          )}
        </div>
      );
    }

    // Para campos textarea - mantener como está por ahora
    if (fieldType === 'textarea') {
      return (
        <div key={index} className={fieldClasses.join(' ')}>
          <label htmlFor={fieldName} className="dynamic-form__label">
            {fieldLabel}
            {fieldRequired && <span style={{ color: 'var(--color-danger)' }}> *</span>}
          </label>
          <textarea
            id={fieldName}
            className="dynamic-form__textarea"
            value={formData[fieldName] || ''}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            onBlur={() => handleFieldBlur(fieldName)}
            placeholder={fieldPlaceholder}
            required={fieldRequired}
            disabled={fieldDisabled}
            rows={4}
            maxLength={fieldMaxLength}
          />
          {fieldMaxLength && fieldShowCharCount && (
            <div className="dynamic-form__char-count">
              {(formData[fieldName] || '').length}/{fieldMaxLength}
            </div>
          )}
          {hasError && (
            <span className="dynamic-form__error-message" role="alert">
              {fieldError}
            </span>
          )}
          {!hasError && fieldHelperText && (
            <span className="dynamic-form__helper-text">
              {fieldHelperText}
            </span>
          )}
        </div>
      );
    }

    // Fallback para tipos no reconocidos
    return null;
  };

  const currentColumns = getResponsiveColumns();
  const formClasses = [
    'dynamic-form',
    loading && 'dynamic-form--loading',
    compact && 'dynamic-form--compact',
    className
  ].filter(Boolean).join(' ');

  const gridClasses = [
    'dynamic-form__grid',
    `dynamic-form__grid--${currentColumns}-cols`
  ].join(' ');

  return (
    <div className={formClasses}>
      {fields.length === 0 ? (
        <div className="dynamic-form__empty-message">
          No hay campos definidos para este formulario.
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div
            className={gridClasses}
            style={{
              gridTemplateColumns: `repeat(${currentColumns}, 1fr)`
            }}
          >
            {fields.map(renderField)}
          </div>

          <div className="dynamic-form__submit-container">
            <Button
              type="submit"
              variant={submitVariant}
              size={submitSize}
              rounded={submitRounded}
              icon={submitIcon}
              loading={loading}
              disabled={disabled}
              fullWidth={submitFullWidth}
            >
              {submitText}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export { DynamicForm };