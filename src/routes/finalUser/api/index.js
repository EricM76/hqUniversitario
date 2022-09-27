const express = require("express");
const router = express.Router();
const { universities, careers, referred, coursesByCarerr } = require("../../../controllers/finalUser/api/apiController");

router.get("/university", universities)
      .get("/career", careers)
      .get("/referred/:email", referred)
      .get("/courses", coursesByCarerr)

module.exports = router;