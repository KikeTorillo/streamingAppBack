// usersSchemas.js

// Importación de Joi para crear esquemas de validación
const Joi = require('joi');

/**
 * Definición de tipos de datos reutilizables para validación.
 */
const id = Joi.number().id(); // ID numérico (puede ser personalizado con .id() si se usa una extensión)
const email = Joi.string().email(); // Email válido según formato estándar
const password = Joi.string().alphanum(); // Contraseña alfanumérica
const role = Joi.number(); // Rol del usuario (cadena de texto)
const token = Joi.string(); // Token de autenticación o recuperación

/**
 * Esquema para la creación de un usuario.
 * Valida los datos necesarios para registrar un nuevo usuario.
 */
const createUserSchema = Joi.object({
    email: email.required(), // Email obligatorio y válido
    password: password.required(), // Contraseña obligatoria y alfanumérica
    role: role.required(), // Rol obligatorio
});

/**
 * Esquema para la actualización de un usuario.
 * Valida los datos opcionales que pueden ser actualizados.
 */
const updateUserSchema = Joi.object({
    email: email, // Email opcional (se valida si se proporciona)
    password: password, // Contraseña opcional (se valida si se proporciona)
    role_id: role, // Rol opcional (se valida si se proporciona)
});

/**
 * Esquema para obtener un usuario por ID.
 * Valida que el ID sea proporcionado y sea un número válido.
 */
const getUserSchema = Joi.object({
    id: id.required(), // ID obligatorio
});

/**
 * Esquema para el inicio de sesión.
 * Valida las credenciales necesarias para autenticar a un usuario.
 */
const loginSchema = Joi.object({
    email: email.required(), // Email obligatorio y válido
    password: password.required(), // Contraseña obligatoria y alfanumérica
});

/**
 * Esquema para cambiar la contraseña.
 * Valida el token de recuperación y la nueva contraseña.
 */
const changePasswordSchema = Joi.object({
    newPassword: password.required(), // Nueva contraseña obligatoria y alfanumérica
    token: token.required(), // Token de recuperación obligatorio
});

/**
 * Esquema para el registro de un nuevo usuario.
 * Valida los datos necesarios para registrar un usuario.
 */
const registrationSchema = Joi.object({
    email: email.required(), // Email obligatorio y válido
    password: password.required(), // Contraseña obligatoria y alfanumérica
});

// Exportación de los esquemas para su uso en validaciones
module.exports = {
    createUserSchema,
    updateUserSchema,
    getUserSchema,
    loginSchema,
    changePasswordSchema,
    registrationSchema,
};