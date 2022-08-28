const express = require("express");
const router = express.Router();
const { content, presentation } = require("../../controllers/finalUser/courseController");

router
    .get("/presentacion/:id?", presentation)
    .get("/contenido/:id?", content)
    
module.exports = router;