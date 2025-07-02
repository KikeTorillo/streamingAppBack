/**
 * Configura el contexto de auditoría para la sesión actual de la base de datos.
 * Establece variables de sesión en PostgreSQL que almacenan información sobre el usuario
 * y la IP que realizan operaciones, para ser utilizadas por los triggers de auditoría.
 *
 * @param {Object} client - Cliente de la base de datos (conexión activa).
 * @param {string|number} userId - ID del usuario que realiza la operación (ej: '123' o 123).
 * @param {string} clientIp - Dirección IP del cliente (ej: '192.168.1.100').
 * 
 * @example
 * // Uso dentro de una transacción:
 * const client = await pool.connect();
 * await configureAuditContext(client, 'user_123', '192.168.1.100');
 * await client.query('INSERT INTO tabla (...) VALUES (...)');
 */
async function configureAuditContext(client, userId, clientIp) {
    // Ejecuta una consulta parametrizada para evitar inyecciones SQL
    await client.query(`
      SELECT 
        set_config('app.current_user_id', $1, false), -- Establece el ID del usuario en la sesión
        set_config('app.client_ip', $2, false)        -- Establece la IP del cliente en la sesión
    `, [userId, clientIp]);

    // Verificación (opcional)
    const { rows } = await client.query(`SELECT 
        current_setting('app.current_user_id') AS user_id,
        current_setting('app.client_ip') AS ip`);

    console.log('Auditoría configurada:', rows[0]);
    // Notas clave:
    // 1. `set_config` es una función de PostgreSQL para definir variables de sesión.
    // 2. El tercer parámetro `false` indica que la configuración no es local a una transacción,
    //    permitiendo que los triggers accedan a estas variables durante toda la sesión.
    // 3. Estas variables son utilizadas por la función `log_audit()` en los triggers de auditoría.
  }

  module.exports={ configureAuditContext };