const db = require('../database/models');

module.exports = {
    add : (req,res) => {
            return res.render('admin/universityAdd')
    },
    store : async (req,res) => {
        try {
            let {name, acronym} = req.body
            await db.University.create({
                name : name.trim(),
                acronym : acronym.trim(),
                image : req.file ? req.file.filename : "noImage.png"
            })
            return res.redirect('/universities')
        } catch (error) {
            console.log(error)
        }
    },
    list : async (req,res) => {
        try {
            const universities = await db.University.findAll();
            return res.render('admin/universities', {
                universities
            })
    
        } catch (error) {
            console.log(error)
        }
    },
    detail : async (req,res) => {
        try {
            const university = await db.University.findByPk(req.params.id);
            return res.render('admin/universityDetail', {
                ...university.dataValues
            })

        } catch (error) {
            console.log(error)
        }
    },
    edit : async (req,res) => {
        try {
            const university = await db.University.findByPk(req.params.id)
            return res.render('admin/universityEdit', {
                ...university.dataValues
            })

        } catch (error) {
            console.log(error)
        }    },
    update : async (req,res) => {
        try {
            let {name, acronym} = req.body;
            let university = await db.University.findByPk(req.params.id);

            await db.University.update(
                {
                    name : name.trim(),
                    acronym : acronym.trim(),
                    image : req.file ? req.file.filename : university.image
                },
                {
                    where : {id : req.params.id}
                }
            )
            return res.redirect('/universities/detail/' + req.params.id)

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