const db = require("../../database/models");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const axios = require("axios");
const { format } = require("date-fns");
const process = require("process");
const {
  getTotalOfActiveReferredUsers,
  setFreeMembershipToWinnerUser,
} = require("../../services/referredService");
const { Op } = require("sequelize");
const BASE_URL_PROVINCES = process.env.BASE_URL_PROVINCES;

module.exports = {
  login: (req, res) => {
    const baseUrl =`${req.protocol}://${req.headers.host}`;
    const TIME_IN_MILISECONDS = 60000;
    res.cookie('backurl',req.headers.referer.split(baseUrl)[1],{
      expires: new Date(Date.now() + TIME_IN_MILISECONDS),
      httpOnly: true,
      secure: true,
    })

    return res.render("finalUser/userLogin", {
      session: req.session,
    });
  },
  processLogin: (req, res) => {
    let errors = validationResult(req);
    if (errors.isEmpty()) {
      db.User.findOne({
        where: {
          email: req.body.email,
        },
      })
        .then((user) => {
          req.session.user = {
            id: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            rol: user.rolId,
            membershipId: user.membershipId,
          };
          if (req.body.sessionCheck) {
            const TIME_IN_MILISECONDS = 60000;
            res.cookie("hq", req.session.user, {
              expires: new Date(Date.now() + TIME_IN_MILISECONDS),
              httpOnly: true,
              secure: true,
            });
          }

          res.locals.user = req.session.user;
          return res.redirect("/");
        })
        .catch((error) => console.error(error));
    } else {
      return res.render("finalUser/userLogin", {
        errors: errors.mapped(),
        session: req.session
      });
    }
  },
  googleLogin: (req, res) => {

    let user = req.session.passport.user;

    req.session.user = {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      rol: user.rolId,
      googleId: user.social_id,
      membershipId: user.membershipId,
    };

    return res.redirect(req.cookies.backurl ? req.cookies.backurl : '/');
  },
  register: (req, res) => {
    return res.render("finalUser/userRegister", { session: req.session });
  },
  processRegister: async (req, res) => {
    let errors = validationResult(req);

    if (errors.isEmpty()) {
      try {
        const user = await db.User.create({
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 10),
          rolId: 2,
          terms: 1,
        });
        const referred = await db.Referred.findOne({
          where: {
            email: user.email,
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
          return res.redirect("/usuario/login");
        } else {
          return res.redirect("/usuario/login");
        }
      } catch (error) {
        res.send(error);
      }
    } else {
      return res.render("finalUser/userRegister", {
        errors: errors.mapped(),
        old: req.body,
        session: req.session
      });
    }
  },
  logout: (req, res) => {
    req.session.destroy();

    if (req.cookies.hq) {
      res.cookie("hq", "", { maxAge: -1 });
    }

    return res.redirect("/");
  },
  profile: (req, res) => {
    const provincesPromise = axios.get(BASE_URL_PROVINCES + "/provincias");
    const userPromise = db.User.findOne({
      where: { id: req.session.user.id },
      include: ["rol", "membership", "referreds", "courses"],
    });
    const membershipsPromise = db.Membership.findAll({
      where: {
        name: {
          [Op.notLike]: "%FREE%",
        },
      },
    });
    Promise.all([provincesPromise, userPromise, membershipsPromise])
      .then(([{ data }, user, memberships]) => {
        const activeReferredsQuantity = user.referreds.filter(
          (referred) => referred.active
        ).length;
        return res.render("finalUser/userProfile", {
          user,
          userMembershipExpiresDate: format(new Date(user.expires), "dd-MM-yyyy"),
          userBirthDay: user.birthday
            ? format(new Date(user.birthday), "dd/MM/yyyy")
            : undefined,
          userBirthDayToInput: user.birthday
            ? format(new Date(user.birthday), "yyyy-MM-dd")
            : undefined,
          provincias: data.provincias,
          session: req.session,
          memberships,
        activeReferredsQuantity,
        });
      })
      .catch((error) => console.log(error));
  },
  profileUpdate: (req, res) => {
    const userId = req.session.user.id;
    const { birthday, province, city } = req.body;
    db.User.update(
      {
        birthday: format(new Date(`${birthday}T00:00:00`), "MM/dd/yyyy"),
        province,
        city,
      },
      { where: { id: userId } }
    )
      .then((response) => {
        if (response) {
          return res.redirect("/usuario/perfil");
        }
      })
      .catch((error) => res.send(error));
  },
  subscriptionStatus: (req, res) => {
    const subscriptionPreaprovalId = req.query.preapproval_id;

    /* Llamar a la API con el id */
    /* Obtener el status de la suscripción */
    /* Modificar el status de cliente / suscripción */
    /* Devolver status a la vista */

    res.render("finalUser/subscriptionStatus", {
      session: req.session,
    });
  },
};
