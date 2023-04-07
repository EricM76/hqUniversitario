const moment = require('moment');
const db = require('../database/models');
const paginate = require('express-paginate');
const {Op} = require('sequelize');

module.exports = {
    list : async (req,res) => {
        try {
            let result;
            if(req.query.search){
                 result = await db.User.findAndCountAll({
                    where : {
                        [Op.or] : [
                            {
                                email : {
                                    [Op.substring] : req.query.search.trim()
                                }
                            },
                            {
                                name : {
                                    [Op.substring] : req.query.search.trim()
                                }
                            },
                            {
                                surname : {
                                    [Op.substring] : req.query.search.trim()
                                }
                            },
                        ]
                    },
                    limit: req.query.limit, 
                    offset: req.skip,
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
            }else {
                result = await db.User.findAndCountAll({
                    limit: req.query.limit, 
                    offset: req.skip,
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
            }
          
              const itemCount = result.count;
              const pageCount = Math.ceil(result.count / req.query.limit);

              return res.render('admin/users',{
                users : result.rows,
                moment,
                itemCount, 
                pageCount,
                pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
                currentPage : req.query.page,
                search : req.query.search

            }) 

         /*    let users = await db.User.findAll({
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
            }) */
        } catch (error) {
            console.log(error)
        }
    },
    detail : async (req,res) => {
        const options = {
            include : ['membership', 'tests', {
                association : 'courses',
                attributes : ['id', 'name'],
                include : [
                    {
                        association : 'faculty',
                        attributes : ['id','acronym'],
                        include : [
                            {
                                association : 'university',
                                attributes : ['id','acronym']
                            }
                        ]
                    }
                ]
            },
        {
            association : 'referreds',
            attributes : ['id','name','email','active']
        }]
        }
        try {
            let user;
            if(req.params.id){
                user = await db.User.findByPk(req.params.id, options)
             }else{
                user = await db.User.findOne({
                    ...options,
                    where : {email : req.query.referred}
                });
             }
             let memberships = await db.Membership.findAll()
            return res.render('admin/userDetail', {
                user,
                moment : moment,
                memberships
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
                    userId : req.session.user && req.session.user.id || 0,
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