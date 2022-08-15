const db = require('../database/models');

module.exports = {
    add : async (req,res) => {
        try {
            let universities = await db.University.findAll();
            return res.render('admin/facultyAdd',{
                universities
            })

        } catch (error) {
            console.log(error)
        }

    },
    store : async (req,res) => {
        try {
            let {name, acronym, universityId} = req.body;
            await db.Faculty.create({
                name : name.trim(),
                acronym : acronym.trim(),
                universityId,
                image : req.file ? req.file.filename : 'noImage.png'
            })
            return res.redirect('/faculties')
        } catch (error) {
            console.log(error)
        }
    },
    list : async (req,res) => {
        try {
            let faculties = await db.Faculty.findAll({
                include : {all:true}
            });
            return res.render('admin/faculties',{
                faculties
            })

        } catch (error) {
            console.log(error)
        }
    },
    detail : async (req,res) => {
        try {
            let faculty = await  db.Faculty.findByPk(req.params.id,{
                include : {all:true}
            });
            return res.render('admin/facultyDetail',{
                ...faculty.dataValues
            })

        } catch (error) {
            console.log(eror)
        }

    },
    edit : async (req,res) => {
        try {
            let faculty = await db.Faculty.findByPk(req.params.id,{
                include : {all:true}
            });
            let universities = await db.University.findAll();
            return res.render('admin/facultyEdit',{
                ...faculty.dataValues,
                universities
            })

        } catch (error) {
            console.log(error)
        }
    },
    update : async (req,res) => {
        try {
            let faculty = await db.Faculty.findByPk(req.params.id);
            let {name, acronym, universityId} = req.body;

            await db.Faculty.update(
                {
                    name : name.trim(),
                    universityId,
                    acronym : acronym.trim(),
                    image : req.file ? req.file.filename : faculty.image
                },
                {
                    where : {id : req.params.id}
                }
            )
            return res.redirect('/faculties/detail/' + req.params.id)
        } catch (error) {
            console.log(error)
        }
    },
    remove : (req,res) => {

    },
    search : (req,res) => {

    },
    filter : (req,res) => {
        
    },
    /* APIS */
    getByUniversity : async (req,res) => {
        try {
            let faculties = await db.Faculty.findAll({
                where : {
                    universityId : req.query.universityId
                }
            })
            return res.status(200).json({
                ok : true,
                data : faculties
            })
        } catch (error) {
            console.log(error);
            return res.status(error.status).json({
                ok: false,
                data : error
            })
        }
    }
}