const { format } = require("date-fns");
const db = require("../../database/models");

module.exports = {
    presentation: (req, res) => {
        const courseId = req.params.id;
        db.Course.findByPk(courseId)
        .then((course) => {
            db.Course.findAll({
                where: {
                    facultyId: course.facultyId,
                }
            })
            .then((relatedCourses) => {
                res.render("finalUser/coursePresentation", {
                    course,
                    relatedCourses,
                    session:req.session,
                });
            })
        })
    },
    content: (req, res) => {
        res.render("finalUser/courseContent");
    },
    courseSelection: async (req, res) => {
        const user = await db.User.findByPk(req.session.user.id, {include: [{association: "membership"}]});
        const userMembership = user.membership;
        const userMembershipExpires = format(new Date(user.expires), "MM/dd/yyyy")

        res.render("finalUser/userCoursesSelection", {
          session: req.session,
          user,
          userMembership,
          userMembershipExpires
        });
    },
}