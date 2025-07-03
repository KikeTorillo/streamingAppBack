// Modal.jsx

import React from "react";
import { useContext } from "react"; // Para acceder al contexto
import { createPortal } from "react-dom"; // Para renderizar fuera del árbol DOM principal
import { TodoContext } from "../app/context/TodoContext"; // Contexto de la aplicación
import './Modal.css'; // Estilos específicos del modal

/**
 * Componente modal que utiliza React Portal para renderizado externo
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido del modal
 */
function Modal({ children }) {
    // Obtener estado y función para controlar la visibilidad del modal
    const { openModal, setOpenModal } = useContext(TodoContext);

    // Renderizado mediante React Portal
    return createPortal(
        // Contenedor principal del modal
        <div 
            className="modal" // Clase para estilos del fondo oscuro
            onClick={(event) => {
                // Cerrar modal al hacer clic fuera del contenido
                if (event.target.className === 'modal') {
                    setOpenModal(!openModal);
                }
            }}
        >
            {/* Contenido del modal (prop children) */}
            {children}
        </div>,
        // Elemento DOM donde se inyectará el modal (debe existir en index.html)
        document.getElementById('modal')
    );
}

export { Modal };