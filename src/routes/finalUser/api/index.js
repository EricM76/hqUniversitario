const express = require("express");
const router = express.Router();
const { universities } = require("../../../controllers/finalUser/api/apiController");

router.get("/university", universities)

module.exports = router;