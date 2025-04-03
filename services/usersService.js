// UsersService.js

// Importaciones necesarias
const pool = require('../libs/postgresPool'); // Pool de conexiones a PostgreSQL
const bcrypt = require('bcrypt'); // Biblioteca para encriptación de contraseñas
const boom = require('@hapi/boom'); // Biblioteca para manejo de errores HTTP estructurados
const { updateTable } = require('./../utils/sql/updateAbtraction'); // Función genérica para actualización de tablas

/**
 * Clase que gestiona las operaciones relacionadas con los usuarios.
 */
class UsersService {
  /**
   * Constructor de la clase.
   * Inicializa el pool de conexiones y maneja errores del pool.
   */
  constructor() {
    this.pool = pool; // Asigna el pool de conexiones
    this.pool.on('error', (err) => console.error(err)); // Maneja errores del pool
  }

  /**
   * Busca un usuario por su ID.
   * @param {number} id - ID del usuario a buscar.
   * @returns {Object} Datos del usuario encontrado.
   * @throws {Error} Error si el usuario no existe.
   */
  async findOne(id) {
    const user = await this.pool.query(`SELECT * FROM users WHERE id='${id}';`);
    if (!user.rows.length) {
      throw boom.notFound('Usuario no encontrado'); // Lanza error 404 si no existe
    }
    return user.rows[0]; // Retorna el primer resultado
  }

  /**
   * Obtiene todos los usuarios ordenados por ID.
   * @returns {Array} Lista de usuarios.
   */
  async find() {
    const query = "SELECT * FROM users ORDER BY id;";
    const rta = await this.pool.query(query);
    return rta.rows; // Retorna todos los resultados
  }

  /**
   * Busca un usuario por su email.
   * @param {string} email - Email del usuario a buscar.
   * @returns {Object} Datos del usuario encontrado.
   */
  async findByEmail(email) {
    const query = `SELECT us.*,ro.name role FROM users us join roles ro on us.role_id=ro.id WHERE email='${email}';`;
    const rta = await this.pool.query(query);
    return rta.rows[0]; // Retorna el primer resultado
  }

  /**
   * Crea un nuevo usuario.
   * @param {Object} body - Datos del usuario a crear (email, password, role).
   * @returns {Object} Confirmación de creación.
   * @throws {Error} Error si el email ya está registrado.
   */
  async create(body) {
    // Verifica si el email ya existe
    const user = await this.pool.query(`SELECT * FROM users WHERE email='${body.email}';`);
    if (user.rows.length !== 0) {
      throw boom.conflict('El usuario ya está registrado'); // Lanza error 409 si existe
    }
    // Encripta la contraseña
    const hash = await bcrypt.hash(body.password, 10);
    // Inserta el nuevo usuario en la base de datos
    const query = `INSERT INTO users (email, password, role_id) VALUES ('${body.email}', '${hash}', ${body.role});`;
    const rta = await this.pool.query(query);
    return rta.rows[0]; // Retorna el resultado de la inserción
  }

  /**
   * Actualiza un usuario existente.
   * @param {number} id - ID del usuario a actualizar.
   * @param {Object} body - Datos a actualizar.
   * @returns {Object} Confirmación de actualización.
   */
  async update(id, body) {
    const rta = updateTable('users', id, body); // Usa función genérica para actualizar
    return rta;
  }

  /**
   * Elimina un usuario por su ID.
   * @param {number} id - ID del usuario a eliminar.
   * @returns {number} ID del usuario eliminado.
   * @throws {Error} Error si el usuario no existe.
   */
  async delete(id) {
    const user = await this.findOne(id); // Verifica si el usuario existe
    if (!user) {
      throw boom.notFound('Usuario no encontrado'); // Lanza error 404 si no existe
    }
    // Elimina el usuario de la base de datos
    const query = `DELETE FROM users WHERE id=${id}`;
    const rta = await this.pool.query(query);
    return id; // Retorna el ID del usuario eliminado
  }
}

module.exports = UsersService;