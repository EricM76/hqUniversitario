const express = require("express");
const router = express.Router();
const { getById, getByUserId, change, changeState } = require("../../controllers/finalUser/membershipController");
const userSessionCheck = require("../../middlewares/userSessionCheck");

router
    .get("/usuario/:userId", getByUserId)     
    .get("/modificar", userSessionCheck, change)     
    .get("/modificar/estado/:estado", userSessionCheck, changeState)     
    .get("/obtener/:membershipId", getById)     

module.exports = router;