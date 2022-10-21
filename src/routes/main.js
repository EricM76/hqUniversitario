const express = require('express');
const router = express.Router();

const {home, admin, contact} = require('../controllers/mainController');
const adminCheck = require('../middlewares/adminCheck');
const userSessionCheck = require('../middlewares/userSessionCheck');
const contactFormValidator = require('../validations/contactFormValidator');

/* / */
router
  .get('/', home)
  .post('/contact', contactFormValidator, contact)
  .get('/admin', userSessionCheck, adminCheck, admin)

module.exports = router;
