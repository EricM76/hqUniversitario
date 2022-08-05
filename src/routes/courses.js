const express = require('express');
const router = express.Router();

const {presentation,content } = require('../controllers/coursesController');

/* /courses */
router
  .get('/presentation', presentation)
  .get('/content', content)

module.exports = router;
