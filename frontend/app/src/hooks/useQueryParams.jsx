// useQueryParams.js

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Hook para acceder a la ubicación actual

/**
 * Hook personalizado para manejar y parsear los parámetros de la URL
 * @returns {Object} Objeto con los parámetros de consulta parseados
 */
function useQueryParams() {
    // Obtener el string de búsqueda de la URL (ej: "?page=2&sort=name")
    const { search } = useLocation();
    
    // Estado para almacenar los parámetros parseados
    const [queryParams, setQueryParams] = useState({});

    /**
     * Función para decodificar el string de búsqueda
     * @param {string} param - String de consulta (ej: "?page=2&sort=name")
     */
    function onDecodeSearch(param) {
        // Eliminar el primer carácter '?' del string
        const replaceCharacters = param.replace('?', '');
        
        // Dividir el string en pares clave-valor (ej: ["page=2", "sort=name"])
        const splitString = replaceCharacters.split('&');
        
        // Objeto para almacenar los parámetros parseados
        const formatedQuerys = {};
        
        // Iterar sobre cada par clave-valor
        splitString.forEach(query => {
            // Dividir cada par en clave y valor (ej: ["page", "2"])
            const [key, value] = query.split('=');
            
            // Agregar al objeto de parámetros
            Object.assign(formatedQuerys, {
                [key]: value // Ej: { page: '2', sort: 'name' }
            });
        });
        
        // Actualizar el estado con los parámetros parseados
        setQueryParams(formatedQuerys);
    }

    // Efecto que se ejecuta cuando cambia el search de la URL
    useEffect(() => {
        onDecodeSearch(search); // Decodificar y actualizar parámetros
    }, [search]); // Dependencia: se ejecuta cuando 'search' cambia

    return queryParams; // Retorna los parámetros parseados
}

export { useQueryParams };