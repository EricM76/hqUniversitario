const express = require('express');
const router = express.Router();

const {remove,downloads} = require('../controllers/notesController');

/* /notes */
router
  .delete('/remove/:id', remove)
  .get('/downloads/:file',downloads)

module.exports = router;
