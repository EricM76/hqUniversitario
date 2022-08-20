const {check} = require('express-validator');

module.exports = [
    check('name')
        .notEmpty().withMessage('El nombre es requerido'),
    check('review')
        .notEmpty().withMessage('Se precisa una descripción'),
    check('universityId')
        .notEmpty().withMessage('Obligatorio'),
    check('facultyId')
        .notEmpty().withMessage('Obligatorio'),
    check('careerId')
        .notEmpty().withMessage('Obligatorio'),
]