const { Op } = require("sequelize");
const db = require("../../database/models");

module.exports = {
  getActives: async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await db.User.findOne({
            where: { id: userId },
            include: ["courses"],
        });

        const activeUserCourses = user.courses.filter((course) => course.UserCourse.active);

        let response = {
            total: activeUserCourses.length,
            activeUserCourses
        }
        res.status(200).json(response);

    } catch (error) {
        res.status(400).json(error)
    }
  },
  setActive: (req, res) => {},
  setInactive: (req, res) => {},
};
