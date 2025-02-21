// Este middleware es para validar que la informacion dentro del body tiene todas las propiedades
// que estan definidas dentro del schema que se esta recibiendo
const boom = require('@hapi/boom');

function validatorHandler(schema, property) {
   //aqui se esta creando un middleware dinamico gracias a closurescope
    return (req, res, next) => {
        const data = req[property];
        const {error} = schema.validate(data);
        if (error) {
            next(boom.badRequest(error));
        }else{
            next();
        }
    }
}

module.exports = {validatorHandler}