// categories.routes.js

const express = require('express'); // Framework para manejo de rutas y middleware
const CategoriesService = require('../services/categoriesService'); // Servicio personalizado para categorías
const service = new CategoriesService(); // Instancia del servicio de categorías
const { validatorHandler } = require('../middleware/validatorHandler'); // Middleware para validación de datos
const {
  createCategorySchema,
  getCategorySchema,
  updateCategorySchema,
} = require('../schemas/categoriesSchemas'); // Esquemas de validación Joi para categorías
const { authenticateJwt, checkRoles } = require('../middleware/authHandler');
const router = express.Router(); // Creación del enrutador Express

/**
 * Ruta POST /categories:
 * Crea una nueva categoría.
 */
router.post(
  '/',
  authenticateJwt,
  checkRoles(['admin', 'user']),
  validatorHandler(createCategorySchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newCategory = await service.create(body);
      res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Ruta GET /categories:
 * Lista todas las categorías.
 */
router.get(
  '/',
  authenticateJwt,
  checkRoles(['admin', 'user']),
  async (req, res, next) => {
    try {
      const categories = await service.find();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Ruta GET /categories/:id:
 * Obtiene una categoría por su ID.
 */
router.get(
  '/:id',
  authenticateJwt,
  checkRoles(['admin', 'user']),
  validatorHandler(getCategorySchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await service.findOne(id);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Ruta patch /categories/:id:
 * Actualiza una categoría existente.
 */
router.patch(
  '/:id',
  authenticateJwt,
  checkRoles(['admin', 'user']),
  validatorHandler(getCategorySchema, 'params'),
  validatorHandler(updateCategorySchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const changes = req.body;
      const updatedCategory = await service.update(id, changes);
      res.json(updatedCategory);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Ruta DELETE /categories/:id:
 * Elimina una categoría por su ID.
 */
router.delete(
  '/:id',
  authenticateJwt,
  checkRoles(['admin', 'user']),
  validatorHandler(getCategorySchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const categoryDeletd = await service.delete(id);
      res.json(categoryDeletd);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
