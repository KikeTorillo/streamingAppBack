// Ruta de autenticacion en donde se valida la
// estrategia local de autenticacion con passport
const express = require('express');
const passport = require('passport');
const AuthService = require('./../services/authService');
const service = new AuthService();
const { validatorHandler } = require('./../middleware/validatorHandler');
const {
  loginSchema,
  changePasswordSchema,
  registrationSchema,
} = require('./../schemas/usersSchemas');
const router = express.Router();

const { config } = require('./../config/config');

router.post(
  '/login',
  // se coloca el manejo de sesiones de passport en false
  // esto por que las sesiones se getionan con JWT
  passport.authenticate('local', { session: false }),

  validatorHandler(loginSchema, 'body'),
  async (req, res, next) => {
    try {
      const userReq = req.user;
      const token = service.signToken(userReq);
      res
        .cookie('access_token', token.token, {
          httpOnly: true, // la cookie solo se puede acceder en el servidor
          secure: config.isProd === true, // solo se envia por https importante poner true en produccion
          sameSite: config.isProd ? 'none' : 'lax', // solo se envia si es el mismo dominio
        })
        .json(token.payload);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/recovery', async (req, res, next) => {
  try {
    const { email } = req.body;
    const rta = await service.sendRecoveryLink(email);
    res.json(rta);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/change-password',
  validatorHandler(changePasswordSchema, 'body'),
  async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;
      const rta = await service.changePassword(token, newPassword);
      res.json(rta);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/registration',
  validatorHandler(registrationSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      body.role = 'user';
      const rta = await service.regiterUser(body);
      res.json(rta);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
