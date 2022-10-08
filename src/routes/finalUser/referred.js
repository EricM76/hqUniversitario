const express = require("express");
const router = express.Router();
const { getByUserId, getActivesByUserId, addReferred } = require("../../controllers/finalUser/referredController");
const userReferredValidator = require("../../validations/userReferredValidator");

router
    .post("/", userReferredValidator, addReferred)
    .get("/:userId", getByUserId)     
    .get("/:userId/activos", getActivesByUserId)     

module.exports = router;
