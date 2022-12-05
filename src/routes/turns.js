const express = require('express');
const router = express.Router();

const {list, add, remove, update} = require('../controllers/turnsController');

/* /turns */
router
.put('/update/:id',update)

/* APIs */
.post('/add',add)
.delete('/remove',remove)
  .get('/',list)


module.exports = router;
