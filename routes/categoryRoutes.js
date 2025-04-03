// categories.routes.js

const express = require('express'); // Framework para manejo de rutas y middleware
const CategoryService = require('../services/categoryService'); // Servicio personalizado para categorías
const service = new CategoryService(); // Instancia del servicio de categorías
const { validatorHandler } = require('../middleware/validatorHandler'); // Middleware para validación de datos
const {
  createCategorySchema,
  updateCategorySchema,
  getCategorySchema,
} = require('./../schemas/categorySchemas'); // Esquemas de validación Joi para categorías
const { authenticateJwt, checkRoles } = require('./../middleware/authHandler');
const router = express.Router(); // Creación del enrutador Express

/**
 * Ruta GET /categories:
 * Lista todas las categorías.
 */
router.get('/', 
  authenticateJwt,
  checkRoles(['admin', 'user']),
  async (req, res, next) => {
  try {
    const categories = await service.getCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

/**
 * Ruta GET /categories/:id:
 * Obtiene una categoría por su ID.
 */
router.get('/:id',
  authenticateJwt,
  checkRoles(['admin', 'user']),
  validatorHandler(getCategorySchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await service.getCategoryById(id);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Ruta POST /categories:
 * Crea una nueva categoría.
 */
router.post('/',
  authenticateJwt,
  checkRoles(['admin', 'user']),
  validatorHandler(createCategorySchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newCategory = await service.createCategory(body);
      res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Ruta patch /categories/:id:
 * Actualiza una categoría existente.
 */
router.patch('/:id',
  authenticateJwt,
  checkRoles(['admin', 'user']),
  validatorHandler(getCategorySchema, 'params'),
  validatorHandler(updateCategorySchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const changes = req.body;
      const updatedCategory = await service.updateCategory(id, changes);
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
router.delete('/:id',
  authenticateJwt,
  checkRoles(['admin', 'user']),
  validatorHandler(getCategorySchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.deleteCategory(id);
      res.json(id);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;