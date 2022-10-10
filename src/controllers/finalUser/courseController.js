const db = require("../../database/models");

module.exports = {
    presentation: (req, res) => {
        const courseId = req.params.id;
        db.Course.findByPk(courseId,{
            include : [
                {
                    association : 'features'
                },
                {
                    association : 'videos',
                    attributes : ['id']
                },
                {
                    association : 'notes',
                    attributes : ['id']
                },
                {
                    association : 'tests',
                    attributes : ['id']
                }
            ]
        })
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
        let course = db.Course.findByPk(req.params.id, {
            include : [
                {
                    association : 'videos',
                    include : ['category']
                },
                {
                    association : 'faculty',
                    include : ['categories']
                },
                {
                    association : 'tests',
                    include : ['questions']
                },
                {
                    all : true
                }
            ]
        });
        let theoreticalHours = db.Video.sum('length',{
            where : {
                categoryId : 1,
                courseId : req.params.id
            }
        });

        let videoPracticalWork =  db.Video.count({
            where : {
                categoryId : 2,
                courseId : req.params.id
            }
        });

        let integrativeVideoExams=  db.Video.count({
            where : {
                categoryId : 3,
                courseId : req.params.id
            }
        });
        let levelingCycleVideos =  db.Video.count({
            where : {
                categoryId : 4,
                courseId : req.params.id
            }
        });

        let integrativeExerciseVideos =  db.Video.count({
            where : {
                categoryId : 5,
                courseId : req.params.id
            }
        });

        let previusExamVideos =  db.Video.count({
            where : {
                categoryId : 6,
                courseId : req.params.id
            }
        });

        Promise.all([course, theoreticalHours, videoPracticalWork, integrativeVideoExams,levelingCycleVideos,integrativeExerciseVideos,previusExamVideos])
            .then(([course, theoreticalHours, videoPracticalWork, integrativeVideoExams,levelingCycleVideos,integrativeExerciseVideos,previusExamVideos]) => {
                return res.render("finalUser/courseContent",{
                    session : req.session,
                    course,
                    theoreticalHours,
                    videoPracticalWork,
                    integrativeVideoExams,
                    levelingCycleVideos,
                    integrativeExerciseVideos,
                    previusExamVideos
                });
            })
            .catch(error => console.log(error))
       
    }
}