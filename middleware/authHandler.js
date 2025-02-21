// Este middleware es creado para la validacion del header api y que permita el paso de la aplicacion
const boom = require('@hapi/boom');
const { config } = require('./../config/config');
const jwt = require('jsonwebtoken');

function checkApiKey(req, res, next) {
    const apiKey = req.headers['api'];
    if (apiKey === config.apiKey) {
        next();
    } else {
        next(boom.unauthorized());
    }
}

function authenticateJwt(req, res, next) {
    const token = req.cookies.access_token;
    if (!token) {
        throw boom.unauthorized('session expired');
    }
    jwt.verify(token, config.jwtSecret, function (err, user) {
        if (err) {
            throw boom.unauthorized();
        }
        req.user = user;
        next();
    });
}

function checkRoles(roles) {
    return (req, res, next) => {
        const user = req.user;
        if (roles.includes(user.role)) {
            next();
        } else {
            next(boom.unauthorized());
        }
    }
}

module.exports = { checkApiKey, authenticateJwt, checkRoles }