const pool = require('./../../libs/postgresPool');

async function updateTable(tableName, id, body) {
  const columnsTable = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '${tableName}';`);
  const arrKeys = Object.keys(body);
  const arrKeysLength = Object.keys(body).length;
  let queryUpdate = `UPDATE ${tableName} SET`;
  for (let j = 0; j < arrKeysLength; j++) {
    const filterOption = columnsTable.rows.filter((item) => {
      return item.column_name === arrKeys[j];
    });
    if (filterOption.length > 0) {
      if (body[arrKeys[j]] === null) {
        queryUpdate += ` ${arrKeys[j]}=${body[arrKeys[j]]}`;
      }else{
        if (filterOption[0].data_type !== 'integer') {
          queryUpdate += ` ${arrKeys[j]}='${body[arrKeys[j]]}'`;
        } else {
          queryUpdate += ` ${arrKeys[j]}=${body[arrKeys[j]]}`;
        }
      }
      if (j + 1 !== arrKeysLength) {
        queryUpdate += ','
      }
    }
  }
  queryUpdate += ` WHERE id=${id};`;
  const rta = await pool.query(queryUpdate);
  return rta.rows[0];
}

module.exports = { updateTable }