const express = require("express");
const router = express.Router();
const { feedback,result } = require("../../controllers/finalUser/testController");

router
    .post("/feedback/:id", feedback)
    .post('/result/:id',result)

module.exports = router;