const express = require("express");
const router = express.Router();
const { feedback,result, list } = require("../../controllers/finalUser/testController");

router
    .get('/list/:id', list)
    .post("/feedback/:id", feedback)
    .post('/result/:id',result)

module.exports = router;