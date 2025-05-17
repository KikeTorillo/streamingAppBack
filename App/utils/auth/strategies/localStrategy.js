//esta dependencia es para generar una estrategia de autenticacion
const { Strategy } = require('passport-local');
const AuthService = require('../../../services/authService');
const service = new AuthService;

//Se crea la estrategia y se exporta
const LocalStrategy = new Strategy({
        usernameField: 'email'
    }
    ,async (email, password, done) => {
    try {
        const user = await service.getUser(email,password);
        done(null, user);
    } catch (error) {
        done(error, false);
    }
});

module.exports = LocalStrategy;