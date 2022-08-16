const express = require('express');
const router = express.Router();

const {add, store, list, detail, edit, update, remove, search, filter, getByFaculty} = require('../controllers/careersController');

/* /careers */
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
  /* apis */
  .get('/get-by-faculty',getByFaculty)


module.exports = router;
