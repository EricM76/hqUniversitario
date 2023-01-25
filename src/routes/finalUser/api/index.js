const express = require("express");
const router = express.Router();
const { universities, careers, referred, coursesByCarerr, userCourses, activeUserCourses, storeUserCourse, updateUserCourse, getUserInSession, addMembershipUser } = require("../../../controllers/finalUser/api/apiController");

router.get("/university", universities)
      .get("/career", careers)
      .get("/referred/:email", referred)
      .get("/courses", coursesByCarerr)
      /* USER COURSES API */
      .get("/userCourses/:userId", userCourses)
      .get("/userCourses/:userId/actives", activeUserCourses)
      .post("/userCourses/:userId", storeUserCourse)
      .put("/userCourses/:userId", updateUserCourse)
      .get("/usuario/sesion", getUserInSession)
      .post("/usuario/add-membership",addMembershipUser)
      
module.exports = router;