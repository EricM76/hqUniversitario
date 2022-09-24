const express = require('express');
const router = express.Router();

const {add, store, list, detail, edit, update, remove, search, filter, addQuestion, deleteQuestion, changeImage, deleteAnswer, addAnwer} = require('../controllers/testsController');
const {uploadQuestions} = require('../middlewares/upLoadFiles')
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
  .post('/questions',uploadQuestions.fields([ {name:'image0'}, {name:'image1'}, {name:'image2'},{name:'image3'}]),addQuestion)
  /* apis */
  .delete('/questions/:id',deleteQuestion)
  .put('/answers/change-image/:id',uploadQuestions.single('image'),changeImage)
  .delete('/answers/:id',deleteAnswer)
  .post('/answers/:idQuestion',uploadQuestions.single('image'),addAnwer)


module.exports = router;
