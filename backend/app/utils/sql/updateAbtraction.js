// updateAbtraction.js
const boom = require('@hapi/boom');
const format = require('pg-format'); // Para escapar identificadores seguros
/**
 * Función genérica para actualizar registros en una tabla.
 * Construye dinámicamente una consulta SQL basada en los datos proporcionados.
 *
 * @param {string} tableName - Nombre de la tabla a actualizar.
 * @param {number} id - ID del registro a actualizar.
 * @param {Object} body - Objeto que contiene las columnas y valores a actualizar.
 * @returns {Promise} - Respuesta de la consulta SQL con el registro actualizado.
 */
async function updateTable(client, tableName, id, body) {
  /*const allowedTables = ['users', 'roles'];
  if (!allowedTables.includes(tableName)) {
    throw boom.badRequest('Tabla no permitida');
  }*/

  try {
    const safeTableName = format('%I', tableName);
    const columnsResult = await client.query(
      `SELECT column_name 
       FROM information_schema.columns 
       WHERE table_schema = 'public' AND table_name = $1`,
      [tableName]
    );

    const validColumns = columnsResult.rows.map(row => row.column_name);
    const updates = [];
    const values = [];
    let paramIndex = 1;

    Object.entries(body).forEach(([key, value]) => {
      const snakeKey = camelToSnake(key);
      if (validColumns.includes(snakeKey)) {
        updates.push(`${format('%I', snakeKey)} = $${paramIndex++}`);
        values.push(value);
      }
    });

    if (updates.length === 0) {
      throw boom.badRequest('No hay campos válidos para actualizar');
    }

    // ✅ Corrección: Índice correcto para el WHERE
    const whereParamIndex = paramIndex; // O values.length si usas la otra opción
    values.push(id);

    const query = `
      UPDATE ${safeTableName} 
      SET ${updates.join(', ')} 
      WHERE id = $${whereParamIndex} 
      RETURNING id;
    `;

    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error al actualizar la tabla:', error.message);
    throw boom.internal('Error al actualizar el registro');
  }
}

// Función auxiliar para convertir camelCase a snake_case
function camelToSnake(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

module.exports = { updateTable };
