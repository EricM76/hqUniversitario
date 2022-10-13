const express = require('express');
const router = express.Router();

const {register, processRegister, login, processLogin, profile, update, list, remove, filter, search, verifyCourse } = require('../controllers/usersController');
const userSessionCheck = require('../middlewares/userSessionCheck');

/* /users */
router
  .get('/', list)
  .put('/update', update)
  .delete('/remove', remove)
  .get('/filter', filter)
  .get('/search', search)
  .get('/registro', register)
  .post('/registro', processRegister)
  .get('/login', login)
  .get('/login', processLogin)
  .get('/perfil', profile)
  /* APIs */
  .get('/verifycourse/:id', verifyCourse)

module.exports = router;
