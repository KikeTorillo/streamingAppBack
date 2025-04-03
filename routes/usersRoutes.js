// users.routes.js

const express = require('express'); // Framework para manejo de rutas y middleware
const UsersService = require('../services/usersService'); // Servicio personalizado para usuarios
const service = new UsersService(); // Instancia del servicio de usuarios
const { validatorHandler } = require('../middleware/validatorHandler'); // Middleware para validación de datos
// Importación de los esquemas de validación para usuarios
const {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
} = require('./../schemas/usersSchemas');
const { authenticateJwt, checkRoles } = require('./../middleware/authHandler');
const router = express.Router(); // Creación del enrutador Express

/**
 * Ruta GET /users:
 * Lista todos los usuarios.
 */
router.get('/', 
  authenticateJwt,
  checkRoles(['admin']),
  async (req, res, next) => {
  try {
    const users = await service.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

/**
 * Ruta GET /users/:id:
 * Obtiene un usuario por su ID.
 */
router.get('/:id',
  authenticateJwt,
  checkRoles(['admin']),
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await service.findOne(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Ruta POST /users:
 * Crea un nuevo usuario.
 */
router.post('/',
  authenticateJwt,
  checkRoles(['admin']),
  validatorHandler(createUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newUser = await service.create(body);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Ruta PATCH /users/:id:
 * Actualiza un usuario existente.
 */
router.patch('/:id',
  authenticateJwt,
  checkRoles(['admin']),
  validatorHandler(getUserSchema, 'params'),
  validatorHandler(updateUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const changes = req.body;
      const updatedUser = await service.update(id, changes);
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Ruta DELETE /users/:id:
 * Elimina un usuario por su ID.
 */
router.delete('/:id',
  authenticateJwt,
  checkRoles(['admin']),
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.json({ id });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;