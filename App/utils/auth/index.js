const passport  = require('passport');
const LocalStrategy = require('./strategies/localStrategy');
//se deja configurada la estrategia de jwt pero no se usa debido a que no se podia formatear el error
//por lo que se creo en su lugar el middleware authenticateJwt
const JwtStrategy = require('./strategies/jwtStrategy');

passport.use(LocalStrategy);