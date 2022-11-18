const express = require('express');
const router = express.Router();

const {home, admin, contact} = require('../controllers/mainController');
const adminCheck = require('../middlewares/adminCheck');
const subscriptionPreaprovalCheck = require('../middlewares/subscriptionPreapproval.middleware');
const userSessionCheck = require('../middlewares/userSessionCheck');
const contactFormValidator = require('../validations/contactFormValidator');

/* / */
router
  .get('/', subscriptionPreaprovalCheck, home)
  .post('/contact', contactFormValidator, contact)
  .get('/admin', userSessionCheck, adminCheck, admin)

module.exports = router;
