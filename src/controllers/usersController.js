const moment = require('moment');
const db = require('../database/models');
module.exports = {
    list : async (req,res) => {
        try {
            let users = await db.User.findAll({
                include : [
                    {
                        association : 'membership',
                        attributes : ['name','image']
                    },
                    {
                        association : 'referreds'
                    }
                ]
            })
            return res.render('admin/users',{
                users,
                moment
            })
        } catch (error) {
            console.log(error)
        }
    },
    register : (req,res) => {
        return res.render('finalUser/userRegister')
    },
    processRegister : (req,res) => {
        return res.send(req.body)
    },
    login : (req,res) => {
        return res.render('finalUser/userLogin')
    },
    processLogin : (req,res) => {
        return res.send(req.body)
    },
    profile : (req,res) => {
        return res.render('finalUser/userProfile')
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
    /* APIs */
    verifyCourse : async (req,res) => {
        try {
           
            let result = await db.UserCourse.findOne({
                where : {
                    userId : req.session.user?.id || 0,
                    courseId : req.params.id,
                    active : true
                }
            });
            if(result){
                return res.status(200).json({
                    ok : true,
                    msg: 'user suscribed',
                    url : `/materia/contenido/${req.params.id}?suscribe=true`
                  })  
            }else {
                return res.status(200).json({
                    ok : true,
                    msg: 'user not suscribed',
                    url : `/materia/contenido/${req.params.id}?suscribe=false`
                  })  
            }
            
        } catch (error) {
            console.log(error)
            return res.status(error.status).json({
              ok: false,
              msg: error.message ? error.message : 'ups... error'
            })
        }
      
    }
}