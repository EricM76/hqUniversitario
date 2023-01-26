const express = require('express');
const router = express.Router();

const {add, store, list, detail, edit, update, remove, search, filter, getSubscriptionPlan} = require('../controllers/membershipsController');
const adminCheck = require('../middlewares/adminCheck');

const {uploadImages} = require('../middlewares/upLoadFiles');
const userSessionCheck = require('../middlewares/userSessionCheck');

/* /memberships */
router
  .get('/',userSessionCheck, adminCheck, list)
  .get('/detail/:id',userSessionCheck, adminCheck,detail)
  .get('/add',userSessionCheck, adminCheck,add)
  .post('/add',userSessionCheck, adminCheck,store)
  .get('/edit/:id',userSessionCheck, adminCheck,edit)
  .put('/update/:id',uploadImages.single('image'), userSessionCheck, adminCheck,update)
  .delete('/remove/:id',userSessionCheck, adminCheck,remove)
  .get('/search',userSessionCheck, adminCheck,search)
  .get('/filter',userSessionCheck, adminCheck,filter)
  /* apis */
  .get('/get-plan-subscription/:id', getSubscriptionPlan)


module.exports = router;
