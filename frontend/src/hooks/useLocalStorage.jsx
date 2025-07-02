// useLocalStorage.js

import { useState, useEffect } from 'react';

/**
 * Hook personalizado para manejar datos en localStorage con estado y efectos
 * @param {string} itemName - Nombre del ítem en localStorage
 * @param {*} intialValue - Valor inicial (se corrigió a 'initialValue' en la explicación)
 */
function useLocalStorage(itemName, intialValue) {
    // Estado para almacenar el valor del ítem
    const [item, setItems] = useState(intialValue);
    
    // Estado de carga (simula proceso asíncrono)
    const [loading, setLoading] = useState(true);
    
    // Estado de error para manejar fallos
    const [error, setError] = useState(false);

    useEffect(() => {
        // Simulación de proceso asíncrono con setTimeout
        setTimeout(() => {
            try {
                // Intenta obtener el ítem del localStorage
                const localStorageItems = localStorage.getItem(itemName);
                
                // Si no existe, crea el ítem con el valor inicial
                if (!localStorageItems) {
                    localStorage.setItem(itemName, JSON.stringify(intialValue));
                    setItems(intialValue);
                } else {
                    // Si existe, parsea y actualiza el estado
                    const parsedItem = JSON.parse(localStorageItems);
                    setItems(parsedItem);
                }
                
                // Finaliza estado de carga
                setLoading(false);
            } catch (error) {
                // Captura errores y actualiza estado de error
                setLoading(false);
                setError(true);
            }
        }, 2000); // Retraso artificial de 2 segundos
    }, [itemName, intialValue]); // Dependencias del efecto

    /**
     * Función para actualizar el ítem en estado y localStorage
     * @param {*} newItems - Nuevo valor a guardar
     */
    const saveItem = (newItems) => {
        setItems(newItems); // Actualiza estado local
        localStorage.setItem(itemName, JSON.stringify(newItems)); // Persiste en localStorage
    };

    // Valores retornados por el hook
    return {
        item,       // Valor actual del ítem
        saveItem,   // Función para actualizar
        loading,    // Estado de carga
        error       // Estado de error
    };
}

export { useLocalStorage };