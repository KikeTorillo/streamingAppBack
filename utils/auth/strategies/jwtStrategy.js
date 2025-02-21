const { Strategy, ExtractJwt } = require('passport-jwt');
const { config } = require('../../../config/config');
const boom = require('@hapi/boom');

// esta estrategia es para validar si el token que el usuario nos comparte por el header
// es valido y esta asociado a un usuario por login
const options = {
    //El Extract jtw se usa para buscar el token desde la peticion
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    //Se manda a llamar el secret con el que se firman todos los tokens
    secretOrKey: config.jwtSecret,
    messages: 'dsadsda'
}

const JwtStrategy = new Strategy(options, (payload, done) => {
    return done(null, payload);
});

module.exports = JwtStrategy;
