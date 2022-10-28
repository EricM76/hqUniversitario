const { format } = require("date-fns");
const db = require("../../database/models");
const { Op } = require('sequelize');
const { shuffle } = require('../../helpers');
const { getUserMembershipData } = require("../../services/membershipService");
const { getActivesUserCourses } = require("../../services/userCoursesService");

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
                    association: 'university'
                },
                {
                    association: 'faculty'
                }
            ]
        })
            .then((course) => {
                console.log(course)
                db.Course.findAll({
                    where: {
                        facultyId: course.facultyId,
                    },
                    include: ['university', 'faculty']
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
                userId: req.session.user && req.session.user.id || 0,
                courseId: req.params.id,
                active: true
            }
        });

        if (suscribed) {

            try {
                
            let course = await db.Course.findByPk(req.params.id, {
                include: [
                    {
                        association: 'videos',
                        include: ['category'],
                        order: [['order']]
                    },
                    {
                        association: 'faculty',
                        include: {
                            association: 'categories',
                            include: {
                                association: 'videos',
                                attributes: ['courseId']
                            }
                        }
                    },
                    {
                        association: 'university'
                    },
                    {
                        association: 'tests',
                        include: [
                            {
                                association: 'questions',
                                include: ['answers']
                            }
                        ]
                    },
                    {
                        association: 'notes',
                    },
                    {
                        association: 'units',
                    },
                ]
            });
            const theoreticalHours = await db.Video.sum('length', {
                where: {
                    categoryId: 1,
                    courseId: req.params.id
                }
            });

            const { count : theoreticalCount, rows : theoreticalVideos } = await db.Video.findAndCountAll({
                where: {
                    categoryId: 1,
                    courseId: req.params.id
                }
            });

            const videoPracticalWorkHours = await db.Video.sum('length', {
                where: {
                    categoryId: 2,
                    courseId: req.params.id
                }
            });

            const { count: videoPracticalWorkCount, rows: practicalVideos } = await db.Video.findAndCountAll({
                where: {
                    categoryId: 2,
                    courseId: req.params.id
                }
            });

            const integrativeVideoExamsHours = await db.Video.sum('length', {
                where: {
                    categoryId: 3,
                    courseId: req.params.id
                }
            });

            const { count: integrativeVideoExamsCount, rows: integrativeVideoExams } = await db.Video.findAndCountAll({
                where: {
                    categoryId: 3,
                    courseId: req.params.id
                },
                include : ['turn']
            });

            const levelingCycleVideosHours = await db.Video.sum('length', {
                where: {
                    categoryId: 4,
                    courseId: req.params.id
                }
            });

            const { count: levelingCycleVideosCount, rows: levelingCycleVideos } = await db.Video.findAndCountAll({
                where: {
                    categoryId: 4,
                    courseId: req.params.id
                }
            });

            const integrativeExerciseVideosHours = await db.Video.sum('length', {
                where: {
                    categoryId: 5,
                    courseId: req.params.id
                }
            });

            const { count: integrativeExerciseVideosCount, rows: integrativeExerciseVideos } = await db.Video.findAndCountAll({
                where: {
                    categoryId: 5,
                    courseId: req.params.id
                }
            });

            const previusExamVideosHours = await db.Video.sum('length', {
                where: {
                    categoryId: 6,
                    courseId: req.params.id
                }
            });

            const { count: previusExamVideosCount, rows: previusExamVideos } = await db.Video.findAndCountAll({
                where: {
                    categoryId: 6,
                    courseId: req.params.id
                }
            });

            let user = await db.User.findByPk(req.session.user.id, {
                attributes: ['id'],
                include: [
                    {
                        association: 'videos',
                        attributes: ['id','courseId']
                    }
                ]
            });

            let videosViewedFilter = user.videos.filter(video => video.courseId == req.params.id);

            let videosViewed = videosViewedFilter.map(video => video.id)



                    return res.render("finalUser/courseContent", {
                        session: req.session,
                        course,
                        theoreticalVideos,
                        theoreticalCount,
                        theoreticalHours,
                        practicalVideos,
                        videoPracticalWorkCount,
                        videoPracticalWorkHours,
                        integrativeVideoExams,
                        integrativeVideoExamsCount,
                        integrativeVideoExamsHours,
                        levelingCycleVideos,
                        levelingCycleVideosCount,
                        levelingCycleVideosHours,
                        integrativeExerciseVideos,
                        integrativeExerciseVideosHours,
                        integrativeExerciseVideosCount,
                        previusExamVideos,
                        previusExamVideosCount,
                        previusExamVideosHours,
                        user,
                        suscribed: true,
                        videosViewed,
                        urlCloudfont: process.env.CLOUDFONT_URL,
                        shuffle
                    });
                } catch (error) {
                    console.log(error)
                }
        } else {
            try {
                let course = await db.Course.findByPk(req.params.id, {
                    include: [
                        {
                            association: 'features'
                        },
                        {
                            association: 'videos',
                            include: ['unit', 'turn']
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
                            include: {
                                association: 'categories',
                                include: {
                                    association: 'videos',
                                    attributes: ['courseId']
                                }
                            }
                        },
                        {
                            association: 'university'
                        },
                        {
                            association: 'units'
                        }
                    ]
                })
                let relatedCourses = await db.Course.findAll({
                    where: {
                        facultyId: course.facultyId,
                    },
                    include: ['university', 'faculty']
                })

                let theoreticalVideos = course.videos.filter(video => video.categoryId === 1);
                let practicalVideos = course.videos.filter(video => video.categoryId === 2);
                let integrativeVideoExams = course.videos.filter(video => video.categoryId === 3);
                let levelingCycleVideos = course.videos.filter(video => video.categoryId === 4);
                let integrativeExerciseVideos = course.videos.filter(video => video.categoryId === 5);
                let previusExamVideos = course.videos.filter(video => video.categoryId === 6);

                return res.render("finalUser/courseContent", {
                    course,
                    relatedCourses,
                    theoreticalVideos,
                    practicalVideos,
                    integrativeVideoExams,
                    levelingCycleVideos,
                    integrativeExerciseVideos,
                    previusExamVideos,
                    session: req.session,
                    suscribed: false,
                    urlCloudfont: process.env.CLOUDFONT_URL
                });
            } catch (error) {
                console.log(error)
            }

        }
    },
    courseSelection: async (req, res) => {
        const user = await db.User.findByPk(req.session.user.id, { include: ["membership"] });
        const userMembershipInfo = await getUserMembershipData(req.session.user.id)
        const activeCourses = await getActivesUserCourses(req.session.user.id)
        const userMembership = user.membership;
        const userMembershipExpires = format(new Date(user.expires), "dd/MM/yyyy");

        res.render("finalUser/userCoursesSelection", {
            session: req.session,
            user,
            userMembership,
            userMembershipExpires,
            userMembershipInfo: userMembershipInfo.data,
            activeUserCourses: activeCourses.data.activeUserCourses
        });
    },
    search: async (req, res) => {
        try {

            let courses = await db.Course.findAll({
                where: {
                    name: {
                        [Op.substring]: req.query.keyword
                    }
                },
                include: ['university', 'faculty']
            });

            return res.render('finalUser/result', {
                courses,
                session: req.session,
                keyword: req.query.keyword
            })

        } catch (error) {
            console.log(error)
        }
    }
}