const db = require("../database/models")

module.exports = {
    add : async (req,res) => {
        try {
            let course = await db.Course.findByPk(req.params.idCourse,{
                include : ['faculty']
            })
            return res.render('admin/testAdd', {course})
        } catch (error) {
            console.log(error)
        }
    },
    store : async (req,res) => { 
        try {
            let test = await db.Test.create({
                name :req.body.name,
                score: 100,
                courseId : req.query.course
            })
            if(test){
                return res.redirect(`/tests/edit/${test.id}?course=${req.query.course}&new=true`)
            }
            
        } catch (error) {
            console.log(error)
        }
    },
    list : (req,res) => {
        
    },
    detail : (req,res) => {

    },
    edit : async (req,res) => {
        try {
            let course = await db.Course.findByPk(req.query.course,{
                include : [
                    {
                        association : 'faculty',
                        attributes : ['acronym']
                    }
                ]
            });
            let test = await db.Test.findByPk(req.params.id,{
                include : [
                    {
                        association : 'questions',
                        include : {
                            all : true
                        }
                    }
                ]
            })

            return res.render('admin/testEdit', {
                course,
                test,
                new : req.query.new ? true : false
            })
            
        } catch (error) {
            console.log(error)
        }
    },
    update : (req,res) => {
        return res.send(req.body)
    },
    remove : (req,res) => {

    },
    search : (req,res) => {

    },
    filter : (req,res) => {
        
    },
    /* questions */
    addQuestion : async (req,res) => {
        return res.send(req.body)
    }
}