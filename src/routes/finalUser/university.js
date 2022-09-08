const express = require("express");
const router = express.Router();
const { index } = require("../../controllers/finalUser/universityController");

router.get("/:id/facultades", index)

module.exports = router;