const express = require('express');
const router = express.Router();

const {add, store, list, detail, edit, update, remove, search, filter, getByFaculty} = require('../controllers/careersController');
const adminCheck = require('../middlewares/adminCheck');
const userSessionCheck = require('../middlewares/userSessionCheck');

/* /careers */
router
  .get('/',userSessionCheck, adminCheck, list)
  .get('/detail/:id',userSessionCheck, adminCheck,detail)
  .get('/add',userSessionCheck, adminCheck,add)
  .post('/add',userSessionCheck, adminCheck,store)
  .get('/edit/:id',userSessionCheck, adminCheck,edit)
  .put('/update/:id',userSessionCheck, adminCheck,update)
  .delete('/remove/:id',userSessionCheck, adminCheck,remove)
  .get('/search',userSessionCheck, adminCheck,search)
  .get('/filter',userSessionCheck, adminCheck,filter)
  /* apis */
  .get('/get-by-faculty',getByFaculty)


module.exports = router;
