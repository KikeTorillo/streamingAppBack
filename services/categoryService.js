// services/categoryService.js

const pool = require('../libs/postgresPool'); // Pool de conexiones a PostgreSQL
const boom = require('@hapi/boom'); // Biblioteca para manejo de errores HTTP estructurados
const { updateTable } = require('./../utils/sql/updateAbtraction'); // Función genérica para actualización de tablas

/**
 * Clase que gestiona las operaciones relacionadas con las categorías.
 */
class CategoryService {
  constructor() {
    this.pool = pool; // Asigna el pool de conexiones
    this.pool.on('error', (err) => console.error(err)); // Manejo de errores del pool
  }

  /**
   * Obtiene la lista de todas las categorías.
   * @returns {Array} Lista de categorías.
   */
  async getCategories() {
    const query = 'SELECT * FROM categories ORDER BY name;';
    const result = await this.pool.query(query);
    return result.rows;
  }

  /**
   * Obtiene una categoría por su ID.
   * @param {number} id - ID de la categoría a buscar.
   * @returns {Object} Datos de la categoría encontrada.
   * @throws {Error} Error si la categoría no existe.
   */
  async getCategoryById(id) {
    const query = 'SELECT * FROM categories WHERE id = $1;';
    const result = await this.pool.query(query, [id]);
    if (result.rows.length === 0) {
      throw boom.notFound('Categoría no encontrada');
    }
    return result.rows[0];
  }

  /**
   * Crea una nueva categoría.
   * @param {Object} body - Datos de la categoría a crear (por ejemplo, { name }).
   * @returns {Object} Categoría creada.
   * @throws {Error} Error si la categoría ya existe.
   */
  async createCategory(body) {
    // Verificar si ya existe una categoría con el mismo nombre
    const checkQuery = 'SELECT * FROM categories WHERE name = $1;';
    const checkResult = await this.pool.query(checkQuery, [body.name]);
    if (checkResult.rows.length !== 0) {
      throw boom.conflict('La categoría ya existe');
    }
    // Insertar la nueva categoría en la base de datos
    const insertQuery = 'INSERT INTO categories (name) VALUES ($1) RETURNING *;';
    const insertResult = await this.pool.query(insertQuery, [body.name]);
    return insertResult.rows[0];
  }

  /**
   * Actualiza una categoría existente.
   * @param {number} id - ID de la categoría a actualizar.
   * @param {Object} body - Datos a actualizar (por ejemplo, { name }).
   * @returns {Object} Categoría actualizada.
   */
  async updateCategory(id, body) {
    // Verificar que la categoría existe
    await this.getCategoryById(id);
    // Actualizar la categoría utilizando la función genérica updateTable
    const updatedCategory = await updateTable('categories', id, body);
    return updatedCategory;
  }

  /**
   * Elimina una categoría por su ID.
   * @param {number} id - ID de la categoría a eliminar.
   * @returns {number} ID de la categoría eliminada.
   * @throws {Error} Error si la categoría no existe.
   */
  async deleteCategory(id) {
    // Verificar que la categoría existe
    await this.getCategoryById(id);
    const deleteQuery = 'DELETE FROM categories WHERE id = $1;';
    await this.pool.query(deleteQuery, [id]);
    return id;
  }
}

module.exports = CategoryService;