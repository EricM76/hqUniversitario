const express = require("express");
const router = express.Router();
const { login, processLogin, register, processRegister, profile, logout, googleLogin } = require("../../controllers/finalUser/userController");
const userInSessionCheck = require("../../middlewares/userInSessionCheck");
const userSessionCheck = require("../../middlewares/userSessionCheck");
const userLoginValidator = require("../../validations/userLoginValidator");
const userRegisterValidator = require("../../validations/userRegisterValidator");
const passport = require("passport");
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
    .get("/logout", logout)
    
router.get('/auth/google',
passport.authenticate('google', { scope:
    [ 'email', 'profile' ] }
));

router.get( '/auth/google/callback',
  passport.authenticate( 'google', {
      failureRedirect: '/usuario/login'
}), googleLogin);
      
module.exports = router;