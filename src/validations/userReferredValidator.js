const { check } = require("express-validator");

module.exports = [
  check("name").notEmpty().withMessage("Ingresa tu nombre").bail(),
  check("email")
    .notEmpty()
    .withMessage("Ingresa tu email")
    .bail()
    .isEmail()
    .withMessage("Ingresa un e-mail válido"),
];
