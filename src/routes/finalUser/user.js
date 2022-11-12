const express = require("express");
const router = express.Router();
const { login, processLogin, register, processRegister, profile, logout, googleLogin, profileUpdate, subscriptionStatus, addCourse, verifyRegistration } = require("../../controllers/finalUser/userController");
const userInSessionCheck = require("../../middlewares/userInSessionCheck");
const userSessionCheck = require("../../middlewares/userSessionCheck");
const userLoginValidator = require("../../validations/userLoginValidator");
const userRegisterValidator = require("../../validations/userRegisterValidator");
const userCoursesValidator = require("../../validations/userCoursesValidator");
const passport = require("passport");
const userVerifyValidator = require("../../validations/userVerifyValidator");
require("../../middlewares/passportConfig")(passport);
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
done(null, user);
});
router
    .get("/login", userInSessionCheck, login)    
    .post("/login", userLoginValidator ,processLogin)    
    .get("/registro", userInSessionCheck, register)    
    .post("/registro", userRegisterValidator, processRegister)    
    .get("/perfil", userSessionCheck, profile)  
    .put("/perfil", profileUpdate)  
    .get("/logout", logout)
    .get("/suscripcion/estado", userInSessionCheck, subscriptionStatus)
    .post("/materia/agregar", userCoursesValidator, addCourse)
    .get("/verify",userVerifyValidator, verifyRegistration)

/* Google auth */
router.get('/auth/google',
passport.authenticate('google', { scope:
    [ 'email', 'profile' ] }
));

router.get( '/auth/google/callback',
  passport.authenticate( 'google', {
      failureRedirect: '/usuario/login'
}), googleLogin);
      
module.exports = router;