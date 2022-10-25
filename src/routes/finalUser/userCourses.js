const express = require("express");
const router = express.Router();
const { getActives } = require("../../controllers/finalUser/userCoursesController");

router
    .get("/:userId/actives", getActives)

module.exports = router;