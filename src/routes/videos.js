const express = require('express');
const router = express.Router();

const {add, store,show, list, detail, edit, update, remove, search, filter} = require('../controllers/videosController');
const { uploadCourse } = require('../middlewares/upLoadFiles');

/* /videos */
router
  .get('/', list)
  .get('/show',show)
  .get('/detail/:id',detail)
  .get('/add',add)
  .post('/add',uploadCourse.single('resource'), store)
  .get('/edit/:id',edit)
  .put('/update/:id',update)
  .delete('/remove/:id',remove)
  .get('/search',search)
  .get('/filter',filter)


module.exports = router;
