/**
 * @file routerApi.js
 * @description Configura las rutas de la API bajo el prefijo `/api/v1`, agrupando
 *              los distintos routers por recurso (auth, movies, series, category, users).
 */

const express = require('express');
const authRouter = require('./authRouter');      // Rutas relacionadas con autenticación
const moviesRoutes = require('./moviesRoutes');  // Rutas para gestión de películas
const seriesRoutes = require('./seriesRoutes');  // Rutas para gestión de series
const episodesRoutes = require('./episodesRouter');
const categoriesRoutes = require('./categoriesRoutes'); // Rutas para gestión de categorías
const usersRoutes = require('./usersRoutes');    // Rutas para gestión de usuarios

/**
 * Monta todos los routers de la API en la aplicación Express.
 *
 * @param {import('express').Application} app - Instancia de la aplicación Express.
 */
function routerApi(app) {
  // Crea un router independiente para agrupar las rutas de la versión
  const router = express.Router();

  /**
   * Prefijo de versión para todas las rutas definidas en este router.
   * Usar versiones permite gestionar cambios y compatibilidad en el tiempo.
   */
  app.use('/api/v1', router);

  /**
   * Rutas de autenticación (login, registro, recuperación de contraseña, etc.).
   * @route   /api/v1/auth
   */
  router.use('/auth', authRouter);

  /**
   * Rutas para operaciones CRUD sobre películas.
   * @route   /api/v1/movies
   */
  router.use('/movies', moviesRoutes);

  /**
   * Rutas para operaciones CRUD sobre películas.
   * @route   /api/v1/apisodes
   */
  router.use('/episodes', episodesRoutes);

  /**
   * Rutas para operaciones CRUD sobre series.
   * @route   /api/v1/series
   */
  router.use('/series', seriesRoutes);

  /**
   * Rutas para operaciones CRUD sobre categorías.
   * @route   /api/v1/category
   */
  router.use('/category', categoriesRoutes);

  /**
   * Rutas para operaciones CRUD sobre usuarios.
   * @route   /api/v1/users
   */
  router.use('/users', usersRoutes);
}

module.exports = routerApi;
