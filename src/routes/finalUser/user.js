const express = require("express");
const router = express.Router();
const { login, processLogin, register, processRegister, profile, logout } = require("../../controllers/finalUser/userController");
const userInSessionCheck = require("../../middlewares/userInSessionCheck");
const userSessionCheck = require("../../middlewares/userSessionCheck");
const userLoginValidator = require("../../validations/userLoginValidator");
const userRegisterValidator = require("../../validations/userRegisterValidator");

router
    .get("/login", userInSessionCheck, login)    
    .post("/login", userLoginValidator ,processLogin)    
    .get("/registro", userInSessionCheck, register)    
    .post("/registro", userRegisterValidator, processRegister)    
    .get("/perfil", userSessionCheck, profile)  
    .get("/logout", logout)  
      
module.exports = router;