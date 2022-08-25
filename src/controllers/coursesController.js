const db = require('../database/models');

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
        let { name, review, description, universityId, facultyId, teacherId, titles, features, careers} = req.body;
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
                visible: false
            });

            /* guardo características */
            if(features){
                let featuresArray = [];
                let featureObj;
    
                const addNote = (content) => {
                    featureObj = {
                        content : content.trim(),
                        courseId : course.id
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
            if(careers){
                let careersArray = [];
                let careerObj;
    
                const addNote = (career) => {
                    careerObj = {
                        courseId : course.id,
                        careerId : career
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
                include: ['university','faculty'],
                order : ['id']
            });
            return res.render('admin/courses', {
                courses
            })

        } catch (error) {
            console.log(error);
        }
    },
    detail: (req, res) => {
        return res.render('admin/courseDetail')
    },
    edit: async (req, res) => {
        try {
            let universities = await db.University.findAll();
            let faculties = await db.Faculty.findAll();
            let teachers = await db.Teacher.findAll();
            let course = await db.Course.findByPk(req.params.id, {
                include : [
                    {
                        association : 'university',
                        attributes : ['id','name']
                    },
                    {
                        association : 'faculty',
                        attributes : ['id','name']
                    },
                    {
                        association : 'careers',
                        attributes : ['id','name']
                    },
                    {
                        association : 'features',
                        attributes : ['id','content']
                    },
                    {
                        association : 'notes',
                        attributes : ['id','title','file']
                    },
                ]
            });
            return res.render('admin/courseEdit', {
                universities,
                faculties,
                teachers,
                course,
                next : req.query.next ? req.query.next : 'info'
            })
        } catch (error) {
            console.log(error)
        }
       

    },
    update: async (req, res) => {
        switch (req.query.section) {
            case 'info':
                return res.redirect(`/courses/edit/${req.params.id}?next=info`)
            case 'notes':
                const {titles} = req.body;
                let notes = [];
                let noteObj;
    
                const addNote = (title, index) => {
                    noteObj = {
                        title : title.trim(),
                        file: req.files.note[index].filename,
                        courseId : req.params.id
                    };
                    notes.push(noteObj);
                };
                
                if(titles){
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
                }else {
                    return res.redirect(`/courses/edit/${req.params.id}?next=notes`)
                }
    
            case 'videos':
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
    }
}