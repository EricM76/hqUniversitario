const express = require('express');
const router = express.Router();

const {add, store, list, detail, edit, update, remove, search, filter, getByUniversity} = require('../controllers/facultiesController');
const adminCheck = require('../middlewares/adminCheck');

const {uploadLogos} = require('../middlewares/upLoadFiles');
const userSessionCheck = require('../middlewares/userSessionCheck');

/* /faculties */
router
  .get('/',userSessionCheck, adminCheck, list)
  .get('/detail/:id',userSessionCheck, adminCheck,detail)
  .get('/add',userSessionCheck, adminCheck,add)
  .post('/add',uploadLogos.single('image'),userSessionCheck, adminCheck, store)
  .get('/edit/:id',userSessionCheck, adminCheck,edit)
  .put('/update/:id',uploadLogos.single('image'),userSessionCheck, adminCheck,update)
  .delete('/remove/:id',userSessionCheck, adminCheck,remove)
  .get('/search',userSessionCheck, adminCheck,search)
  .get('/filter',userSessionCheck, adminCheck,filter)

  /* APIS */
  .get('/get-by-university',getByUniversity)


module.exports = router;
