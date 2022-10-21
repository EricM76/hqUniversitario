const GoogleStrategy = require("passport-google-oauth2").Strategy;
const db = require("../database/models");
const process = require("process");
const {
  getTotalOfActiveReferredUsers,
  setFreeMembershipToWinnerUser,
} = require("../services/referredService");

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: `${process.env.BASE_URL}/usuario/auth/google/callback`,
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        try {
          const user = await db.User.findOne({
            where: {
              social_id: profile.id,
            },
          });

          if (!user) {
            const newUser = await db.User.create({
              name: profile.name.givenName,
              surname: profile.name.familyName,
              email: profile.emails[0].value,
              passport: null,
              social_id: profile.id,
              rolId: 2,
              terms: 1,
            });
            const referred = await db.Referred.findOne({
              where: {
                email: newUser.email,
              },
            });
            if (referred) {
              const updateReferred = await db.Referred.update(
                {
                  active: true,
                },
                {
                  where: {
                    id: referred.id,
                  },
                }
              );
              /* Enviar notificacion al usuario que lo refirió */
              // obtener total de referidos activos
              // si tiene 3, enviar mail y poner activa la membresía al usuario que lo refirió
              const referringUser = await db.User.findByPk(referred.userId);
              const { data } = await getTotalOfActiveReferredUsers(
                referred.userId
              );
              const totalStatus = (data.total === 2 || data.total === 3 || data.total === 4);
              const haveActiveMembership = referringUser.membershipId !== null;
              const haveFreeMembership = referringUser.freeMembership;
              if ( totalStatus && !haveActiveMembership) {
                await setFreeMembershipToWinnerUser(referred.userId, data.total);
              } else if ( totalStatus && haveActiveMembership && haveFreeMembership) {
                await setFreeMembershipToWinnerUser(referred.userId, data.total);
              }
            }
            return done(null, newUser);
          }
          return done(null, user);
        } catch (error) {
          console.log(error);
        }
      }
    )
  );
};
