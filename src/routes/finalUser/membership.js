const express = require("express");
const router = express.Router();
const { getById, getByUserId, change } = require("../../controllers/finalUser/membershipController");

router
    .get("/usuario/:userId", getByUserId)     
    .get("/modificar", change)     
    .get("/obtener/:membershipId", getById)     

module.exports = router;