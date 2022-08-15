const db = require('../database/models'); 

module.exports = {
    add : async (req,res) => {
        try {
            let universities = await db.University.findAll({
                include : {all:true}
            })
            return res.render('admin/careerAdd',{
                universities
            })

        } catch (error) {
            console.log(error)
        }
    },
    store : async (req,res) => {
        try {
            let {name,universityId, facultyId, description} = req.body;
            await db.Career.create({
                name : name.trim(),
                universityId,
                facultyId,
                description : description.trim()
            })
            return res.redirect('/careers')
        } catch (error) {
            console.log(error)
        }
    },
    list : async (req,res) => {
        try {
            let careers = await db.Career.findAll({
                include : {all:true}
            })
            return res.render('admin/careers',{
                careers
            })

        } catch (error) {
            console.log(error)
        }
    },
    detail : async (req,res) => {
        try {
            let career = await db.Career.findByPk(req.params.id, {
                include : {all:true}
            })
            return res.render('admin/careerDetail',{
                ...career.dataValues
            })
        } catch (error) {
            console.log(error)
        }
    },
    edit : async (req,res) => {
        try {

            let universities = await db.University.findAll();
            let faculties = await db.Faculty.findAll();
            let career = await db.Career.findByPk(req.params.id, {
                include : {all:true}
            })

            return res.render('admin/careerEdit',{
                ...career.dataValues,
                universities,
                faculties
            })
        } catch (error) {
            console.log(error)
        }

    },
    update : async (req,res) => {
        try {
            let {name, description, universityId, facultyId} = req.body;
            await db.Career.update(
                {
                    name : name.trim(),
                    universityId,
                    facultyId,
                    description : description.trim()
                },
                {
                    where : {id : req.params.id}
                }
            )
            return res.redirect('/careers/detail/' + req.params.id)

        } catch (error) {
            console.log(error)
        }
    },
    remove : (req,res) => {

    },
    search : (req,res) => {

    },
    filter : (req,res) => {
        
    }
}