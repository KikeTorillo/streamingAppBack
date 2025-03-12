// auth.routes.js

const express = require('express'); // Framework para manejo de rutas y middleware
const passport = require('passport'); // Biblioteca para autenticación
const AuthService = require('./../services/authService'); // Servicio de autenticación personalizado
const service = new AuthService(); // Instancia del servicio de autenticación
const { validatorHandler } = require('./../middleware/validatorHandler'); // Middleware para validación de datos
const {
  loginSchema,
  changePasswordSchema,
  registrationSchema,
} = require('./../schemas/usersSchemas'); // Esquemas de validación Joi
const router = express.Router(); // Creación de un enrutador Express

const { config } = require('./../config/config'); // Configuración de la aplicación

/**
 * Ruta POST /login: Autenticación de usuario con estrategia local (email/password)
 * Utiliza Passport para autenticar al usuario y genera un token JWT.
 */
router.post(
  '/login',
  // Paso 1: Autenticación con Passport (estrategia local)
  passport.authenticate('local', { session: false }), // Desactiva sesiones porque usamos JWT
  // Paso 2: Validación del cuerpo de la solicitud
  validatorHandler(loginSchema, 'body'),
  async (req, res, next) => {
    try {
      const userReq = req.user; // Usuario autenticado por Passport
      const token = service.signToken(userReq); // Genera un token JWT para el usuario

      // Responde con una cookie segura que contiene el token JWT
      res
        .cookie('access_token', token.token, {
          httpOnly: true, // La cookie solo es accesible desde el servidor
          secure: config.isProd === true, // Solo se envía por HTTPS en producción
          sameSite: config.isProd ? 'none' : 'lax', // Restringe el envío de cookies a dominios externos
        })
        .json(token.payload); // Retorna el payload del token como respuesta JSON
    } catch (error) {
      next(error); // Maneja errores con el siguiente middleware de error
    }
  }
);

/**
 * Ruta POST /recovery: Envía un enlace de recuperación de contraseña
 * Recibe el email del usuario y genera un token de recuperación.
 */
router.post('/recovery', async (req, res, next) => {
  try {
    const { email } = req.body; // Extrae el email del cuerpo de la solicitud
    const rta = await service.sendRecoveryLink(email); // Envía el enlace de recuperación
    res.json(rta); // Retorna la respuesta del servicio
  } catch (error) {
    next(error); // Maneja errores con el siguiente middleware de error
  }
});

/**
 * Ruta POST /change-password: Cambia la contraseña del usuario
 * Recibe un token de recuperación y una nueva contraseña.
 */
router.post(
  '/change-password',
  // Validación del cuerpo de la solicitud
  validatorHandler(changePasswordSchema, 'body'),
  async (req, res, next) => {
    try {
      const { token, newPassword } = req.body; // Extrae el token y la nueva contraseña
      const rta = await service.changePassword(token, newPassword); // Cambia la contraseña
      res.json(rta); // Retorna la respuesta del servicio
    } catch (error) {
      next(error); // Maneja errores con el siguiente middleware de error
    }
  }
);

/**
 * Ruta POST /registration: Registra un nuevo usuario
 * Recibe los datos del usuario y lo registra en el sistema.
 */
router.post(
  '/registration',
  // Validación del cuerpo de la solicitud
  validatorHandler(registrationSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body; // Extrae los datos del cuerpo de la solicitud
      body.role = 'user'; // Asigna el rol predeterminado "user"
      const rta = await service.regiterUser(body); // Registra al usuario
      res.json(rta); // Retorna la respuesta del servicio
    } catch (error) {
      next(error); // Maneja errores con el siguiente middleware de error
    }
  }
);

module.exports = router; // Exporta el enrutador para su uso en la aplicación