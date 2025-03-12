// updateAbtraction.js

const pool = require('./../../libs/postgresPool'); // Importa el pool de conexiones a PostgreSQL

/**
 * Función genérica para actualizar registros en una tabla.
 * Construye dinámicamente una consulta SQL basada en los datos proporcionados.
 * 
 * @param {string} tableName - Nombre de la tabla a actualizar.
 * @param {number} id - ID del registro a actualizar.
 * @param {Object} body - Objeto que contiene las columnas y valores a actualizar.
 * @returns {Promise} - Respuesta de la consulta SQL con el registro actualizado.
 */
async function updateTable(tableName, id, body) {
  try {
    // Consulta las columnas y sus tipos de datos en la tabla especificada
    const columnsTable = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = '${tableName}';
    `);

    // Obtiene las claves (nombres de columnas) del objeto body
    const arrKeys = Object.keys(body);
    const arrKeysLength = arrKeys.length;

    // Inicializa la consulta SQL de actualización
    let queryUpdate = `UPDATE ${tableName} SET`;

    // Itera sobre las claves del objeto body para construir la consulta
    for (let j = 0; j < arrKeysLength; j++) {
      const columnName = arrKeys[j];

      // Filtra las columnas válidas en la tabla
      const filterOption = columnsTable.rows.filter((item) => {
        return item.column_name === columnName;
      });

      // Si la columna existe en la tabla, se agrega a la consulta
      if (filterOption.length > 0) {
        const dataType = filterOption[0].data_type;

        // Maneja valores nulos
        if (body[columnName] === null) {
          queryUpdate += ` ${columnName}=NULL`;
        } else {
          // Agrega comillas simples para valores no numéricos
          if (dataType !== 'integer') {
            queryUpdate += ` ${columnName}='${body[columnName]}'`;
          } else {
            queryUpdate += ` ${columnName}=${body[columnName]}`;
          }
        }

        // Agrega una coma si no es la última columna
        if (j + 1 !== arrKeysLength) {
          queryUpdate += ',';
        }
      }
    }

    // Agrega la condición WHERE para identificar el registro a actualizar
    queryUpdate += ` WHERE id=${id};`;

    // Ejecuta la consulta SQL de actualización
    const rta = await pool.query(queryUpdate);

    // Retorna el primer resultado de la consulta
    return rta.rows[0];
  } catch (error) {
    console.error('Error al actualizar la tabla:', error.message);
    throw new Error('Error al actualizar la tabla: ' + error.message);
  }
}

module.exports = { updateTable }; // Exporta la función updateTable