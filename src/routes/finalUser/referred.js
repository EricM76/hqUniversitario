const express = require("express");
const router = express.Router();
const { getByUserId, getActivesByUserId, addReferred, setActiveFreeMembership ,deleteReferred} = require("../../controllers/finalUser/referredController");
const referredVerifyValidator = require("../../validations/referredVerifyValidator");
const userReferredValidator = require("../../validations/userReferredValidator");

/* /referidos */
router
    .post("/", userReferredValidator, addReferred)
    .get('/remover',referredVerifyValidator, deleteReferred)     
    .get("/:userId", getByUserId)     
    .get("/:userId/activos", getActivesByUserId)     
    .put("/:userId/membresia-gratis", setActiveFreeMembership)

module.exports = router;
