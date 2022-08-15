const db = require('../database/models');

module.exports = {
    add : (req,res) => {
       
            return res.render('admin/universityAdd')
    },
    store : (req,res) => {
        return res.send(req.body)
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
            console.log(university);
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
        return res.send(req.body)
        try {
            await db.University.update(
                {
                    ...body
                },
                {
                    where : {id : req.params.id}
                }
            )
            return res.render('admin/universityDetail', {
                university
            })

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