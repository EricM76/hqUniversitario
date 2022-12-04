const { check, body } = require("express-validator");
const db = require("../database/models");
const axios = require('axios');

module.exports = [
  check("name").notEmpty().withMessage("Ingresa tu nombre").bail(),
  check("surname").notEmpty().withMessage("Ingresa tu apellido"),
  check("email")
    .notEmpty()
    .withMessage("Ingresa tu email")
    .bail()
    .isEmail()
    .withMessage("Ingresa un e-mail válido"),
  body("email").custom((value) => {
    return db.User.findOne({
      where: {
        email: value,
      },
    }).then((user) => {
      if (user) {
        return Promise.reject("Email ya registrado");
      }
    });
  }),
  check("password")
    .notEmpty()
    .withMessage("Ingrese una contraseña")
    .isLength({ min: 4 })
    .withMessage("La contraseña debe tener por lo menos 4 caracteres"),
  check("password2").notEmpty().withMessage("Reingrese su contraseña"),
  body("password2")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        return false;
      }
      return true;
    })
    .withMessage("Las contraseñas no coinciden"),
  check("terms")
    .isString("on")
    .withMessage("Debes aceptar los términos y condiciones"),
  body("g-recaptcha-response")
    .custom( (value, { req }) => {
      const url = 'https://www.google.com/recaptcha/api/siteverify'

      return axios.post(`${url}?secret=${process.env.SECRET_KEY_RECAPTCHA}&response=${value}`)
              .then(response => {
                console.log(response.data)
                if(!response.data.success){
                  return Promise.reject()
                }
              })
              .catch(error => {
                console.log('>>>>>>>>>>>>',error)
                return Promise.reject('Verficar que no eres un robot')
              })
    })
];
