// ===== USER CONTEXT ACTUALIZADO SIMPLE =====
// src/app/context/UserContext.jsx (REEMPLAZAR EL EXISTENTE)

import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// ✅ USAR SERVICIOS CORREGIDOS (manteniendo imports individuales como ya tienes)
import { getUsersService } from '../../services/Users/getUsersService';
import { createUserService } from '../../services/Users/createUserService';
import { updateUserService } from '../../services/Users/updateUserService';
import { deleteUserService } from '../../services/Users/deleteUserService';

// ===== CREAR CONTEXTOS =====
const UserContext = createContext();
const UserAuthContext = createContext();

// ===== HOOKS PERSONALIZADOS =====
export const useUsers = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUsers debe usarse dentro de UserProvider');
    }
    return context;
};

export const useAuth = () => {
    const context = useContext(UserAuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de UserProvider');
    }
    return context;
};

// ===== PROVIDER PRINCIPAL =====
function UserProvider({ children }) {
    const navigate = useNavigate();

    // ===== ESTADOS DE GESTIÓN DE USUARIOS =====
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalUsers, setTotalUsers] = useState(0);
    
    // Estados específicos para operaciones
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(null);

    // ===== ESTADOS DE AUTENTICACIÓN =====
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    // ===== EFECTOS =====
    useEffect(() => {
        initializeAuth();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            loadUsers();
        }
    }, [isAuthenticated]);

    // ===== FUNCIONES DE AUTENTICACIÓN =====
    const initializeAuth = () => {
        setAuthLoading(true);
        try {
            const sessionUser = sessionStorage.getItem('sessionUser');
            if (sessionUser) {
                const userData = JSON.parse(sessionUser);
                setCurrentUser(userData);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Error al inicializar autenticación:', error);
            logout();
        } finally {
            setAuthLoading(false);
        }
    };

    const updateCurrentUser = (userData) => {
        setCurrentUser(userData);
        sessionStorage.setItem('sessionUser', JSON.stringify(userData));
        setIsAuthenticated(true);
    };

    const logout = () => {
        setCurrentUser(null);
        setIsAuthenticated(false);
        sessionStorage.removeItem('sessionUser');
        setUsers([]);
        navigate('/login');
    };

    // ===== FUNCIONES DE GESTIÓN DE USUARIOS =====
    
    /**
     * Cargar lista de usuarios
     * ✅ USAR SERVICIO CORREGIDO
     */
    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await getUsersService();
            
            // ✅ USAR NUEVA ESTRUCTURA DE RESPUESTA
            if (response.message === 'session expired' && response.error) {
                logout();
                return;
            }
            
            if (response.success) {
                setUsers(response.data);
                setTotalUsers(response.count);
            } else {
                throw new Error(response.error || 'Error al cargar usuarios');
            }
        } catch (err) {
            console.error('Error loading users:', err);
            setError(err.message || 'Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Crear nuevo usuario
     * ✅ USAR SERVICIO CORREGIDO
     */
    const createUser = async (userData) => {
        try {
            setCreating(true);
            setError(null);
            
            const response = await createUserService(userData);
            
            if (response.success) {
                await loadUsers(); // Recargar lista
                return {
                    success: true,
                    message: 'Usuario creado exitosamente',
                    user: response.data
                };
            } else {
                return {
                    success: false,
                    error: response.error,
                    code: response.code
                };
            }
        } catch (err) {
            console.error('Error creating user:', err);
            return {
                success: false,
                error: err.message || 'Error al crear usuario'
            };
        } finally {
            setCreating(false);
        }
    };

    /**
     * Actualizar usuario existente
     * ✅ USAR SERVICIO CORREGIDO
     */
    const updateUser = async (id, userData) => {
        try {
            setUpdating(true);
            setError(null);
            
            const response = await updateUserService(id, userData);
            
            if (response.message === 'session expired' && response.error) {
                logout();
                return { success: false, error: 'Sesión expirada' };
            }
            
            if (response.success) {
                await loadUsers(); // Recargar lista
                
                // Si es el usuario actual, actualizar sesión
                if (currentUser && currentUser.sub === id) {
                    updateCurrentUser({
                        ...currentUser,
                        ...response.data
                    });
                }
                
                return {
                    success: true,
                    message: 'Usuario actualizado exitosamente',
                    user: response.data
                };
            } else {
                return {
                    success: false,
                    error: response.error
                };
            }
        } catch (err) {
            console.error('Error updating user:', err);
            return {
                success: false,
                error: err.message || 'Error al actualizar usuario'
            };
        } finally {
            setUpdating(false);
        }
    };

    /**
     * Eliminar usuario
     * ✅ USAR SERVICIO CORREGIDO
     */
    const deleteUser = async (id) => {
        try {
            setDeleting(id);
            setError(null);
            
            // Verificar que no sea el usuario actual
            if (currentUser && currentUser.sub === id) {
                return {
                    success: false,
                    error: 'No puedes eliminar tu propia cuenta'
                };
            }
            
            const response = await deleteUserService(id);
            
            if (response.message === 'session expired' && response.error) {
                logout();
                return { success: false, error: 'Sesión expirada' };
            }
            
            if (response.success) {
                await loadUsers(); // Recargar lista
                return {
                    success: true,
                    message: 'Usuario eliminado exitosamente'
                };
            } else {
                return {
                    success: false,
                    error: response.error
                };
            }
        } catch (err) {
            console.error('Error deleting user:', err);
            return {
                success: false,
                error: err.message || 'Error al eliminar usuario'
            };
        } finally {
            setDeleting(null);
        }
    };

    // ===== HANDLERS PARA UI =====
    const handleViewUser = (user) => {
        navigate(`/admin/users/${user.id}`);
    };

    const handleEditUser = (user) => {
        navigate(`/admin/users/${user.id}/edit`);
    };

    const handleDeleteUser = async (user) => {
        const confirmDelete = window.confirm(
            `¿Estás seguro de que quieres eliminar al usuario "${user.username}"?\n\nEsta acción no se puede deshacer.`
        );
        
        if (confirmDelete) {
            const result = await deleteUser(user.id);
            if (result.success) {
                alert(`✅ ${result.message}`);
            } else {
                alert(`❌ ${result.error}`);
            }
        }
    };

    const refreshUsers = () => {
        loadUsers();
    };

    // ===== VALORES DEL CONTEXTO =====
    const userContextValue = {
        // Datos
        users,
        totalUsers,
        
        // Estados
        loading,
        error,
        creating,
        updating,
        deleting,
        
        // Funciones CRUD
        loadUsers,
        createUser,
        updateUser,
        deleteUser,
        
        // Handlers para UI
        handleViewUser,
        handleEditUser,
        handleDeleteUser,
        refreshUsers,
        
        // Utilidades
        clearError: () => setError(null)
    };
    
    const authContextValue = {
        // Estado de autenticación
        currentUser,
        isAuthenticated,
        authLoading,
        
        // Funciones de autenticación
        updateCurrentUser,
        logout,
        
        // Utilidades de permisos
        isAdmin: currentUser?.role === 1,
        isEditor: currentUser?.role === 2,
        canManageUsers: currentUser?.role === 1,
        
        // Datos del usuario actual
        currentUserData: currentUser ? {
            id: currentUser.sub,
            username: currentUser.username || currentUser.userName,
            email: currentUser.email,
            role: currentUser.role,
            roleId: currentUser.role
        } : null
    };

    return (
        <UserAuthContext.Provider value={authContextValue}>
            <UserContext.Provider value={userContextValue}>
                {children}
            </UserContext.Provider>
        </UserAuthContext.Provider>
    );
}

export { 
    UserContext, 
    UserAuthContext, 
    UserProvider,
    useUsers,
    useAuth 
};