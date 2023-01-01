const db = require("../../database/models");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const axios = require("axios");
const { format, add, formatISO } = require("date-fns");
const moment = require("moment");
const process = require("process");
const {
  getTotalOfActiveReferredUsers,
  setFreeMembershipToWinnerUser,
} = require("../../services/referredService");
const { Op } = require("sequelize");
const { getUserMembershipData } = require("../../services/membershipService");
const { getActivesUserCourses } = require("../../services/userCoursesService");
const isActiveCourses = require("../../helpers/userCourses.helper");
const BASE_URL_PROVINCES = process.env.BASE_URL_PROVINCES;
const sendEmail = require("../../services/email.service");
const {
  getSubscriptionPreapproval,
  getPaymentByUserId,
  getPaymentById,
} = require("../../services/paymentService");
const { serializeUser } = require("passport");

module.exports = {
  login: (req, res) => {
    const baseUrl = `${req.protocol}://${req.headers.host}`;
    const TIME_IN_MILISECONDS = 0;
    res.cookie(
      "backurl",
      req.headers.referer ? req.headers.referer.split(baseUrl)[1] : "/",
      {
        expires: TIME_IN_MILISECONDS,
      }
    );
    if (req.query.choice) {
      res.cookie("backurl", "/usuario/perfil#membership", {
        expires: TIME_IN_MILISECONDS,
      });
    }
    if (req.query.baja) {
      res.cookie("backurl", "/usuario/perfil", {
        expires: TIME_IN_MILISECONDS,
      });
    }

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
        include: ["rol", "membership", "referreds", "courses"],
      })
        .then(async (user) => {
          let userActiveCourses = user.courses.filter(
            (course) => course.UserCourse.active
          );
          const userMembershipInfo = await getUserMembershipData(user.id);

          req.session.user = {
            id: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            rol: user.rolId,
            membershipId: user.membershipId,
            daysToExpires: userMembershipInfo.daysToExpires,
            status: user.status,
            userMembershipExpiresDate: user.expires,
            userActiveCourses,
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
          console.log(req.cookies.backurl);
          return res.redirect(
            req.session.user.rol == 1
              ? "/admin"
              : req.cookies.backurl != "undefined"
              ? `${req.cookies.backurl}?userId=${req.session.user.id}`
              : "/?userId=" + req.session.user.id
          );
        })
        .catch((error) => console.error(error));
    } else {
      return res.render("finalUser/userLogin", {
        errors: errors.mapped(),
        session: req.session,
      });
    }
  },
  googleLogin: async (req, res) => {
    let user = req.session.passport.user;
    const { data } = await getActivesUserCourses(user.id);
    const userMembershipInfo = await getUserMembershipData(user.id);

    req.session.user = {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      rol: user.rolId,
      googleId: user.social_id,
      membershipId: user.membershipId,
      daysToExpires: userMembershipInfo && userMembershipInfo.daysToExpires,
      status: user.status,
      userMembershipExpiresDate:
        userMembershipInfo.expires !== undefined
          ? userMembershipInfo.expires
          : null,
      userActiveCourses: data.activeUserCourses,
    };

    return res.redirect(
      req.cookies.backurl != "undefined"
        ? req.cookies.backurl + "?userId=" + req.session.user.id
        : "/?userId=" + req.session.user.id
    );
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
          surname: req.body.surname,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 10),
          rolId: 2,
          terms: 1,
          code: uuidv4(),
          verify: false,
        });

        /* envío email de validación de mail */

        let email = {
          subject: `Registración en HQ Universitario`,
          /*
          title: `Hola ${user.name}, confirma tu regisración en HQ Universitario.`, 
          content: `
          <img src="https://hquniversitario.com/images/logo_hq.jpeg">\n<h3>Para completar tu proceso de registración en HQ Universitario debes hacer click en el siguiente link: <a href="${req.protocol}://${req.get('host')}/usuario/verify?code=${user.code}">Validar registración</a>.</h3>\n
          <h3><strong>HQ Universitario</strong> es una comunidad donde podés tener acceso al contenido que necesitás para aprobar tus materias. Para saber más, seguinos en nuestras redes!</h3>`,  */
          templateId: 1,
          params: {
            name: user.name,
            code: user.code,
          },
          to: [
            {
              email: req.body.email,
              name: req.body.name,
            },
          ],
        };

        sendEmail(email);

        return res.redirect("/");
      } catch (error) {
        console.log(error);
      }
    } else {
      return res.render("finalUser/userRegister", {
        errors: errors.mapped(),
        old: req.body,
        session: req.session,
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
      include: [
        "rol",
        "membership",
        "referreds",
        {
          association: "courses",
          include: ["faculty", "university"],
        },
      ],
    });
    const membershipsPromise = db.Membership.findAll({
      where: {
        name: {
          [Op.notLike]: "%FREE%",
        },
      },
    });
    const userMembershipInfoPromise = getUserMembershipData(
      req.session.user.id
    );

    const activeCoursesInfoPromise = getActivesUserCourses(req.session.user.id)


    Promise.all([
      provincesPromise,
      userPromise,
      membershipsPromise,
      userMembershipInfoPromise,
      activeCoursesInfoPromise
    ])
      .then(([{ data }, user, memberships, userMembershipInfo, activeCoursesInfo]) => {
        const activeReferredsQuantity = user.referreds.filter(
          (referred) => referred.active
        ).length;
        const userActiveCourses = user.courses.filter(
          (course) => course.UserCourse.active
        );
        const userMembershipExpires = format(
          new Date(user.expires),
          "dd/MM/yyyy"
        );


        return res.render("finalUser/userProfile", {
          user,
          userMembershipExpiresDate: userMembershipExpires,
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
          userActiveCourses,
          userMembershipInfo,
          moment: moment,
          expiresCoursesToConfirm: activeCoursesInfo.data.expiresCoursesToConfirm,
          haveToConfirmContinueCourses: activeCoursesInfo.data.haveToConfirmContinueCourses,
        });
      })
      .catch((error) => console.log(error));
  },
  profileUpdate: (req, res) => {
    const userId = req.session.user.id;
    const { birthday, province, city } = req.body;
    db.User.update(
      {
        birthday: birthday ? birthday : null,
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
  subscriptionStatus: async (req, res) => {
    const {
      collection_id,
      collection_status,
      payment_id,
      status,
      external_reference,
      preference_id,
    } = req.query;
    /*   failure: "http://localhost:3000/usuario/suscripcion/failure",
        pending: "http://localhost:3000/usuario/suscripcion/pending",
        success: */
    const paymentStatus = req.params.estado;
    if (paymentStatus === "success") {
      try {
        if (status === "approved") {
          const user = await db.User.findByPk(external_reference);
          const membership = await db.Membership.findOne({
            where: {
              order: user.pendingMembershipId,
            },
          });
          const date = new Date();
          const paymentInfo = await getPaymentById(payment_id);

          // si el pago existe en la db actualizarlo
          // si no, crearlo
          const payment = await db.Payment.findOne({
            where: {
              paymentId: payment_id,
            },
          });

          if (payment) {
            db.Payment.update(
              {
                description: paymentInfo.description,
                payerId: paymentInfo.payer.id, // Ver que onda -- NULL
                payer_details: JSON.stringify(paymentInfo.payer),
                payment_method_id: paymentInfo.payment_method_id,
                status: paymentInfo.status,
                status_detail: paymentInfo.status_detail,
                transaction_amount: paymentInfo.transaction_amount,
              },
              {
                where: {
                  id: payment.id,
                },
              }
            );
          } else {
            await db.Payment.create({
              paymentId: paymentInfo.id,
              description: paymentInfo.description,
              payer_email: paymentInfo.payer.email,
              payerId: paymentInfo.payer.id,
              payer_details: JSON.stringify(paymentInfo.payer),
              payment_method_id: paymentInfo.payment_method_id,
              status: paymentInfo.status,
              status_detail: paymentInfo.status_detail,
              transaction_amount: paymentInfo.transaction_amount,
              hqUserId: paymentInfo.external_reference,
            });
          }
          const paymentApprovedDate = new Date(paymentInfo.date_approved);

          const membershipExpirationDate = formatISO(
            add(paymentApprovedDate, {
              days: membership.days,
            }),
            "dd/MM/yyyy"
          );

          //const formatToSaveExpirationDate = new Date(membershipExpirationDate);

          const updateUserSubscriptionStatus = await db.User.update(
            {
              subscriptionStatus: status,
              confirmedSubscription: true,
              status: true,
              membershipId: membership.id,
              freeMembership: false,
              entry: date.toISOString(),
              expires: membershipExpirationDate,
            },
            {
              where: {
                id: user.id,
              },
            }
          );

          const userMembershipInfo = await getUserMembershipData(
            req.session.user.id
          );

          const updatedUser = await db.User.findByPk(req.session.user.id);
          req.session.user = {
            ...req.session.user,
            membershipId: updatedUser.membershipId,
            daysToExpires: userMembershipInfo.daysToExpires,
            status: updatedUser.status,
            userMembershipExpiresDate: updatedUser.expires,
            //userActiveCourses,
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
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const updateUserSubscriptionStatus = await db.User.update(
          {
            subscriptionId: preference_id,
            subscriptionStatus: status,
            //confirmedSubscription: true,
          },
          {
            where: {
              id: external_reference,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
    return res.render("finalUser/subscriptionStatus", {
      session: req.session,
      paymentStatus,
    });
  },
  addCourse: async (req, res) => {
    let errors = validationResult(req);

    if (errors.isEmpty()) {
      try {
        const user = await db.User.findByPk(req.session.user.id);
        const userMembershipData = await getUserMembershipData(user.id);
        const { data: activeCourses } = await getActivesUserCourses(user.id);

        /********* VALIDACIONES ***********/
        if (!user.status)
          return res
            .status(400)
            .json({ status: 400, message: "No tiene una membresia activa" });
        if (userMembershipData.quotasAvailable === 0)
          return res
            .status(400)
            .json({ status: 400, message: "No tiene cupos disponibles" });

        /**** Validaciones de cursos seleccionados ****/
        const selectedCourses = req.body.selectedCourses;

        const { isActive, coursesFound } = isActiveCourses(
          activeCourses.activeUserCourses,
          selectedCourses
        );
        if (isActive) {
          const activeNameCoursesList = coursesFound.map(
            (course) => course.name
          );
          const activeNameCoursesListString = activeNameCoursesList.join();
          const errorMessage = `Los siguientes cursos están activos: ${activeNameCoursesListString}`;
          return res.status(400).json({ status: 400, message: errorMessage });
        }

        if (selectedCourses.length === 0)
          return res
            .status(400)
            .json({ status: 400, message: "No seleccionaste cursos" });

        /**** Carga de cursos al usuario ****/
        let courseConfirmationDate = add(new Date(user.entry), { days: 30 });
        if (selectedCourses.length > 1) {
          let coursesToAdd = selectedCourses.map((course) => {
            return {
              userId: user.id,
              courseId: course.id,
              active: true,
              continueConfirmationDate: courseConfirmationDate,
              continueConfirm: false,
            };
          });
          try {
            const courses = await db.UserCourse.bulkCreate(coursesToAdd);
            const { data: userActiveCourses } = await getActivesUserCourses(
              user.id
            );

            req.session.user = {
              ...req.session.user,
              userActiveCourses,
            };

            return res.status(201).json({
              message: "Cursos agregados correctamente",
              data: courses,
            });
          } catch (error) {
            return res.status(500).json(error);
          }
        } else {
          try {
            const courseToAdd = {
              userId: user.id,
              courseId: selectedCourses[0].id,
              active: true,
              continueConfirmationDate: courseConfirmationDate,
              continueConfirm: false,
            };
            const course = await db.UserCourse.create(courseToAdd);
            const { data: activeCourses } = await getActivesUserCourses(
              user.id
            );
            req.session.user = {
              ...req.session.user,
              userActiveCourses: activeCourses,
            };

            return res
              .status(201)
              .json({ message: "Curso agregado correctamente", data: course });
          } catch (error) {
            return res.status(500).json(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      res.json(errors.mapped());
    }
  },
  verifyRegistration: async (req, res) => {
    let errors = validationResult(req);

    if (errors.isEmpty()) {
      try {
        const user = await db.User.findOne({
          where: {
            code: req.query.code,
          },
        });
        (user.verify = true), await user.save();

        const referred = await db.Referred.findOne({
          where: {
            email: user.email,
          },
          include: ["users"],
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
          let email = {
            templateId: 5,
            params: {
              referred: referred.name,
              name: referred.users.name,
            },
            to: [
              {
                email: referred.users.email,
                name: referred.users.name,
              },
            ],
          };

          sendEmail(email);
          // obtener total de referidos activos
          // si tiene 3 5 o 7, enviar mail y poner activa la membresía al usuario que lo refirió
          const totalReferred1 = process.env.TOTAL_REFERRED_1;
          const totalReferred2 = process.env.TOTAL_REFERRED_2;
          const totalReferred3 = process.env.TOTAL_REFERRED_3;
          const referringUser = await db.User.findByPk(referred.userId);
          const { data } = await getTotalOfActiveReferredUsers(referred.userId);
          const totalStatus =
            data.total === totalReferred1 || data.total === totalReferred2 || data.total === totalReferred3;
          const haveActiveMembership = referringUser.membershipId !== null;
          const haveFreeMembership = referringUser.freeMembership;
          /* Cumple con los referidos y no tiene membresia activa */
          if (totalStatus && !haveActiveMembership) {
            await setFreeMembershipToWinnerUser(referred.userId, data.total);
          }
          /* Cumple con referidos, tiene membresia activa, tiene membresia gratuita */
          if (totalStatus && haveActiveMembership && haveFreeMembership) {
            await setFreeMembershipToWinnerUser(referred.userId, data.total);
          }
          return res.redirect("/usuario/login?verify=true");
        } else {
          return res.redirect("/usuario/login?verify=true");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      return res.render("finalUser/errorVerify", {
        errors: errors.mapped(),
        session: req.session,
      });
    }
  },
  cancelRegistration: async (req, res) => {
    let errors = validationResult(req);

    if (errors.isEmpty()) {
      let confirm = await db.User.destroy({
        where: {
          code: req.query.code,
        },
      });
      if (confirm) {
        return res.render("finalUser/cancelRegistration", {
          session: req.session,
        });
      }
    } else {
      return res.render("finalUser/errorVerify", {
        errors: errors.mapped(),
        session: req.session,
      });
    }
  },
};
