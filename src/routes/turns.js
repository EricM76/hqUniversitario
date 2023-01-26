const express = require('express');
const router = express.Router();

const {list, add, remove, update, all} = require('../controllers/turnsController');
const adminCheck = require('../middlewares/adminCheck');
const userSessionCheck = require('../middlewares/userSessionCheck');

/* /turns */
router
.put('/update/:id',userSessionCheck, adminCheck,update)

/* APIs */
.post('/add',add)
.delete('/remove',remove)
  .get('/',list)
  .get('/all',all)


module.exports = router;
