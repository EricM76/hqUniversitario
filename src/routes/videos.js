const express = require('express');
const router = express.Router();

const {add, store,show, list, detail, edit, update, remove, search, filter, changeLocked, getVideoUrl, transfer, seenByUser, notSeenByUser,getViewedByUser, info} = require('../controllers/videosController');
const adminCheck = require('../middlewares/adminCheck');
const { uploadCourse } = require('../middlewares/upLoadFiles');
const userSessionCheck = require('../middlewares/userSessionCheck');

/* /videos */
router
  .get('/',userSessionCheck, adminCheck, list)
  .get('/show',userSessionCheck, adminCheck,show)
  .get('/detail/:id',userSessionCheck, adminCheck,detail)
  .get('/add/:idCourse',userSessionCheck, adminCheck,add)
  .post('/add',uploadCourse.single('resource'),userSessionCheck, adminCheck, store)
  .get('/edit/:videoId/:courseId',userSessionCheck, adminCheck,edit)
  .put('/update/:id',uploadCourse.single('resource'),userSessionCheck, adminCheck,update)
  .delete('/remove/:id',userSessionCheck, adminCheck,remove)
  .get('/search',userSessionCheck, adminCheck,search)
  .get('/filter',userSessionCheck, adminCheck,filter)
  /* apis */
  .get('/info',info)
  .put('/locked',changeLocked)
  .post('/geturl/:id',getVideoUrl)
  .get('/transfer',transfer)
  .post('/seenbyuser/:userId/:videoId',seenByUser)
  .delete('/notseenbyuser/:userId/:videoId',notSeenByUser)
  .get('/getviewedbyuser/:courseId',getViewedByUser)


module.exports = router;
