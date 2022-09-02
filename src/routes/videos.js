const express = require('express');
const router = express.Router();

const {add, store,show, list, detail, edit, update, remove, search, filter, changeLocked} = require('../controllers/videosController');
const { uploadCourse } = require('../middlewares/upLoadFiles');

/* /videos */
router
  .get('/', list)
  .get('/show',show)
  .get('/detail/:id',detail)
  .get('/add',add)
  .post('/add',uploadCourse.single('resource'), store)
  .get('/edit/:id',edit)
  .put('/update/:id',uploadCourse.single('resource'),update)
  .delete('/remove/:id',remove)
  .get('/search',search)
  .get('/filter',filter)
  /* apis */
  .put('/locked',changeLocked)


module.exports = router;
