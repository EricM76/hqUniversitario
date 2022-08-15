const express = require('express');
const router = express.Router();

const {add, store, list, detail, edit, update, remove, search, filter} = require('../controllers/universitiesController');

const {uploadLogos} = require('../middlewares/upLoadFiles')

/* /universities */
router
  .get('/', list)
  .get('/detail/:id',detail)
  .get('/add',add)
  .post('/add',uploadLogos.single('image'),store)
  .get('/edit/:id',edit)
  .put('/update/:id', uploadLogos.single('image'),update)
  .delete('/remove/:id',remove)
  .get('/search',search)
  .get('/filter',filter)


module.exports = router;
