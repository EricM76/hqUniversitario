const express = require('express');
const router = express.Router();

const {register, processRegister, login, processLogin, profile, update, list, remove, filter, search, verifyCourse, detail } = require('../controllers/usersController');
const adminCheck = require('../middlewares/adminCheck');
const userSessionCheck = require('../middlewares/userSessionCheck');

/* /users */
router
  .get('/',userSessionCheck, adminCheck, list)
  .get('/detail/:id?',userSessionCheck, adminCheck,detail)
  .put('/update',userSessionCheck, adminCheck, update)
  .delete('/remove',userSessionCheck, adminCheck, remove)
  .get('/filter',userSessionCheck, adminCheck, filter)
  .get('/search',userSessionCheck, adminCheck, search)
  .get('/registro', register)
  .post('/registro', processRegister)
  .get('/login', login)
  .get('/login', processLogin)
  .get('/perfil',userSessionCheck, profile)
  /* APIs */
  .get('/verifycourse/:id',userSessionCheck, verifyCourse)

module.exports = router;
