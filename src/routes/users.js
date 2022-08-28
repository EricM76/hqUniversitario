const express = require('express');
const router = express.Router();

const {register, processRegister, login, processLogin, profile, update, list, remove, filter, search } = require('../controllers/usersController');

/* /users */
router
  .get('/', list)
  .put('/update', update)
  .delete('/remove', remove)
  .get('/filter', filter)
  .get('/search', search)

module.exports = router;
