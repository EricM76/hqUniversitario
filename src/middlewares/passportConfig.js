const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const db = require("../database/models");
const process = require("process");

module.exports = (passport) => 
{
    passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/usuario/auth/google/callback",
        passReqToCallback   : true
      },
      function(request, accessToken, refreshToken, profile, done) {
        db.User.findOrCreate({
            where: {
                social_id: profile.id
            },
            defaults:{
                name: profile.name.givenName,
                surname: profile.name.familyName,
                email: profile.emails[0].value,
                passport: null,
                social_id: profile.id,
                rol: 2,
                terms: 1,
            },
        })
        .then(user => {
            
            return done(null, user);
        })
        .catch(error => {
            console.log(error)
        })
      }));
}
