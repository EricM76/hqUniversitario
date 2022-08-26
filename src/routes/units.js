const express = require('express');
const router = express.Router();

const {add, remove, check,update} = require('../controllers/unitsController');

/* /units */
router
/* APIs */
  .post('/add',add)
  .delete('/remove/:id',remove)
  .get('/check',check)
  .put('/update/:id',update)


module.exports = router;
