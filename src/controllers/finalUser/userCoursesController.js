const { isToday, add } = require("date-fns");
const isPast = require('date-fns/isPast')
const { Op } = require("sequelize");
const db = require("../../database/models");
const { getActivesUserCourses } = require("../../services/userCoursesService");

module.exports = {
  getActives: async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await db.User.findOne({
            where: { id: userId },
            include: ["courses"],
        });

        const activeUserCourses = user.courses.filter((course) => course.UserCourse.active);
        const expiresCoursesToConfirm = activeUserCourses.filter((course) => isPast(course.UserCourse.continueConfirmationDate) && !course.UserCourse.continueConfirm)
        const haveToConfirmContinueCourses = expiresCoursesToConfirm.length > 0;
        let response = {
            total: activeUserCourses.length,
            activeUserCourses,
            expiresCoursesToConfirm,
            haveToConfirmContinueCourses
        }
        res.status(200).json(response);

    } catch (error) {
      console.log(error)
        res.status(400).json(error)
    }
  },
  updateState: async (req, res) => {
    try {
      const activeUserCoursesInfo = await getActivesUserCourses(req.session.user.id);
      const user = await db.User.findByPk(req.session.user.id);
      const confirmedCourses = req.body.confirmedCourses ;
      if(confirmedCourses) {
       if(typeof confirmedCourses !== "string"){
        await db.UserCourse.update({
          active: 0,
          continueConfirm: false,
          continueConfirmationDate: null
        }, {
          where: {
            userId: req.session.user.id,
          }
        })
        
        confirmedCourses.forEach(confirmedCourseId => {
          // actualizar los confirmados y los no confirmados pasarlos a inactivos
         
          activeUserCoursesInfo.data.activeUserCourses.forEach(async course => {
            if(course.UserCourse.courseId == confirmedCourseId) {
              await db.UserCourse.update({
                active: true,
                continueConfirm: true,
                continueConfirmationDate: add(new Date(user.entry), { days: 60 }),
              }, {
                where: {
                  [Op.and]: [{courseId: course.UserCourse.courseId}, {userId: req.session.user.id}]
                }
              })
            }
          })
        })
       } else {
          activeUserCoursesInfo.data.activeUserCourses.forEach(async course => {
            if(course.UserCourse.courseId == confirmedCourses) {
              await db.UserCourse.update({
                active: true,
                continueConfirm: true,
                continueConfirmationDate: add(new Date(user.entry), { days: 60 }),
              }, {
                where: {
                  [Op.and]: [{courseId: course.UserCourse.courseId}, {userId: req.session.user.id}]
                }
              })
            } else {
              await db.UserCourse.update({
                active: 0,
                continueConfirm: false,
                continueConfirmationDate: null
              }, {
                where: {
                  [Op.and]: [{courseId: course.UserCourse.courseId}, {userId: req.session.user.id}]
                }
              })
            }
          })
        }
        res.redirect(`/materia/seleccion?userId=${req.session.user.id}`)
      } else {
        // poner inactivos todos
        activeUserCoursesInfo.data.activeUserCourses.forEach(async course => {
          await db.UserCourse.update({
            active: 0,
          }, {
            where: {
              [Op.and]: [{courseId: course.UserCourse.courseId}, {userId: req.session.user.id}]
            }
          })
        })
        res.redirect(`/materia/seleccion?userId=${req.session.user.id}`)
      }
      
    } catch (error) {
      console.log(error)
      res.send(error)
    }
  },
  setInactive: (req, res) => {},
};
