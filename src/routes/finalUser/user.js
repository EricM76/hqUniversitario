const express = require("express");
const router = express.Router();
const { login, processLogin, register, processRegister, profile} = require("../../controllers/finalUser/userController");

router
    .get("/login", login)    
    .post("/login", processLogin)    
    .get("/registro", register)    
    .post("/registro", processRegister)    
    .get("/perfil", profile)  
      
module.exports = router;