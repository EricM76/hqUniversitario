const { Op } = require("sequelize");
const db = require("../../../database/models");
const {add} = require('date-fns')

module.exports = {
  universities: (req, res) => {
    db.University.findAll({
      include: [{ association: "faculties" }],
    })
      .then((universities) => {
        res.status(200).json(universities);
      })
      .catch((error) => res.json(error));
  },
  careers: (req, res) => {
    const careerId = req.query.career;
    db.Career.findByPk(careerId, {
      include: ["courses", "faculty", "university"],
    })
      .then((career) => {
        res.status(200).json(career);
      })
      .catch((error) => res.json(error));
  },
  coursesByCarerr: (req, res) => {
    const careerId = req.query.careerId;
    db.CourseCareer.findAll()
      .then((courses) => {
        res.status(200).json(courses);
      })
      .catch((error) => res.json(error));
  },
  referred: (req, res) => {
    let userEmail = req.params.email;
    const userPromise = db.User.findOne({ where: { email: userEmail } });
    const usersReferredPromise = db.Referred.findAll({
      where: { userId: req.session.user.id },
    });
    Promise.all([userPromise, usersReferredPromise])
      .then(([userPromise, usersReferredPromise]) => {
        let userIsRegister = userPromise !== null;
        let referredUsers = usersReferredPromise.map((item) => item.email);
        let userIsReferred = referredUsers.includes(userEmail);

        switch (true) {
          case referredUsers.length >= 8:
            return res.json({
              state: true,
              message: "Llegaste al máximo de referidos",
            });
          case userIsRegister:
            return res.json({ state: true, message: "Usuario ya registrado" });
          case userIsReferred:
            return res.json({ state: true, message: "Usuario ya referido" });
          default:
            return res.json({ state: false, message: "" });
        }
      })
      .catch((err) => console.log(err));
  },
  userCourses: async (req, res) => {
    try {
      const userId = Number(req.params.userId);

      if (!userId) throw "Usuario no válido";

      const userCourses = await db.UserCourse.findAll({
        where: {
          userId,
        },
      });

      if (userCourses.length === 0) throw "Usuario sin cursos asociados";

      return res.status(200).json({
        total: userCourses.length,
        materias: userCourses,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  activeUserCourses: async (req, res) => {
    try {
      const userId = Number(req.params.userId);

      if (!userId) throw "Usuario no válido";

      const activeUserCourses = await db.UserCourse.findAll({
        where: {
          [Op.and]: [
            { userId },
            {
              active: 1,
            },
          ],
        },
      });

      if (activeUserCourses.length === 0) throw "Usuario sin cursos activos";

      return res.status(200).json({
        total: activeUserCourses.length,
        materiasActivas: activeUserCourses,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  storeUserCourse: async (req, res) => {
    try {
      const userId = Number(req.params.userId);

      if (!userId) throw "Usuario no válido";

      const newUserCourse = await db.UserCourse.create({
        ...req.body,
        active: true,
      });

      if (!newUserCourse) throw "Hubo un error al agregar el curso";

      return res.status(201).json({ message: `Materia agregada al usuario ${userId} correctamente` });
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  updateUserCourse: async (req, res) => {
    try {
      const userId = Number(req.params.userId);

      if (!userId) throw "Usuario no válido";

      const { active, courseId } = req.body;

      const updateUserCourse = await db.UserCourse.update({ active }, { where: { [Op.and]: [{ userId }, { courseId },], }, });

      if (!updateUserCourse) throw "Hubo un error al modificar la materia";

      return res.status(201).json({ message: `Materia modificada correctamente` })

    } catch (error) {
      return res.status(400).json(error);
    }
  },
  getUserInSession: (req, res) => {
    //console.log(req.session.user)
    return res.json(req.cookies)
  },
  addMembershipUser: async (req, res) => {
    //console.log(req.body);
    const { userId, membershipId, days } = req.body;
    try {
      await db.User.update({
        membershipId,
        entry: new Date(),
        status: true,
        expires: add(new Date(), { days }),
        freeMembership: true,
      }, {
        where: { id: userId }
      })

      return res.status(201).json({
        ok : true,
        msg : "Membresía asisgnada correctamente"
      })

    } catch (error) {
      console.log(error)
      return res.status(error.status || 500).json({
        ok : false,
        msg : error.message || "Upss, error!!"
      })
    }
  }
};
