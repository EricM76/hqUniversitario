const {check} = require('express-validator');

module.exports = [
    check('selectedCourses')
        .notEmpty().withMessage('El o los cursos son requeridos'),
]