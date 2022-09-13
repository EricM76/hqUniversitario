const express = require("express");
const router = express.Router();
const { universities, careers, referred } = require("../../../controllers/finalUser/api/apiController");

router.get("/university", universities)
      .get("/career", careers)
      .get("/referred/:id", referred)

module.exports = router;