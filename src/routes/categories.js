const express = require('express');
const router = express.Router();

const {add, store, list, detail, edit, update, remove, search, filter} = require('../controllers/categoriesController');

/* /categories */
router
  .get('/', list)
  .get('/detail/:id',detail)
  .get('/add',add)
  .post('/add',store)
  .get('/edit/:id',edit)
  .put('/update/:id',update)
  .delete('/remove/:id',remove)
  .get('/search',search)
  .get('/filter',filter)


module.exports = router;
