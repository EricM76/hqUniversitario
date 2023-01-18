const express = require("express");
const router = express.Router();
const { content, presentation, courseSelection, search } = require("../../controllers/finalUser/courseController");
const userSessionCheck = require("../../middlewares/userSessionCheck");

router
    .get("/presentacion/:id", presentation)
    //.get("/contenido/:id?", content)
    .get("/seleccion", userSessionCheck, courseSelection)
    .get('/buscar', search)
    
module.exports = router;