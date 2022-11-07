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
const { getUserMembershipData } = require("../../services/membershipService");
const { getActivesUserCourses } = require("../../services/userCoursesService");
const isActiveCourses = require("../../helpers/userCourses.helper");
const BASE_URL_PROVINCES = process.env.BASE_URL_PROVINCES;

module.exports = {
  login: (req, res) => {
    const baseUrl =`${req.protocol}://${req.headers.host}`;
    const TIME_IN_MILISECONDS = 60000;
    if(req.headers.referer){
      res.cookie('backurl',req.headers.referer.split(baseUrl)[1],{
        expires: new Date(Date.now() + TIME_IN_MILISECONDS),
        httpOnly: true,
        secure: true,
      })
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
        .then((user) => {

          let userActiveCourses = user.courses.filter(course => course.UserCourse.active)
          req.session.user = {
            id: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            rol: user.rolId,
            membershipId: user.membershipId,
            userMembershipExpiresDate: user.expires,
            userActiveCourses
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
            console.log(req.cookies.backurl)
            return res.redirect(req.session.user.rol == 1? '/admin' : req.cookies.backurl ?`${req.cookies.backurl}?userId=${req.session.user.id}` : '/?userId=' + req.session.user.id);
        })
        .catch((error) => console.error(error));
    } else {
      return res.render("finalUser/userLogin", {
        errors: errors.mapped(),
        session: req.session
      });
    }
  },
  googleLogin: async (req, res) => {

    let user = req.session.passport.user;
    const { data } = await getActivesUserCourses(user.id);
    const { expires } = data;

    
    req.session.user = {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      rol: user.rolId,
      googleId: user.social_id,
      membershipId: user.membershipId,
      userMembershipExpiresDate: expires,
      userActiveCourses: data.activeUserCourses
    };

    return res.redirect(req.cookies.backurl ? req.cookies.backurl + '?userId=' + req.session.user.id : '/?userId=' + req.session.user.id);
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
        console.log(error);
      }
    } else {
      return res.render("finalUser/userRegister", {
        errors: errors.mapped(),
        old: req.body,
        session : req.session
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
      include: ["rol", "membership", "referreds", {
        association : "courses",
        include : ['faculty', 'university']
      }],
    });
    const membershipsPromise = db.Membership.findAll({
      where: {
        name: {
          [Op.notLike]: "%FREE%",
        },
      },
    });
    const userMembershipInfoPromise = getUserMembershipData(req.session.user.id)
    
    Promise.all([provincesPromise, userPromise, membershipsPromise, userMembershipInfoPromise])
      .then(([{ data }, user, memberships, userMembershipInfo]) => {
        const activeReferredsQuantity = user.referreds.filter(
          (referred) => referred.active
        ).length;
        const userActiveCourses = user.courses.filter((course) => course.UserCourse.active)
        console.log(userMembershipInfo.data)
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
          userActiveCourses,
          userMembershipInfo: userMembershipInfo.data
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
  addCourse: async (req, res) => {
    let errors = validationResult(req);

    if(errors.isEmpty()) {
      try {
        //Obtener usuario
        const user = await db.User.findByPk(req.session.user.id);
        //Obtener membresia de usuario
        //const userMembership = await db.Membership.findByPk(user.membershipId);
        //Obtener cupo de materias
        //const membershipQuota = userMembership.quota;
        //Obtener materias activas del usuario
        const { data } = await getUserMembershipData(user.id);
        const { membershipQuota, activesUserCourses, quotasAvailable} = data;
        const { data: activeCourses } = await getActivesUserCourses(user.id);
        /* {
    "membershipId": 2,
    "expires": "2022-11-23T11:13:53.000Z",
    "status": true,
    "membershipName": "PREMIUM",
    "freeMembership": true,
    "membershipQuota": 3,
    "activesUserCourses": 2,
    "quotasAvailable": 1
} */
        //Si no tiene membresia devuelve error
        if ( !user.status ) return res.status(400).json({status: 400, message: "No tiene una membresia activa"});
        //Si no tiene cupo devuelve error
        if ( quotasAvailable === 0 ) return res.status(400).json({status: 400, message: "No tiene cupos disponibles"});

        const selectedCourses = req.body.selectedCourses;

        //Verificar si el curso ya lo tiene activo

        const { isActive, coursesFound} = isActiveCourses(activeCourses.activeUserCourses, selectedCourses);
        if (isActive) {
          const activeNameCoursesList = coursesFound.map((course) => course.name);
          const activeNameCoursesListString = activeNameCoursesList.join();
          const errorMessage = `Los siguientes cursos están activos: ${activeNameCoursesListString}`
          return res.status(400).json({status: 400, message: errorMessage});
        }
        if (selectedCourses.length === 0) return res.status(400).json({status: 400, message: "No seleccionaste cursos"});
        
        if (selectedCourses.length > 1) {
          let coursesToAdd = selectedCourses.map(course => {
            return {
              userId: user.id,
              courseId: course.id,
              active: true,
            }
          })
          try {
            const courses = await db.UserCourse.bulkCreate(coursesToAdd);
            
            return res.status(201).json({message: "Cursos agregados correctamente", data: courses});
          } catch (error) {
            return res.status(500).json(error);
          }
        }else{
          try {
            const courseToAdd = {
              userId: user.id,
              courseId: selectedCourses[0].id,
              active: true,
            }
            const course = await db.UserCourse.create(courseToAdd);

            return res.status(201).json({message: "Curso agregado correctamente", data: course});
          } catch (error) {
            return res.status(500).json(error);
          }
        }

      } catch (error) {
        console.log(error)
      }
    }else{
      res.json(errors.mapped())
    }
  } 
};
