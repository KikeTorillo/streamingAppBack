// usersSchemas.js
// Importación de Joi para crear esquemas de validación
const Joi = require('joi');

/**
 * Definición de tipos de datos reutilizables para validación.
 */
const id = Joi.number().id().positive(); // ID numérico (puede ser personalizado con .id() si se usa una extensión)
const email = Joi.string().email(); // Email válido según formato estándar
const password = Joi.string().alphanum(); // Contraseña alfanumérica
const roleId = Joi.number().positive(); // Rol del usuario (cadena de texto)
const token = Joi.string(); // Token de autenticación o recuperación

/**
 * Esquema para la creación de un usuario.
 * Valida los datos necesarios para registrar un nuevo usuario.
 */
const createUserSchema = Joi.object({
  email: email.required().messages({
    'any.required': 'El email es obligatorio',
    'string.empty': 'El email no puede estar vacío',
    'string.base': 'El email debe ser un string',
  }),
  password: password.required().messages({
    'any.required': 'El password es obligatorio',
    'string.empty': 'El password no puede estar vacio',
    'string.base': 'El password debe ser un string',
  }),
  roleId: roleId.required().messages({
    'any.required': 'El roleId es obligatorio',
    'number.empty': 'El roleId no puede estar vacio',
    'number.base': 'El roleId debe ser un número',
    'number.positive': 'El roleId debe ser un número positivo',
  }),
});

/**
 * Esquema para obtener un usuario por ID.
 * Valida que el ID sea proporcionado y sea un número válido.
 */
const getUserSchema = Joi.object({
  id: id.required().messages({
    'any.required': 'El id es obligatorio',
    'number.empty': 'El id no puede estar vacio',
    'number.base': 'El id debe ser un número',
    'number.positive': 'El id debe ser un número positivo',
  }),
});

/**
 * Esquema para la actualización de un usuario.
 * Valida los datos opcionales que pueden ser actualizados.
 */
const updateUserSchema = Joi.object({
  email: email.optional().messages({
    'string.empty': 'El email no puede estar vacío',
  }),
  roleId: roleId.optional().messages({
    'number.empty': 'El roleId no puede estar vacio',
    'number.base': 'El roleId debe ser un número',
    'number.positive': 'El roleId debe ser un número positivo',
  }),
});

/**
 * Esquema para el registro de un nuevo usuario.
 * Valida los datos necesarios para registrar un usuario.
 */
const registrationSchema = Joi.object({
  email: email.required().messages({
    'any.required': 'El email es obligatorio',
    'string.empty': 'El email no puede estar vacio',
    'string.base': 'El email debe ser un string',
  }),
  password: password.required().messages({
    'any.required': 'El password es obligatorio',
    'string.empty': 'El password no puede estar vacio',
    'string.base': 'El password debe ser un string',
  }),
});

/**
 * Esquema para el inicio de sesión.
 * Valida las credenciales necesarias para autenticar a un usuario.
 */
const loginSchema = Joi.object({
  email: email.required().messages({
    'any.required': 'El email es obligatorio',
    'string.empty': 'El email no puede estar vacio',
    'string.base': 'El email debe ser un string',
  }),
  password: password.required().messages({
    'any.required': 'El password es obligatorio',
    'string.empty': 'El password no puede estar vacio',
    'string.base': 'El password debe ser un string',
  }),
});

/**
 * Esquema para cambiar la contraseña.
 * Valida el token de recuperación y la nueva contraseña.
 */
const changePasswordSchema = Joi.object({
  newPassword: password.required().messages({
    'any.required': 'El password es obligatorio',
    'string.empty': 'El password no puede estar vacio',
    'string.base': 'El password debe ser un string',
  }),
  token: token.required().messages({
    'any.required': 'El token es obligatorio',
    'string.empty': 'El token no puede estar vacio',
    'string.base': 'El token debe ser un string',
  }),
});

/**
 * Esquema para el inicio de sesión.
 * Valida las credenciales necesarias para autenticar a un usuario.
 */
const recoverySchema = Joi.object({
  email: email.required().messages({
    'any.required': 'El email es obligatorio',
    'string.empty': 'El email no puede estar vacio',
    'string.base': 'El email debe ser un string',
  }),
});

// Exportación de los esquemas para su uso en validaciones
module.exports = {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
  registrationSchema,
  loginSchema,
  changePasswordSchema,
  recoverySchema
};
