const express = require('express');
const router = express.Router();

const {register, processRegister, login, processLogin, profile, update } = require('../controllers/usersController');

/* /users */
router
  .get('/register', register)
  .post('/register', processRegister)
  .get('/login', login)
  .post('/login', processLogin)
  .get('/profile', profile)
  .put('/update', update)

module.exports = router;
