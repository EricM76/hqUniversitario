const express = require('express');
const router = express.Router();

const {add, store, list, detail, edit, update, remove, search, filter, getSubscriptionPlan} = require('../controllers/membershipsController');

const {uploadImages} = require('../middlewares/upLoadFiles')

/* /memberships */
router
  .get('/', list)
  .get('/detail/:id',detail)
  .get('/add',add)
  .post('/add',store)
  .get('/edit/:id',edit)
  .put('/update/:id',uploadImages.single('image'), update)
  .delete('/remove/:id',remove)
  .get('/search',search)
  .get('/filter',filter)
  /* apis */
  .get('/get-plan-subscription/:id', getSubscriptionPlan)


module.exports = router;
