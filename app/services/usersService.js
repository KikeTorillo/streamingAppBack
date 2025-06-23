// UsersService.js

const pool = require('../libs/postgresPool'); // Pool de conexiones a PostgreSQL
const bcrypt = require('bcrypt'); // Biblioteca para encriptación de contraseñas
const boom = require('@hapi/boom'); // Biblioteca para manejo de errores HTTP estructurados
const { updateTable } = require('./../utils/sql/updateAbtraction'); // Función genérica para actualización de tablas

/**
 * Clase que gestiona las operaciones relacionadas con los usuarios.
 */
class UsersService {
  constructor() {
    this.pool = pool; // Asigna el pool de conexiones
    this.pool.on('error', (err) => {
      console.error('Error en el pool de PostgreSQL:', err);
      // Considera reiniciar o notificar en producción
    });
  }

  /**
   * Obtiene todos los usuarios ordenados por ID.
   * @returns {Array} Lista de usuarios.
   */
  async find() {
    const query =
      'SELECT id, user_name, email, role_id, created_at, updated_at FROM users ORDER BY id';
    const result = await this.pool.query(query);
    return result.rows;
  }

  /**
   * Busca un usuario por su ID.
   * @param {number} id - ID del usuario a buscar.
   * @returns {Object} Datos del usuario encontrado.
   * @throws {Error} Error si el usuario no existe.
   */
  async findOne(id) {
    const query =
      'SELECT id, user_name, email, role_id, recovery_token, created_at, updated_at FROM users WHERE id = $1';

    const result = await this.pool.query(query, [id]);

    if (!result.rows.length) {
      throw boom.notFound('Usuario no encontrado');
    }
    const user = result.rows[0];
    return user;
  }

  /**
   * Busca un usuario por su email.
   * @param {string} email - Email del usuario a buscar.
   * @returns {Object} Datos del usuario encontrado.
   */
  async findByEmail(email) {
    const query =
      'SELECT us.*, ro.name AS role FROM users us JOIN roles ro ON us.role_id = ro.id WHERE email = $1';
    const result = await this.pool.query(query, [email]);
    return result.rows[0];
  }

  /**
   * Busca un usuario por su email.
   * @param {string} userName - Email del usuario a buscar.
   * @returns {Object} Datos del usuario encontrado.
   */
  async findByUserName(userName) {
    const query =
      'SELECT us.*, ro.name AS role FROM users us JOIN roles ro ON us.role_id = ro.id WHERE user_name = $1';
    const result = await this.pool.query(query, [userName]);
    return result.rows[0];
  }

  /**
   * Crea un nuevo usuario.
   * @param {Object} body - Datos del usuario a crear (email, password, role).
   * @returns {Object} Confirmación de creación.
   * @throws {Error} Error si el email ya está registrado.
   */
  async create(body) {

    const userName = await this.findByUserName(body.userName);
    if (userName) {
      throw boom.conflict('El userName  ya está registrado');
    }

    const email = await this.findByEmail(body.email);
    if (email) {
      throw boom.conflict('El email  ya está registrado');
    }

    // Encriptar contraseña
    const hash = await bcrypt.hash(body.password, 10);

    // Insertar usuario con parámetros seguros
    const insertQuery = `
     INSERT INTO users (user_name, email, password, role_id) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, user_name, email, role_id`;

    const result = await this.pool.query(insertQuery, [
      body.userName,
      body.email,
      hash,
      body.roleId,
    ]);

    return result.rows[0];
  }

  /**
   * Actualiza un usuario existente.
   * @param {number} id - ID del usuario a actualizar.
   * @param {Object} changes - Datos a actualizar.
   * @returns {Object} Confirmación de actualización.
   */
  async update(id, changes) {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');
      const user = await this.findOne(id);

      const userName = await this.findByUserName(changes.userName);
      if (userName) {
        throw boom.conflict('El userName  ya está registrado');
      }

      const email = await this.findByEmail(changes.email);
      if (email) {
        throw boom.conflict('El email  ya está registrado');
      }

      const result = await updateTable(client, 'users', user.id, changes);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Elimina un usuario por su ID.
   * @param {number} id - ID del usuario a eliminar.
   * @returns {number} ID del usuario eliminado.
   * @throws {Error} Error si el usuario no existe.
   */
  async delete(id) {
    const user = await this.findOne(id);
    const query = 'DELETE FROM users WHERE id = $1';
    await this.pool.query(query, [id]);
    return user;
  }
}

module.exports = UsersService;
