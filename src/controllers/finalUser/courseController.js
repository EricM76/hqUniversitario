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
    }
}