// ===== ACTIONS DROPDOWN COMPONENT - VERSIÓN CORREGIDA =====
// src/components/molecules/ActionsDropdown/ActionsDropdown.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../atoms/Button/Button';
import './ActionsDropdown.css';

/**
 * ActionsDropdown - Menú desplegable de acciones para filas de tablas
 * 
 * VERSIÓN CORREGIDA que respeta el sistema de diseño completo
 * 
 * @param {Object} props - Props del componente
 * @param {Array} props.actions - Array de acciones [{label, icon, onClick, variant}]
 * @param {Object} props.data - Datos de la fila (se pasan a onClick de cada acción)
 * @param {string} props.size - Tamaño del trigger button ['xs', 'sm', 'md', 'lg']
 * @param {string} props.variant - Variante del trigger ['ghost', 'outline']
 * @param {string} props.position - Posición del menu ['bottom-right', 'bottom-left', 'top-right', 'top-left']
 * @param {boolean} props.disabled - Si el dropdown está deshabilitado
 * @param {string} props.triggerIcon - Ícono del trigger button
 * @param {string} props.triggerLabel - Label del trigger button (para accesibilidad)
 * @param {function} props.onOpen - Callback cuando se abre el menu
 * @param {function} props.onClose - Callback cuando se cierra el menu
 */
function ActionsDropdown({ 
  actions = [],
  data = {},
  size = 'sm',
  variant = 'ghost',
  position = 'bottom-right',
  disabled = false,
  triggerIcon = '⋮',
  triggerLabel = 'Opciones',
  onOpen,
  onClose
}) {
  // ===== ESTADOS =====
  const [isOpen, setIsOpen] = useState(false);
  
  // ===== REFS =====
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  // ===== FUNCIONES DE MANEJO =====
  
  /**
   * Abrir el menú
   */
  const handleOpen = () => {
    if (disabled || isOpen) return;
    
    setIsOpen(true);
    onOpen?.(data);
    
    // CORRECCIÓN: Verificar si necesita position fixed
    setTimeout(() => {
      const menu = menuRef.current;
      const trigger = triggerRef.current;
      
      if (menu && trigger) {
        // Detectar si está dentro de una tabla o contenedor problemático
        const isInTable = trigger.closest('table, .data-table, .users-list__table');
        const hasOverflowParent = trigger.closest('.overflow-hidden, .overflow-auto');
        
        if (isInTable || hasOverflowParent) {
          // Usar position fixed y calcular posición
          const triggerRect = trigger.getBoundingClientRect();
          const menuHeight = menu.offsetHeight;
          const menuWidth = menu.offsetWidth;
          
          // Determinar si hay espacio abajo o arriba
          const spaceBelow = window.innerHeight - triggerRect.bottom;
          const spaceAbove = triggerRect.top;
          
          menu.style.position = 'fixed';
          menu.style.zIndex = getComputedStyle(document.documentElement).getPropertyValue('--z-dropdown').trim() ? 
            `calc(${getComputedStyle(document.documentElement).getPropertyValue('--z-dropdown').trim()} + 2)` : 
            '1002';
          
          // Posicionar según el espacio disponible
          if (spaceBelow >= menuHeight || spaceBelow >= spaceAbove) {
            // Mostrar abajo
            menu.style.top = `${triggerRect.bottom + 4}px`;
            menu.style.bottom = 'auto';
          } else {
            // Mostrar arriba
            menu.style.bottom = `${window.innerHeight - triggerRect.top + 4}px`;
            menu.style.top = 'auto';
          }
          
          // Posición horizontal
          if (position.includes('right')) {
            menu.style.right = `${window.innerWidth - triggerRect.right}px`;
            menu.style.left = 'auto';
          } else {
            menu.style.left = `${triggerRect.left}px`;
            menu.style.right = 'auto';
          }
        }
      }
      
      // Focus al primer item
      const firstItem = menu?.querySelector('.actions-dropdown__item:not(:disabled)');
      firstItem?.focus();
    }, 10);
  };

  /**
   * Cerrar el menú
   */
  const handleClose = () => {
    if (!isOpen) return;
    
    setIsOpen(false);
    onClose?.(data);
    
    // Retornar focus al trigger
    setTimeout(() => {
      triggerRef.current?.focus();
    }, 50);
  };

  /**
   * Toggle del menú
   */
  const handleToggle = () => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  /**
   * Ejecutar acción y cerrar menú
   */
  const handleActionClick = (action) => {
    try {
      action.onClick?.(data);
    } catch (error) {
      console.error('Error ejecutando acción:', error);
    }
    
    handleClose();
  };

  // ===== EFECTOS =====
  
  /**
   * Manejo de clicks fuera del componente
   */
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  /**
   * Manejo de teclas (ESC para cerrar, flechas para navegar)
   */
  useEffect(() => {
    function handleKeyDown(event) {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          handleClose();
          break;
        
        case 'ArrowDown':
          event.preventDefault();
          const nextItem = document.activeElement.nextElementSibling;
          if (nextItem && nextItem.classList.contains('actions-dropdown__item')) {
            nextItem.focus();
          }
          break;
        
        case 'ArrowUp':
          event.preventDefault();
          const prevItem = document.activeElement.previousElementSibling;
          if (prevItem && prevItem.classList.contains('actions-dropdown__item')) {
            prevItem.focus();
          }
          break;
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // ===== RENDER =====
  
  // Si no hay acciones, no renderizar nada
  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <div 
      className={`actions-dropdown ${isOpen ? 'actions-dropdown--open' : ''}`}
      ref={dropdownRef}
    >
      {/* ===== TRIGGER BUTTON ===== */}
      <Button
        ref={triggerRef}
        variant={variant}
        size={size}
        disabled={disabled}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={triggerLabel}
        className="actions-dropdown__trigger"
      >
        {triggerIcon}
      </Button>

      {/* ===== BACKDROP (Solo cuando está abierto) ===== */}
      {isOpen && (
        <div 
          className="actions-dropdown__backdrop"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* ===== MENU DESPLEGABLE ===== */}
      {isOpen && (
        <div
          ref={menuRef}
          className={`actions-dropdown__menu actions-dropdown__menu--${position}`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="actions-dropdown-trigger"
        >
          {actions.map((action, index) => {
            // Determinar variante del item
            const itemVariant = action.variant === 'danger' ? 'danger' : '';
            const isDisabled = action.disabled === true;
            
            return (
              <button
                key={action.key || `action-${index}`}
                className={`
                  actions-dropdown__item 
                  ${itemVariant ? `actions-dropdown__item--${itemVariant}` : ''}
                  ${isDisabled ? 'actions-dropdown__item--disabled' : ''}
                `.trim()}
                disabled={isDisabled}
                onClick={() => handleActionClick(action)}
                role="menuitem"
                tabIndex={isDisabled ? -1 : 0}
                title={action.description || action.label}
              >
                {/* Ícono */}
                {action.icon && (
                  <span className="actions-dropdown__icon">
                    {action.icon}
                  </span>
                )}
                
                {/* Label */}
                <span className="actions-dropdown__label">
                  {action.label}
                </span>
                
                {/* Shortcut (opcional) */}
                {action.shortcut && (
                  <span className="actions-dropdown__shortcut">
                    {action.shortcut}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ===== EXPORT =====
export { ActionsDropdown };