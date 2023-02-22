const express = require('express');
const router = express.Router();

const {presentation,content, add, store, detail, edit, update,editVideos, remove, filter, search, list, removeFeature, removeCareer, getDataVideo, editTests } = require('../controllers/coursesController');
const adminCheck = require('../middlewares/adminCheck');

const {uploadCourse} = require('../middlewares/upLoadFiles');
const userSessionCheck = require('../middlewares/userSessionCheck');

/* /courses */
router
  .get('/',userSessionCheck, adminCheck,list)
  .get('/add',userSessionCheck, adminCheck, add)
  .post('/add',uploadCourse.fields([ {name:'image'}, {name:'video'}, {name:'note'}]),userSessionCheck, adminCheck,store)
  .get('/detail/:id',userSessionCheck, adminCheck,detail)
  .get('/edit/videos/:id', userSessionCheck, adminCheck,editVideos)
  .get('/edit/tests/:id', userSessionCheck, adminCheck,editTests)
  .get('/edit/:id',userSessionCheck, adminCheck,edit)
  .put('/update/:id',uploadCourse.fields([ {name:'image'}, {name:'video'}, {name:'note'}]),userSessionCheck, adminCheck,update)
  .delete('/remove/:id',userSessionCheck, adminCheck,remove)
  .get('/filter',userSessionCheck, adminCheck,filter)
  .get('/search',userSessionCheck, adminCheck,search)
  .get('/presentation', userSessionCheck, adminCheck,presentation)
  .get('/content', userSessionCheck, adminCheck,content)
  /* APIs */
  .delete('/features/:id', removeFeature)
  .delete('/careers/:careerId/:courseId',removeCareer)
  .get('/get-data-video', getDataVideo)

module.exports = router;
