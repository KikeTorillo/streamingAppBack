// Este es el servicio que gestiona la data de los usuarios
const pool = require('../libs/postgresPool');
// bcrypt se utiliza para poder encriptar algun dato, en este caso la contrasena
const bcrypt = require('bcrypt');
const boom = require('@hapi/boom');
const { updateTable } = require('./../utils/sql/updateAbtraction');

class UsersService {

  constructor() {
    // Cada servicio tine que tener su propio pool en el contructor
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));
  }

  async findOne(id) {
    const user = await this.pool.query(`select * from users where id='${id}';`);
    if (!user) {
      throw boom.notFound('user not found');
    }
    return user.rows[0];
  }

  async find() {
    const query = "select * from users order by id;";
    const rta = await this.pool.query(query);
    return rta.rows;
  }

  async findByEmail(email) {
    const query = `select * from users where email='${email}';`;
    const rta = await this.pool.query(query);   
    return rta.rows[0];
  }

  async create(body) {
    const user = await this.pool.query(`select * from users where email='${body.email}';`);
    if (user.rows.length !== 0) {
      throw boom.conflict('Usuario repetido');
    }
    const hash = await bcrypt.hash(body.password, 10);
    const query = `insert into users (email,password,role) values ('${body.email}','${hash}','${body.role}');`;
    const rta = await this.pool.query(query);
    return rta.rows[0];
  }

  async update(id, body) {
    const rta = updateTable('users',id,body);
    return rta;
  }

  async delete(id){
    const user = await this.findOne(id);
    if (user) {
      const query = `delete from users where id=${id}`;
      const rta = await this.pool.query(query);
      return id;
    }else{
      throw new Error(boom.notFound());
    }
  }
  
}

module.exports = UsersService;