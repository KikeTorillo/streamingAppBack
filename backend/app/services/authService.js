// AuthService.js

const boom = require('@hapi/boom'); // Biblioteca para manejo de errores HTTP estructurados
const bcrypt = require('bcrypt'); // Biblioteca para encriptación de contraseñas
const UserService = require('./usersService'); // Servicio de usuarios para interactuar con la base de datos
const service = new UserService(); // Instancia del servicio de usuarios
const jwt = require('jsonwebtoken'); // Biblioteca para generación y verificación de tokens JWT
const { config } = require('./../config/config'); // Configuración de la aplicación
const nodemailer = require('nodemailer'); // Biblioteca para envío de correos electrónicos

class AuthService {
  /**
   * Genera un token JWT a partir de los datos del usuario.
   * @param {Object} user - Objeto de usuario que contiene `id` y `role`.
   * @returns {Object} Un objeto con el payload y el token generado.
   */
  signToken(user) {
    const payload = {
      sub: user.id, // Identificador único del usuario
      role: user.role, // Rol del usuario
    };
    // Genera el token JWT usando la clave secreta y el payload
    const token = jwt.sign(
      payload,
      config.jwtSecret
      // Opcionalmente, se puede añadir una expiración (ej., '1h')
      //{ expiresIn: '1h' }
    );
    return { payload, token }; // Retorna tanto el payload como el token
  }

  /**
   * Verifica las credenciales de un usuario para autenticación.
   * @param {string} email - Email del usuario.
   * @param {string} password - Contraseña proporcionada por el usuario.
   * @returns {Object} Datos del usuario autenticado (sin contraseña).
   * @throws {Error} Error si el usuario no existe o la contraseña es incorrecta.
   */
  async getUser(userName, password) {
    const user = await service.findByUserName(userName); // Busca al usuario por email
    if (!user) {
      throw boom.unauthorized('Usuario no encontrado'); // Lanza error 401 si no existe
    }
    const isMatch = await bcrypt.compare(password, user.password); // Compara contraseñas
    if (!isMatch) {
      throw boom.unauthorized('Contraseña incorrecta'); // Lanza error 401 si no coinciden
    }
    delete user.password; // Elimina la contraseña del objeto retornado por seguridad
    return user; // Retorna los datos del usuario autenticado
  }

  /**
   * Envía un enlace de recuperación de contraseña al correo del usuario.
   * @param {string} email - Email del usuario que solicita recuperación.
   * @returns {Object} Confirmación de envío del correo.
   * @throws {Error} Error si el usuario no existe.
   */
  async sendRecoveryLink(email) {
    const user = await service.findByEmail(email); // Busca al usuario por email
    if (!user) {
      throw boom.unauthorized('Usuario no encontrado'); // Lanza error 401 si no existe
    }
    const payload = { sub: user.id }; // Crea el payload para el token
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' }); // Genera token con expiración
    const link = `${config.urlFront}/resetpass?token=${token}`; // Construye el enlace de recuperación
    const result = await service.update(user.id, { recovery_token: token }); // Guarda el token en la base de datos
    const mail = {
      from: config.email, // Remitente
      to: user.email, // Destinatario
      subject: 'Email para recuperar contraseña', // Asunto del correo
      html: `<b>Ingresa a este link =></b> <a href="${link}">Recuperar contraseña</a>`, // Contenido HTML
    };
    const rta = await this.sendEmail(mail); // Envía el correo
    return rta; // Retorna confirmación
  }

  /**
   * Cambia la contraseña del usuario utilizando un token de recuperación.
   * @param {string} token - Token de recuperación enviado al usuario.
   * @param {string} newPassword - Nueva contraseña proporcionada por el usuario.
   * @returns {Object} Mensaje de confirmación.
   * @throws {Error} Error si el token no es válido o no coincide.
   */
  async changePassword(token, newPassword) {
    const payload = jwt.verify(token, config.jwtSecret); // Verifica el token
    const user = await service.findOne(payload.sub); // Busca al usuario por ID
    if (user.recovery_token !== token) {
      throw boom.unauthorized('Token inválido o expirado'); // Lanza error 401 si no coincide
    }
    const hash = await bcrypt.hash(newPassword, 10); // Encripta la nueva contraseña
    await service.update(user.id, { recovery_token: null, password: hash }); // Actualiza la contraseña
    return { message: 'Contraseña cambiada exitosamente' }; // Retorna mensaje de éxito
  }

  /**
   * Envía un correo electrónico utilizando nodemailer.
   * @param {Object} infoMail - Información del correo a enviar.
   * @returns {Object} Confirmación de envío del correo.
   */
  async sendEmail(infoMail) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Servidor SMTP
      port: 465, // Puerto seguro
      secure: true, // Habilita SSL/TLS
      auth: {
        user: config.email, // Correo del remitente
        pass: config.passEmail, // Contraseña del remitente
      },
    });
    await transporter.sendMail(infoMail); // Envía el correo
    return { message: 'Correo enviado exitosamente' }; // Retorna confirmación
  }

  /**
   * Registra un nuevo usuario en el sistema.
   * @param {Object} body - Datos del usuario a registrar.
   * @returns {Object} Mensaje de confirmación.
   */
  async regiterUser(body) {
    body.roleId = 2;
    const user = await service.create(body); // Crea el usuario en la base de datos
    return { message: 'Usuario registrado exitosamente' }; // Retorna mensaje de éxito
  }
}

module.exports = AuthService;
