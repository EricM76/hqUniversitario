const express = require("express");
const router = express.Router();
const { content, presentation, courseSelection } = require("../../controllers/finalUser/courseController");
const userSessionCheck = require("../../middlewares/userSessionCheck");

router
    .get("/presentacion/:id", presentation)
    .get("/contenido/:id?", content)
    .get("/seleccion", userSessionCheck, courseSelection)
    
module.exports = router;