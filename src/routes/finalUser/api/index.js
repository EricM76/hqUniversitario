const express = require("express");
const router = express.Router();
const { universities, careers } = require("../../../controllers/finalUser/api/apiController");

router.get("/university", universities)
      .get("/career", careers)

module.exports = router;