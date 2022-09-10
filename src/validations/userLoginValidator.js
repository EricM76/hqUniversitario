const { check, body } = require("express-validator");
const db = require("../database/models");
const bcrypt = require("bcryptjs");

module.exports = [
  check("email")
    .notEmpty()
    .withMessage("Ingresa tu email")
    .bail()
    .isEmail()
    .withMessage("Ingresa un e-mail válido"),
    body("custom").custom((value, { req })=>{
      return db.User.findOne({
          where: {
              email: req.body.email,
          }
      }).then((user) => {
          console.log(bcrypt.compareSync(req.body.password, user.password));
          if(!bcrypt.compareSync(req.body.password, user.password)){
              return Promise.reject();
          }
      })
      .catch((error) => {
          console.error("Login validator" + error);
          return Promise.reject("Email o contraseña incorrecto");
      })
  }),
  check("password")
    .notEmpty()
    .withMessage("Ingrese una contraseña"),
];
