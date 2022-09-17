const express = require('express');
const router = express.Router();

const {add, store, list, detail, edit, update, remove, search, filter, addQuestion} = require('../controllers/testsController');

/* /tests */
router
  .get('/', list)
  .get('/detail/:id',detail)
  .get('/add/:idCourse',add)
  .post('/add',store)
  .get('/edit/:id',edit)
  .put('/update/:id',update)
  .delete('/remove/:id',remove)
  .get('/search',search)
  .get('/filter',filter)
  .post('/questions/add',addQuestion)


module.exports = router;
