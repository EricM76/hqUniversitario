const express = require("express");
const router = express.Router();
const { getById, getByUserId } = require("../../controllers/finalUser/membershipController");

router
    .get("/usuario/:userId", getByUserId)     
    .get("/:membershipId", getById)     

module.exports = router;