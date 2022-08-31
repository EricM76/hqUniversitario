const express = require('express');
const router = express.Router();

const {add, remove, check,update, list} = require('../controllers/unitsController');

/* /units */
router
/* APIs */
  .post('/add',add)
  .delete('/remove/:id',remove)
  .get('/check',check)
  .put('/update/:id',update)
  .get('/',list)


module.exports = router;
