
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const UserService = require('./usersService');
const service = new UserService;
const jwt = require('jsonwebtoken');
const { config } = require('./../config/config');
const nodemailer = require('nodemailer');

class AuthService {

    // funcion para crear el token y retornarlo
    signToken(user) {
        const payload = {
            sub: user.id,
            role: user.role
        }
        const token = jwt.sign(
            payload, 
            config.jwtSecret//,
            //{expiresIn: '1h'}
        );
        return {payload,token};
    }

    async getUser(email, password) {
        const user = await service.findByEmail(email);
        if (!user) {
            throw boom.unauthorized();
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw boom.unauthorized();
        }
        delete user.password;
        return user;
    }

    async sendRecoveryLink(email) {
        const user = await service.findByEmail(email);
        if (!user) {
            done(boom.unauthorized(), false);
        }
        const payload = { sub: user.id };
        const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' });
        const link = `${config.urlFront}/resetpass?token=${token}`
        service.update(user.id, { recovery_token: token });
        const mail = {
            from: config.email, // sender address
            to: `${user.email}`, // list of receivers
            subject: "Email para recuperar contrasena", // Subject line
            html: `<b>Ingresa a este link =></b> <a href="${link}">Recuperar pass</a>`, // html body
        };
        const rta = await this.sendEmail(mail);
        return rta;
    }

    async changePassword(token, newPassword) {
        const payload = jwt.verify(token, config.jwtSecret);
        const user = await service.findOne(payload.sub);
        if (user.recovery_token !== token) {
            throw boom.unauthorized();
        }
        const hash = await bcrypt.hash(newPassword, 10);
        await service.update(user.id, { recovery_token: null, password: hash });
        return { message: 'password changed' }
    }

    async sendEmail(infoMail) {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for port 465, false for other ports
            auth: {
                user: config.email,
                pass: config.passEmail,
            },
        });

        await transporter.sendMail(infoMail);

        return { message: 'mail sent' };
    }

    async regiterUser(body) {
        const user = await service.create(body);
        return { message: 'user created' }
    }


}

module.exports = AuthService;