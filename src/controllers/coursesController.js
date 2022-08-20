const db = require('../database/models');

module.exports = {
    add : async (req,res) => {
        try {
            let universities = await db.University.findAll();
            let teachers = await db.Teacher.findAll();
            return res.render('admin/courseAdd',{
                universities,
                teachers
            })

        } catch (error) {
            console.log(error)
        }
    },
    store : (req,res) => {
        
        return res.send(req.body)
    },
    list : (req,res) => {
        return res.render('admin/courses')

    },
    detail : (req,res) => {
        return res.render('admin/courseDetail')
    },
    edit : (req,res) => {
        return res.render('admin/courseEdit')
    },
    update : (req,res) => {

    },
    remove : (req,res) => {

    },
    search : (req,res) => {

    },
    filter : (req,res) => {
        
    },
    presentation : (req,res) => {
        return res.render('coursePresentation')
    },
    content : (req,res) => {
        return res.render('courseContent')
    }
}