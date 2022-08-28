const express = require('express');
const router = express.Router();

const {home, admin, university} = require('../controllers/mainController');

/* / */
router
  .get('/', home)
  .get('/admin',admin)

module.exports = router;
