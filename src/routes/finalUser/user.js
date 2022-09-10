const express = require("express");
const router = express.Router();
const { login, processLogin, register, processRegister, profile } = require("../../controllers/finalUser/userController");
const userLoginValidator = require("../../validations/userLoginValidator");
const userRegisterValidator = require("../../validations/userRegisterValidator");

router
    .get("/login", login)    
    .post("/login", userLoginValidator ,processLogin)    
    .get("/registro", register)    
    .post("/registro", userRegisterValidator, processRegister)    
    .get("/perfil", profile)  
      
module.exports = router;