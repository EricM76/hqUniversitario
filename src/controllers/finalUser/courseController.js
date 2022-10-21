const { format } = require("date-fns");
const db = require("../../database/models");
const {Op} = require('sequelize');

module.exports = {
    presentation: (req, res) => {
        const courseId = req.params.id;
        db.Course.findByPk(courseId, {
            include: [
                {
                    association: 'features'
                },
                {
                    association: 'videos',
                    attributes: ['id']
                },
                {
                    association: 'notes',
                    attributes: ['id']
                },
                {
                    association: 'tests',
                    attributes: ['id']
                },
                {
                    association : 'university'
                },
                {
                    association : 'faculty'
                }
            ]
        })
            .then((course) => {
                console.log(course)
                db.Course.findAll({
                    where: {
                        facultyId: course.facultyId,
                    }
                })
                    .then((relatedCourses) => {
                        res.render("finalUser/coursePresentation", {
                            course,
                            relatedCourses,
                            session: req.session,
                        });
                    })
            })
            .catch(error => console.log(error))

    },
    content: async (req, res) => {

        let suscribed = await db.UserCourse.findOne({
            where: {
                userId: req.session.user?.id || 0,
                courseId: req.params.id,
                active: true
            }
        });

        if (suscribed) {
            let course = db.Course.findByPk(req.params.id, {
                include: [
                    {
                        association: 'videos',
                        include: ['category']
                    },
                    {
                        association: 'faculty',
                        include: ['categories']
                    },
                    {
                        association: 'university'
                    },
                    {
                        association: 'tests',
                        include: ['questions']
                    },
                    {
                        association: 'notes',
                    },
                ]
            });
            let theoreticalHours = db.Video.sum('length', {
                where: {
                    categoryId: 1,
                    courseId: req.params.id
                }
            });

            let theoreticalCount = db.Video.count({
                where: {
                    categoryId: 1,
                    courseId: req.params.id
                }
            });

            let videoPracticalWorkHours = db.Video.sum('length', {
                where: {
                    categoryId: 2,
                    courseId: req.params.id
                }
            });

            let videoPracticalWork = db.Video.count({
                where: {
                    categoryId: 2,
                    courseId: req.params.id
                }
            });

            let integrativeVideoExamsHours = db.Video.sum('length', {
                where: {
                    categoryId: 3,
                    courseId: req.params.id
                }
            });

            let integrativeVideoExams = db.Video.count({
                where: {
                    categoryId: 3,
                    courseId: req.params.id
                }
            });

            let levelingCycleVideosHours = db.Video.sum('length', {
                where: {
                    categoryId: 4,
                    courseId: req.params.id
                }
            });

            let levelingCycleVideos = db.Video.count({
                where: {
                    categoryId: 4,
                    courseId: req.params.id
                }
            });

            let integrativeExerciseVideosHours = db.Video.sum('length', {
                where: {
                    categoryId: 5,
                    courseId: req.params.id
                }
            });

            let integrativeExerciseVideos = db.Video.count({
                where: {
                    categoryId: 5,
                    courseId: req.params.id
                }
            });

            let previusExamVideosHours = db.Video.sum('length', {
                where: {
                    categoryId: 6,
                    courseId: req.params.id
                }
            });

            let previusExamVideos = db.Video.count({
                where: {
                    categoryId: 6,
                    courseId: req.params.id
                }
            });

            let user = db.User.findByPk(req.session.user.id,{
                attributes : ['id'],
                include : [
                    {
                        association : 'videos',
                        attributes : ['id']
                    }
                ]
            });

            Promise.all([
                course, theoreticalHours, videoPracticalWork, integrativeVideoExams, levelingCycleVideos, integrativeExerciseVideos, previusExamVideos, theoreticalCount, videoPracticalWorkHours, integrativeVideoExamsHours, levelingCycleVideosHours, integrativeExerciseVideosHours, previusExamVideosHours,user
            ])
                .then(([
                    course, theoreticalHours, videoPracticalWork, integrativeVideoExams, levelingCycleVideos, integrativeExerciseVideos, previusExamVideos, theoreticalCount, videoPracticalWorkHours, integrativeVideoExamsHours, levelingCycleVideosHours, integrativeExerciseVideosHours, previusExamVideosHours,user
                ]) => {

                    let videosViewed = user.videos.map(video => video.id);
        
                    return res.render("finalUser/courseContent", {
                        session: req.session,
                        course,
                        theoreticalHours,
                        videoPracticalWork,
                        integrativeVideoExams,
                        levelingCycleVideos,
                        integrativeExerciseVideos,
                        previusExamVideos,
                        theoreticalCount,
                        videoPracticalWorkHours, 
                        integrativeVideoExamsHours, 
                        levelingCycleVideosHours, 
                        integrativeExerciseVideosHours, 
                        previusExamVideosHours,
                        suscribed: true,
                        videosViewed
                    });
                })
                .catch(error => console.log(error))
        } else {
            try {
                let course = await db.Course.findByPk(req.params.id, {
                    include: [
                        {
                            association: 'features'
                        },
                        {
                            association: 'videos',
                            attributes: ['id', 'resource', 'title', 'locked', 'length', 'categoryId']
                        },
                        {
                            association: 'notes',
                            attributes: ['id']
                        },
                        {
                            association: 'tests',
                            attributes: ['id']
                        },
                        {
                            association: 'faculty',
                            include: ['categories']
                        },
                        {
                            association : 'university'
                        }
                    ]
                })
                let relatedCourses = await db.Course.findAll({
                    where: {
                        facultyId: course.facultyId,
                    }
                })
                return res.render("finalUser/courseContent", {
                    course,
                    relatedCourses,
                    session: req.session,
                    suscribed: false
                });
            } catch (error) {
                console.log(error)
            }

        }


    },
    courseSelection: async (req, res) => {
        const user = await db.User.findByPk(req.session.user.id, { include: [{ association: "membership" }] });
        const userMembership = user.membership;
        const userMembershipExpires = format(new Date(user.expires), "dd/MM/yyyy")

        res.render("finalUser/userCoursesSelection", {
            session: req.session,
            user,
            userMembership,
            userMembershipExpires
        });
    },
    search : async (req,res) => {
        try {

            let courses = await db.Course.findAll({
                where : {
                    name : {
                        [Op.substring] : req.query.keyword
                    } 
                },
                include : ['university','faculty']
            });

            return res.render('finalUser/result', {
                courses,
                session : req.session
            })
            
        } catch (error) {
            console.log(error)
        }
    }
}