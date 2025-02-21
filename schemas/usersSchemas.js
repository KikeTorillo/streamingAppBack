// Se requiere la dependencia joi para poder crear schemas para la validacion de los tipos de dato y que sean
// correctos, acorde a la tabla a insertar
const Joi = require('joi');

const id = Joi.number().id();
const email = Joi.string().email();
const password = Joi.string().alphanum();
const role = Joi.string();
const token = Joi.string();

//Se crea el schema que se validara al momento de crear un usuario
const createUserSchema = Joi.object({
    email: email.required(),
    password: password.required(),
    role: role.required(),
});

//Se crea el schema que se validara al momento de crear un usuario
const updateUserSchema = Joi.object({
    email: email,
    password: password,
    role: role,
});

const getUserSchema = Joi.object({
    id: id.required(),
});

const loginSchema = Joi.object({
    email: email.required(),
    password: password.required(),
});

const changePasswordSchema = Joi.object({
    newPassword: password.required(),
    token: token.required(),
});

const registrationSchema = Joi.object({
    email: email.required(),
    password: password.required(),
});
//se exporta el schema para poder utilizarse
module.exports  = {createUserSchema, updateUserSchema, getUserSchema, loginSchema, changePasswordSchema, registrationSchema}