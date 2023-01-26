const express = require('express');
const router = express.Router();

const {add, store, list, detail, edit, update, remove, search, filter, addQuestion, deleteQuestion,changeQuestionImage, changeImage, deleteAnswer, addAnwer,countAnswers} = require('../controllers/testsController');
const adminCheck = require('../middlewares/adminCheck');
const {uploadQuestions} = require('../middlewares/upLoadFiles');
const userSessionCheck = require('../middlewares/userSessionCheck');
/* /tests */
router
  .get('/',userSessionCheck, adminCheck, list)
  .get('/detail/:id',userSessionCheck, adminCheck,detail)
  .get('/add/:idCourse',userSessionCheck, adminCheck,add)
  .post('/add',userSessionCheck, adminCheck,store)
  .put('/update/:id',userSessionCheck, adminCheck,update)
  .delete('/remove/:id',userSessionCheck, adminCheck,remove)
  .get('/search',userSessionCheck, adminCheck,search)
  .get('/filter',userSessionCheck, adminCheck,filter)
  .post('/questions',uploadQuestions.fields([{name:'image'}, {name:'image0'}, {name:'image1'}, {name:'image2'},{name:'image3'}]),userSessionCheck, adminCheck,addQuestion)
  /* apis */
  .delete('/questions/:id',deleteQuestion)
  .put('/questions/change-image/:id',uploadQuestions.single('image'),changeQuestionImage)
  .put('/answers/change-image/:id',uploadQuestions.single('image'),changeImage)
  .delete('/answers/:id',deleteAnswer)
  .post('/answers/:idQuestion',uploadQuestions.single('image'),addAnwer)
  .get('/questions/count-answers/:id',countAnswers)


module.exports = router;
