const express = require("express");
const router = express.Router();
const { index } = require("../../controllers/finalUser/testController");

router
    .get("/", index)    
module.exports = router;