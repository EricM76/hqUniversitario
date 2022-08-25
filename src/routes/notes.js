const express = require('express');
const router = express.Router();

const {remove} = require('../controllers/notesController');

/* /notes */
router
  .delete('/remove/:id', remove)

module.exports = router;
