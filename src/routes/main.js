const express = require('express');
const router = express.Router();

const {home, admin} = require('../controllers/mainController');

/* / */
router
  .get('/', home)
  .get('/admin',admin)

module.exports = router;
