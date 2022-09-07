const {check} = require('express-validator');

module.exports = [
    check('name')
        .notEmpty().withMessage('El nombre es requerido').bail()
        .isAlpha().withMessage('Ingresa un nombre válido')
        .isLength({min: 3}).withMessage('Ingresa un nombre válido'),
    check('email')
        .notEmpty().withMessage('Email requerido').bail()
        .isEmail().withMessage('Email inválido'),
    check('message')
        .notEmpty().withMessage('Escribe tu consulta'),
]