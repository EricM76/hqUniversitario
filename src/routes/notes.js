const express = require('express');
const router = express.Router();

const {remove,downloads} = require('../controllers/notesController');
const adminCheck = require('../middlewares/adminCheck');
const userSessionCheck = require('../middlewares/userSessionCheck');

/* /notes */
router
  .delete('/remove/:id',userSessionCheck, adminCheck, remove)
  .get('/downloads/:file',downloads)

module.exports = router;
