// se requieren la rutas que se utilizaran
const authRouter = require('./authRouter');
const videosRoutes = require('./videosRoutes');

//se requiere express para realizar el ruteo
const express = require('express');

// Se crea una funcion principal la cual realizara la gestion de las rutas
function routerApi(app){
  //Se define el router para utilizar
  const router = express.Router();
  // Servir archivos temporales
  //app.use('/uploads', express.static('uploads')); 
  // Esto nos permite gestionar diferentes versiones de apis
  app.use('/api/v1', router);
 
  // Se especifican las rutas a utilizar
  router.use('/videos',videosRoutes);
  router.use('/auth', authRouter);
  //router.use('/users', usersRouter);

}

//Se exporta el ruteo de la api
module.exports = routerApi;
