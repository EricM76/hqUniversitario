const express = require('express');
const router = express.Router();

const {list, add, remove, update, all} = require('../controllers/turnsController');

/* /turns */
router
.put('/update/:id',update)

/* APIs */
.post('/add',add)
.delete('/remove',remove)
  .get('/',list)
  .get('/all',all)


module.exports = router;
