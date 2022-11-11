const db = require('../database/models');
const fs = require('fs');

module.exports = {
    add: async (req, res) => {
        try {
            let universities = await db.University.findAll();
            let teachers = await db.Teacher.findAll();
            return res.render('admin/courseAdd', {
                universities,
                teachers
            })

        } catch (error) {
            console.log(error)
        }
    },
    store: async (req, res) => {
        let { name, review, description, universityId, facultyId, teacherId, titles, features, careers } = req.body;
        try {
            /* guardo el curso */
            let course = await db.Course.create({
                name: name.trim(),
                image: req.files.image ? req.files.image[0].filename : null,
                video: req.files.video ? req.files.video[0].filename : null,
                description: description.trim(),
                review: review.trim(),
                teacherId,
                universityId,
                facultyId,
                visible: true
            });

            /* guardo características */
            if (features) {
                let featuresArray = [];
                let featureObj;

                const addNote = (content) => {
                    featureObj = {
                        content: content.trim(),
                        courseId: course.id
                    };
                    featuresArray.push(featureObj);
                };

                if (typeof features === "string") {
                    addNote(features);
                } else {
                    features.forEach((content) => addNote(content));
                }

                await db.Feature.bulkCreate(featuresArray, { validate: true });
            }
            /* guardo las carreras */
            if (careers) {
                let careersArray = [];
                let careerObj;

                const addNote = (career) => {
                    careerObj = {
                        courseId: course.id,
                        careerId: career
                    };
                    careersArray.push(careerObj);
                };

                if (typeof careers === "string") {
                    addNote(careers);
                } else {
                    careers.forEach((career) => addNote(career));
                }

                await db.CourseCareer.bulkCreate(careersArray, { validate: true });
            }
            return res.redirect(`/courses/edit/${course.id}?_next=notes`)


        } catch (error) {
            console.log(error)
        }
    },
    list: async (req, res) => {
        try {
            let courses = await db.Course.findAll({
                include: ['university', 'faculty', 'videos'],
                order: ['id']
            });
            return res.render('admin/courses', {
                courses
            })

        } catch (error) {
            console.log(error);
        }
    },
    detail: async (req, res) => {
        try {
          
            let course = await db.Course.findByPk(req.params.id, {
                include: [
                    {
                        association: 'university',
                        attributes: ['id', 'name', 'acronym']
                    },
                    {
                        association: 'faculty',
                        attributes: ['id', 'name', 'acronym'],
                        include:
                        {
                            association: 'categories',
                            attributes: ['id', 'name'],
                        }
                    },
                    {
                        association: 'videos',
                        attributes: ['id', 'title', 'categoryId', 'order', 'length', 'locked', 'resource'],
                        include:
                        {
                            association: 'category',
                            attributes: ['id', 'name'],
                        }
                    },
                    {
                        association: 'notes',
                    },
                    {
                        association: 'tests',
                        include: [
                            {
                                association: 'questions',
                                attributes: ['id']
                            }
                        ]
                    }
                ]
            })
            let totalVideos = await db.Video.count({
                where: {
                    courseId: req.params.id
                }
            });

            let totalNotes = await db.Note.count({
                where: {
                    courseId: req.params.id
                }
            });

            let totalTests = await db.Test.count({
                where: {
                    courseId: req.params.id
                }
            });

            let theoreticalVideos = await db.Video.count({
                where : {
                    categoryId : 1,
                    courseId : req.params.id
                }
            });

            let videoPracticalWork = await db.Video.count({
                where : {
                    categoryId : 2,
                    courseId : req.params.id
                }
            });
    
            let integrativeVideoExams= await db.Video.count({
                where : {
                    categoryId : 3,
                    courseId : req.params.id
                }
            });
            let levelingCycleVideos = await db.Video.count({
                where : {
                    categoryId : 4,
                    courseId : req.params.id
                }
            });

            let integrativeExerciseVideos = await db.Video.count({
                where : {
                    categoryId : 5,
                    courseId : req.params.id
                }
            });

            let previusExamVideos = await db.Video.count({
                where : {
                    categoryId : 6,
                    courseId : req.params.id
                }
            });
          

            return res.render('admin/courseDetail', {
                course,
                totalVideos,
                totalNotes,
                totalTests,
                theoreticalVideos,
                videoPracticalWork,
                integrativeVideoExams,
                levelingCycleVideos,
                integrativeExerciseVideos,
                previusExamVideos,
                urlCloudfont : process.env.CLOUDFONT_URL
            })
        } catch (error) {
            console.log(error)
        }

    },
    edit: async (req, res) => {

            let universities =  db.University.findAll({
                attributes : ['name','id']
            });
            let faculties =  db.Faculty.findAll();
            let teachers =  db.Teacher.findAll();
            let categories =  db.Category.findAll();
            let turns =  db.Turn.findAll();
            let countVideos =  db.Video.count({ where: { courseId: req.params.id } });

            let course =  db.Course.findByPk(req.params.id, {
                include: [
                    {
                        association: 'university',
                        attributes: ['id', 'name', 'acronym']
                    },
                    {
                        association: 'faculty',
                        attributes: ['id', 'name', 'acronym'],
                        include:
                        {
                            association: 'categories',
                            attributes: ['id', 'name'],
                            order: ['id'],
                            include: {
                                association : 'videos'
                            }
                        }
                    },
                    {
                        association: 'careers',
                        attributes: ['id', 'name']
                    },
                    {
                        association: 'features',
                        attributes: ['id', 'content']
                    },
                    {
                        association: 'notes',
                        attributes: ['id', 'title', 'file']
                    },
                    {
                        association: 'units',
                        attributes: ['id', 'number', 'name'],
                    },
                    {
                        association: 'videos',
                        attributes: ['id', 'title'],
                    },
                    {
                        association: 'tests',
                        attributes: ['id', 'name', 'time'],
                        include: [
                            {
                                association: 'questions',
                                attributes: ['content','score'],
                                include: [
                                    {
                                        association: 'answers',
                                        attributes: ['content', 'correct']
                                    }
                                ]
                            }
                        ]
                    },
                ]
            });
            Promise.all([universities,faculties, teachers, categories, turns,countVideos, course ])
                .then( ([universities,faculties, teachers, categories, turns,countVideos, course ])=> {
                    return res.render('admin/courseEdit', {
                        universities,
                        faculties,
                        teachers,
                        course,
                        categories,
                        next: req.query.next ? req.query.next : 'info',
                        turns,
                        countVideos,
                        urlCloudfont : process.env.CLOUDFONT_URL
                    })
                })
                .catch(error => console.log(error))

    },
    update: async (req, res) => {
        switch (req.query.section) {
            case 'info':
                const { name, review, description, universityId, facultyId, teacherId, careers, features, visible } = req.body;
                try {
                    let course = await db.Course.findByPk(req.params.id)
                    await db.Course.update(
                        {
                            name: name.trim(),
                            image: req.files.image ? req.files.image[0].filename : course.image,
                            video: req.files.video ? req.files.video[0].filename : course.video,
                            description: description.trim(),
                            review: review.trim(),
                            teacherId,
                            universityId,
                            facultyId,
                            visible: visible ? 1 : 0
                        },
                        {
                            where: {
                                id: req.params.id
                            }
                        }
                    );

                    req.files.image && fs.existsSync('./public/images/courses/' + course.image) ? fs.unlinkSync('./public/images/courses/' + course.image) : null;

                    req.files.video && fs.existsSync('./public/videos/' + course.video) ? fs.unlinkSync('./public/videos/' + course.video) : null


                    /* guardo características */
                    if (features) {
                        let featuresArray = [];
                        let featureObj;

                        const addNote = (content) => {
                            featureObj = {
                                content: content.trim(),
                                courseId: req.params.id
                            };
                            featuresArray.push(featureObj);
                        };

                        if (typeof features === "string") {
                            addNote(features);
                        } else {
                            features.forEach((content) => addNote(content));
                        }

                         await db.Feature.destroy({ where: { courseId: req.params.id } })
                        await db.Feature.bulkCreate(featuresArray, { validate: true });
                    }
                    /* guardo las carreras */
                    if (careers) {
                        let careersArray = [];
                        let careerObj;

                        const addNote = (career) => {
                            careerObj = {
                                courseId: req.params.id,
                                careerId: career
                            };
                            careersArray.push(careerObj);
                        };

                        if (typeof careers === "string") {
                            addNote(careers);
                        } else {
                            careers.forEach((career) => addNote(career));
                        }

                        await db.CourseCareer.destroy({
                            where: {
                                courseId: req.params.id
                            }
                        })

                        await db.CourseCareer.bulkCreate(careersArray, { validate: true });

                    };

                    return res.redirect(`/courses/edit/${req.params.id}?next=info`)

                } catch (error) {
                    console.log(error)
                    break
                }

            case 'notes':
                const { titles } = req.body;
                let notes = [];
                let noteObj;

                const addNote = (title, index) => {
                    noteObj = {
                        title: title.trim(),
                        file: req.files.note[index].filename,
                        courseId: req.params.id
                    };
                    notes.push(noteObj);
                };

                if (titles) {
                    if (typeof titles === "string") {
                        addNote(titles, 0);
                    } else {
                        titles.forEach((title, index) => addNote(title, index));
                    }

                    try {
                        await db.Note.bulkCreate(notes, { validate: true });
                        return res.redirect(`/courses/edit/${req.params.id}?next=notes`);

                    } catch (error) {
                        console.log(error)
                    }
                } else {
                    return res.redirect(`/courses/edit/${req.params.id}?next=notes`)
                }

            case 'videos':
                return res.send(req.body)
                return res.redirect(`/courses/edit/${req.params.id}?next=tests`)
                break;
            case 'tests':
                return res.send(req.body)
                break;
            default:
                break;
        }
    },
    remove: (req, res) => {

    },
    search: (req, res) => {

    },
    filter: (req, res) => {

    },
    presentation: (req, res) => {
        return res.render('coursePresentation')
    },
    content: (req, res) => {
        return res.render('courseContent')
    },
    /* APIs */
    removeFeature : async (req,res) => {
        try {

            let result = await db.Feature.destroy({
                where : {
                    id : req.params.id
                }
            })
            if(result){
                return res.status(201).json({
                    ok : true,
                    msg: 'Feature deleted success!'
                })
            }
            
            let error = new Error('Feature not deleted')
            error.status = 401

            throw error
         
            
        } catch (error) {
            console.log(error)
            return res.status(error.status || 500).json({
                ok : false,
                msg : error.message || 'Upss, error!!!'
            })
        }
    },
    removeCareer : async (req,res) => {
        try {

            let result = await db.CourseCareer.destroy({
                where : {
                    careerId : req.params.careerId,
                    courseId : req.params.courseId,
                }
            })
            if(result){
                return res.status(201).json({
                    ok : true,
                    msg: 'Career removed success!'
                })
            }
            
            let error = new Error('Career not removed')
            error.status = 401

            throw error
         
            
        } catch (error) {
            console.log(error)
            return res.status(error.status || 500).json({
                ok : false,
                msg : error.message || 'Upss, error!!!'
            })
        }
    }
}