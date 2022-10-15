const { check, body } = require("express-validator");
const db = require("../database/models");

module.exports = [
  check("name").notEmpty().withMessage("Ingresa tu nombre").bail(),
  check("email")
    .notEmpty()
    .withMessage("Ingresa tu email")
    .bail()
    .isEmail()
    .withMessage("Ingresa un e-mail válido"),
  body("custom").custom(async (value, {req}) => {
    const userId = req.session.user.id;
    try {
      const users = await db.Referred.findAll({where: {userId: userId}});
      return users.length >= 4; 
    } catch (error) {
      console.log(error)
    }
  }).withMessage("Alcanzaste el máximo de referidos") 
];
