const db = require('../database/models')

module.exports = {
    update :  (req,res) => {
        const {ids,numbers,names} = req.body;
        ids.forEach(async (id, i) => {
            await db.Unit.update(
                {
                    number : numbers[i],
                    name : names[i]
                },
                {
                    where :{
                        id
                    }
                }
            )
        });
        return res.redirect('/courses/edit/' + req.params.id)
    },
    /* APIs */
    add : async (req,res) => {
        try {
            const {number,name, courseId} = req.body;
            await db.Unit.create({
                number,
                name : name.trim(),
                courseId
            });
            return res.status(201).json({
                ok : true,
                code : res.statusCode,
                msg : 'Unidad agregada corretamente'
            })
            
        } catch (error) {
            console.log(error)
            return res.status(res.statusCode || 500).json({
                ok : false,
                code : res.statusCode,
                msg : 'Comuníquese con el administrador del sitio'
            })
        }
    },
    remove : async (req,res) => {
        try {
            const {id} = req.params;
            await db.Unit.destroy({
               where : {
                id
               }
            });
            return res.status(201).json({
                ok : true,
                code : res.statusCode,
                msg : 'Unidad eliminada corretamente'
            })
            
        } catch (error) {
            console.log(error)
            return res.status(res.statusCode || 500).json({
                ok : false,
                code : res.statusCode,
                msg : 'Comuníquese con el administrador del sitio'
            })
        }
    },
    check : async (req,res) => {
        try {
            const {number, courseId} = req.query;
            let unit = await db.Unit.findOne({
               where : {
                number,
                courseId
               }
            });
            let find = unit ? true : false;
            return res.status(201).json({
                ok : true,
                code : res.statusCode,
                find
            })
            
        } catch (error) {
            console.log(error)
            return res.status(res.statusCode || 500).json({
                ok : false,
                code : res.statusCode,
                msg : 'Comuníquese con el administrador del sitio'
            })
        }
    },
    list : async (req,res) => {
        try {
            const {course} = req.query;
            let units = await db.Unit.findAll({
                where : {
                    courseId : course
                },
                order : ['number']
            });
            return res.status(201).json({
                ok : true,
                code : res.statusCode,
                units
            })
        } catch (error) {
            console.log(error);
            return res.status(res.statusCode || 500).json({
                ok : false,
                code : res.statusCode,
                msg : 'Comuníquese con el administrador del sitio'
            })
        }
    }
}