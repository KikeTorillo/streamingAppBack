// Middleware, también conocido como lógica de intercambio de información entre aplicaciones (interlogical) o agente intermedio, 
// es un sistema de software que ofrece servicios y funciones comunes para las aplicaciones. 
// En general, el middleware se encarga de las tareas de gestión de datos, servicios de aplicaciones, mensajería, autenticación y 
// gestión de API.

// Los middleware de tipo error se caracterizan por tener los cuatro parametros, empezando por el error

// Este middleware es para poder realizar un log de los logs
function logErrors(err, req, res, next) {
    console.error(err);
    next(err);
}

//Este middleware retorna el status code del error
function boomErrorHandler(err, req, res, next) {
    console.log(err.output);
    if (err.isBoom) {
        const { output } = err;
        res.status(output.statusCode).json(output.payload);
    } else {
        next(err);
    }
}

// Este middleware gestiona todos los errores que no son de tipo boom
function errorHandler(err, req, res, next) {
    res.status(500).json({
        message: err.message,
        stack: err.stack,
    });
}

module.exports = { logErrors, errorHandler, boomErrorHandler }