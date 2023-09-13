const { format } = require("date-fns");
const db = require("../../database/models");
const { Op } = require('sequelize');
const { shuffle } = require('../../helpers');
const { getUserMembershipData } = require("../../services/membershipService");
const { getActivesUserCourses } = require("../../services/userCoursesService");

module.exports = {
    presentation: async (req, res) => {
      
        let suscribed = await db.UserCourse.findOne({
            where: {
                userId: req.session.user && req.session.user.id || 0,
                courseId: req.params.id,
                active: true
            },
            attributes : ['id']
        });

        if (suscribed) {

            
            let course =  db.Course.findByPk(req.params.id, {
                include: [
                    {
                        association: 'faculty',
                        include: {
                            association: 'categories',
                        }
                    },
                    {
                        association: 'university'
                    },
                    {
                        association: 'tests',
                        attributes : ['id']
                    },
                    {
                        association: 'notes',
                    },
                    {
                        association: 'units',
                    },
                    {
                        association: 'turns'
                    }
                ]
            });
            

            const videos = await db.Video.findAll({
                where : {
                    courseId: req.params.id
                },
                include : ['turn']
            });


            const theoreticalVideos = videos.filter(video => video.categoryId === 1).sort((a,b) => a.order > b.order ? 1 : a.order < b.order ? -1 : 0);
            const theoreticalCount = theoreticalVideos.length;
            let theoreticalHours;
            
            if(theoreticalCount){
                theoreticalHours = theoreticalVideos.map(video => video.length).reduce((acum,sum)=> acum + sum , 0)
            };

            const practicalVideos = videos.filter(video => video.categoryId === 2).sort((a,b) => a.order > b.order ? 1 : a.order < b.order ? -1 : 0);
            const videoPracticalWorkCount = practicalVideos.length;
            let videoPracticalWorkHours;
            
            if(videoPracticalWorkCount){
                videoPracticalWorkHours = practicalVideos.map(video => video.length).reduce((acum,sum)=> acum + sum , 0)
            };

            const integrativeVideoExams = videos.filter(video => video.categoryId === 3).sort((a,b) => a.order > b.order ? 1 : a.order < b.order ? -1 : 0);
            const integrativeVideoExamsCount = integrativeVideoExams.length;
            let integrativeVideoExamsHours;
            
            if(videoPracticalWorkCount){
                integrativeVideoExamsHours = integrativeVideoExams.map(video => video.length).reduce((acum,sum)=> acum + sum , 0)
            };

            const levelingCycleVideos = videos.filter(video => video.categoryId === 4).sort((a,b) => a.order > b.order ? 1 : a.order < b.order ? -1 : 0);
            const levelingCycleVideosCount = levelingCycleVideos.length;
            let levelingCycleVideosHours;
            
            if(videoPracticalWorkCount){
                levelingCycleVideosHours = levelingCycleVideos.map(video => video.length).reduce((acum,sum)=> acum + sum , 0)
            };

            const integrativeExerciseVideos = videos.filter(video => video.categoryId === 5).sort((a,b) => a.order > b.order ? 1 : a.order < b.order ? -1 : 0);
            const integrativeExerciseVideosCount = integrativeExerciseVideos.length;
            let integrativeExerciseVideosHours;
            
            if(videoPracticalWorkCount){
                integrativeExerciseVideosHours = integrativeExerciseVideos.map(video => video.length).reduce((acum,sum)=> acum + sum , 0)
            };

            const previusExamVideos = videos.filter(video => video.categoryId === 6).sort((a,b) => a.order > b.order ? 1 : a.order < b.order ? -1 : 0);
            const previusExamVideosCount = previusExamVideos.length;
            let previusExamVideosHours;
            
            if(previusExamVideosCount){
                previusExamVideosHours = previusExamVideos.map(video => video.length).reduce((acum,sum)=> acum + sum , 0)
            }

            let user =  db.User.findByPk(req.session.user.id, {
                attributes: ['id'],
                include: [
                    {
                        association: 'videos',
                        attributes: ['id','courseId','resource']
                    },
                    {
                        association : 'tests',
                    }
                ]
            });
            
         

            let turns = db.Turn.findAll()

            Promise.all([
                course,
                user,
                turns,
            ]).then(([
                course,
                user,
                turns,
            ]) => {

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
                            shuffle,
                            turns,
                            videosCount : videos.length
                        });
            }).catch (error =>  {
                    console.log(error)
                })
        } else {
                let course = db.Course.findByPk(req.params.id, {
                    include: [
                        {
                            association: 'features'
                        },
                        {
                            association: 'videos',
                            attributes : ['title','unitId','categoryId','length','resource','locked','description','id','turnId','year','order'],
                            include: [
                                {
                                    association : 'turn',
                                    attributes : ['month']
                                },
                              
                            ],
                         
                        },
                        {
                            association: 'notes',
                            attributes : ['title', 'file']
                        },
                        {
                            association: 'tests',
                            attributes : ['id']
                        },
                        {
                            association: 'faculty',
                            attributes : ['acronym'],
                            include: {
                                association: 'categories',
                                attributes : ['id','name'],
                            }
                        },
                        {
                            association: 'university',
                            attributes : ['acronym']
                        },
                        {
                            association: 'units',
                            attributes : ['id','name','number']
                        }
                    ]
                })
              

                let turns = db.Turn.findAll()

                Promise.all([course, turns])
                    .then(async ([course, turns]) => {
                        let theoreticalVideos = course.videos.filter(video => video.categoryId === 1).sort((a,b) => a.order > b.order ? 1 : a.order < b.order ? -1 : 0);
                        let practicalVideos = course.videos.filter(video => video.categoryId === 2).sort((a,b) => a.order > b.order ? 1 : a.order < b.order ? -1 : 0);
                        let integrativeVideoExams = course.videos.filter(video => video.categoryId === 3).sort((a,b) => a.order > b.order ? 1 : a.order < b.order ? -1 : 0);
                        let levelingCycleVideos = course.videos.filter(video => video.categoryId === 4).sort((a,b) => a.order > b.order ? 1 : a.order < b.order ? -1 : 0);
                        let integrativeExerciseVideos = course.videos.filter(video => video.categoryId === 5).sort((a,b) => a.order > b.order ? 1 : a.order < b.order ? -1 : 0);
                        let previusExamVideos = course.videos.filter(video => video.categoryId === 6).sort((a,b) => a.order > b.order ? 1 : a.order < b.order ? -1 : 0);

                        let relatedCourses = await db.Course.findAll({
                            where: {
                                facultyId: course.facultyId,
                            },
                            include: [
                                {
                                    association: 'university',
                                    attributes : ['acronym']
                                },
                                {
                                    association :'faculty',
                                    attributes : ['acronym']
                                }
                            ],
                            attributes : ['name','image','description','id','review']
                        });
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
                            urlCloudfont: process.env.CLOUDFONT_URL,
                            turns
                        });
                    }).catch(error => console.log(error))

                    
         

        }
    },
    courseSelection: async (req, res) => {

        try {
            const user = await db.User.findByPk(req.session.user.id, { include: ["membership"] });
            const userMembershipInfo = await getUserMembershipData(req.session.user.id)
            const activeCourses = await getActivesUserCourses(req.session.user.id)
            const userMembership = user.membership;
            const userMembershipExpires = format(new Date(user.expires), "dd/MM/yyyy");
            //req.session.user.userActiveCourses = activeCourses.data.activeUserCourses,

            res.render("finalUser/userCoursesSelection", {
                session: req.session,
                user,
                userMembership,
                userMembershipExpires,
                userMembershipInfo: userMembershipInfo,
                activeUserCourses: activeCourses.data.activeUserCourses,
                haveToConfirmContinueCourses: activeCourses.data.haveToConfirmContinueCourses, 
                expiresCoursesToConfirm: activeCourses.data.expiresCoursesToConfirm, 
            });
        } catch (error) {
            console.log(error);
        }
       
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