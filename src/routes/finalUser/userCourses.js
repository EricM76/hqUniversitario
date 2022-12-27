const express = require("express");
const router = express.Router();
const { getActives, updateState } = require("../../controllers/finalUser/userCoursesController");

router
    .get("/:userId/actives", getActives)
    .put("/", updateState)

module.exports = router;