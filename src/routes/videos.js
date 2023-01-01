const express = require('express');
const router = express.Router();

const {add, store,show, list, detail, edit, update, remove, search, filter, changeLocked, getVideoUrl, transfer, seenByUser, notSeenByUser,getViewedByUser, info} = require('../controllers/videosController');
const { uploadCourse } = require('../middlewares/upLoadFiles');

/* /videos */
router
  .get('/', list)
  .get('/show',show)
  .get('/detail/:id',detail)
  .get('/add/:idCourse',add)
  .post('/add',uploadCourse.single('resource'), store)
  .get('/edit/:videoId/:courseId',edit)
  .put('/update/:id',uploadCourse.single('resource'),update)
  .delete('/remove/:id',remove)
  .get('/search',search)
  .get('/filter',filter)
  /* apis */
  .get('/info',info)
  .put('/locked',changeLocked)
  .post('/geturl/:id',getVideoUrl)
  .get('/transfer',transfer)
  .post('/seenbyuser/:userId/:videoId',seenByUser)
  .delete('/notseenbyuser/:userId/:videoId',notSeenByUser)
  .get('/getviewedbyuser/:courseId',getViewedByUser)


module.exports = router;
