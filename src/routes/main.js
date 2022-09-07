const express = require('express');
const router = express.Router();

const {home, admin, contact} = require('../controllers/mainController');
const contactFormValidator = require('../validations/contactFormValidator');

/* / */
router
  .get('/', home)
  .post('/contact', contactFormValidator, contact)
  .get('/admin',admin)

module.exports = router;
