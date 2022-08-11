const express = require('express');
const router = express.Router();

const {register, processRegister, login, processLogin, profile, update, list, remove, filter, search } = require('../controllers/usersController');

/* /users */
router
  .get('/', list)
  .get('/register', register)
  .post('/register', processRegister)
  .get('/login', login)
  .post('/login', processLogin)
  .get('/profile', profile)
  .put('/update', update)
  .delete('/remove', remove)
  .get('/filter', filter)
  .get('/search', search)

module.exports = router;
