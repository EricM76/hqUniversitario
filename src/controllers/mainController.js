const db = require('../database/models');
const axios = require('axios');
const {validationResult} = require('express-validator');


module.exports = {
    home : (req,res) => {
        const getUniversities = db.University.findAll({
            include : ['faculties','careers','courses']
        });
        const getLastestCourses = db.Course.findAll({
            where: {
                visible: false,
            },
            order: [["updatedAt", "DESC"]],
            limit: 10,
            include : ['university','faculty']
        });

        Promise.all([getUniversities, getLastestCourses])
        .then(([universities, lastestCourses]) => {
            return res.render("finalUser/home", {
                universities,
                lastestCourses,
                session: req.session,
            })
        })
        .catch(error => console.log(error))
    },
    admin : async (req,res) => {
        try {

            const url = `${process.env.API_MP}/preapproval_plan/search?status=active`;

            const response = await axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
                }
            });

            let users = await db.User.findAll({
                includes : [
                    {
                        association : 'membership',
                        attributes : ['id']
                    },
                    {
                        association : 'courses',
                        include : ['faculty']
                    }
                ]
            })

            let categories = await db.Category.findAll({
                includes : [
                    {
                        association : 'videos',
                        attributes : ['id']
                    },
                ]
            });

            let faculties = await db.Faculty.findAll({
                include : [
                    {
                        association : 'careers',
                        include : [
                            {
                                association : 'courses',
                                include : ['users']
                            }
                        ]
                    },
                    {
                        association : 'university'
                    }
                ]
                });

            let videos = await db.Video.findAll({
                attributes : ['id','categoryId']
            });

            let courses = await db.Course.findAll({
                include : ['users']
            });

            let referreds = await db.Referred.findAll({
                include : [
                   { 
                    association : "users",
                    attributes :['id', "name", "surname"]
                    }
                ]
            });

            let memberships = await db.Membership.findAll({
                include : [
                    {
                        association : 'users',
                        attributes : ['id']
                    }
                ]
            })

            console.log(response.data.results)

            return res.render('admin/index',{
                /* basic : users.filter(user => user.freeMembership && user.membershipId == 1).length,
                pro : users.filter(user => user.freeMembership && user.membershipId == 2).length,
                premium : users.filter(user =>user.freeMembership && user.membershipId == 3).length, */
                users,
                memberships,
                categories,
                faculties,
                videos,
                courses,
                referreds,
                subscriptions : response.data.results
            })

        } catch (error) {
            console.log(error)
        }
    },
    contact: (req, res) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            //Lógica de envio de email
            res.status(200).json({message: "Mensaje enviado correctamente"})
        } else {
            res.status(400).json({
                errores: errors.mapped(),
            })
        }
    }
}