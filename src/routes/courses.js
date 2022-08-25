const express = require('express');
const router = express.Router();

const {presentation,content, add, store, detail, edit, update,remove, filter, search, list } = require('../controllers/coursesController');

const {uploadCourse} = require('../middlewares/upLoadFiles')

/* /courses */
router
  .get('/',list)
  .get('/add', add)
  .post('/add',uploadCourse.fields([ {name:'image'}, {name:'video'}, {name:'note'}]),store)
  .get('/detail/:id',detail)
  .get('/edit/:id',edit)
  .put('/update/:id',uploadCourse.fields([ {name:'image'}, {name:'video'}, {name:'note'}]),update)
  .delete('/remove/:id',remove)
  .get('/filter',filter)
  .get('/search',search)
  .get('/presentation', presentation)
  .get('/content', content)

module.exports = router;
