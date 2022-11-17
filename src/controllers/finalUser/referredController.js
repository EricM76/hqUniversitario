const { format, add } = require("date-fns");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const db = require("../../database/models");
const sendEmail = require("../../services/email.service");
const { getUserMembershipData } = require("../../services/membershipService");
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

module.exports = {
    addReferred: async (req, res) => {
        let errors = validationResult(req);
         
        if(errors.isEmpty()){
            try {
                let referred = await db.Referred.create({
                    name: req.body.name,
                    email: req.body.email,
                    userId: req.session.user.id,
                    code : uuidv4(),
                    active: false,
                })

                let email = {
                    /* subject: `${req.session.user.name} te refirió en HQ Universitario`,
                    title: `¡Fuiste referido en HQ Universitario!`, 
                    content: `
                    <img src="https://hquniversitario.com/images/logo_hq.jpeg">\n<h3>${req.session.user.name} está aprovechando a full del contenido que <strong>HQ Universitario</strong> ofrece para estudiantes.</h3>\n
                    <h2>También vos podés hacerlo. Registrate en <a href="${req.protocol}://${req.get('host')}/usuario/registro" target="_blank" >HQ Universitario</a>. Refiriendo a otros ganarás una membresía totalmente gratis.</h2>\n
                    <h3><strong>HQ Universitario</strong> es una comunidad donde podés tener acceso al contenido que necesitás para aprobar tus materias. Para saber más, seguinos en nuestras redes!</h3>`,  */
                    to: [
                        {
                            email: req.body.email,
                            name: req.body.name,
                        }
                    ],
                    params : {
                        name : req.session.user.name,
                        referred : referred.name,
                        code : referred.code
                    },
                    templateId : 2
                }

                sendEmail(email)

                return res.redirect("/usuario/perfil#referred")
            } catch(error) {
                return res.status(400).json({
                    message: error
                });
            }
        }else{
         return res.render('finalUser/userProfile', {
                errors: errors.mapped(),
                old: req.body
            })
        }
    },
    getByUserId: async (req, res) => {
        try {
            const userId = Number(req.params.userId.trim());
            if(!userId) throw "Id inválido";

            const userReferreds = await db.Referred.findAll({
                where: {
                    userId: userId,
                }
            });
            if(userReferreds.length === 0) throw "El usuario no tiene referidos";
            return res.status(200).json(userReferreds);
        } catch (error) {
            return res.status(400).json({
                message: error
            });
        }
    },
    getActivesByUserId: async (req, res) => {
        try {
            const userId = Number(req.params.userId.trim());

            if(!userId) throw "Id inválido";
            
            const activesReferreds = await db.Referred.findAll({
                where: {
                    [Op.and]: [{userId},{
                        active: 1
                    }],
                }   
            });

            if(activesReferreds.length === 0) throw "El usuario no tiene referidos activos";

            return res.status(200).json({
                total: activesReferreds.length,
                data: activesReferreds
            })
        } catch (error) {
            return res.status(400).json({
                message: error
            });
        }
    },
    setActiveFreeMembership: async (req, res) => {
        try {
            const userId = Number(req.params.userId.trim());
            if(!userId) throw "Id inválido";
            
            const { totalActivesReferreds } = req.body;
            if(!totalActivesReferreds) throw "Total de referidos activos no enviado";
            
            const MEMBERSHIP_1 = process.env.MEMBERSHIP_1; 
            const MEMBERSHIP_2 = process.env.MEMBERSHIP_2; 
            const MEMBERSHIP_3 = process.env.MEMBERSHIP_3;
             
            let freeMembershipObtained;

            switch (totalActivesReferreds) {
                case 2:
                    freeMembershipObtained = MEMBERSHIP_1;
                    break;
                case 3:
                    freeMembershipObtained = MEMBERSHIP_2;
                    break;
                case 4:
                    freeMembershipObtained = MEMBERSHIP_3;
                    break;
                default:
                    break;
            }

            const membershipObtained = await db.Membership.findOne({
                where: {
                    name: {
                        [Op.like]: freeMembershipObtained
                    }
                }
            }) 

            /* Verifica membresia activa */
            const currentUserMembership = await getUserMembershipData(userId);
                
            const winnerUserUpdate = await db.User.update({
                membershipId: membershipObtained.id,
                entry: new Date(),
                status: true,
                expires: (currentUserMembership.data && currentUserMembership.data.expires) !== undefined ? (currentUserMembership.data && currentUserMembership.data.expires) : add(new Date(), {days: 30}),
                freeMembership: true,
            }, {
              where: { id: userId } 
            })

            let winnerUser = await db.User.findByPk(userId,{
                include : ['membership']
            })

            if(winnerUserUpdate){
                let email = {
                   /*  subject: `Ganaste una membresía en HQ Universitario!`,
                    title: "Ganaste una membresía!", 
                    content: `Ingresá en <a href="http://localhost:3000" target="_blank" >HQ Universitario</a> y elegí tus materias`,  */
                    to: [
                        {
                            email: winnerUser.email,
                            name: winnerUser.name,
                        }
                    ],
                    params : {
                        name : winnerUser.name,
                        membership : winnnerUser.membership.name,
                        expires : moment(winner.User.expires).utc().format('DD-MM-YYYY'),
                        quota : winnerUser.membership.quota
                    },
                    templateId : 3
                }

                sendEmail(email)
                return res.status(200).json({ message: `Membresía gratuita activada al usuario ${userId}`})   
            }
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                message: error
            });
        }
    },
    deleteReferred : async (req,res) => {

        let errors = validationResult(req);

        if (errors.isEmpty()) {
            try {
                let referred = await db.Referred.findOne({
                    where : {
                        code : req.query.code
                    }
                })
                let confirm = await referred.destroy()

                if(confirm){

                    let email = {
                        to: [
                            {
                                email: referred.email,
                                name: referred.name,
                            }
                        ],
                        params : {
                            contact : referred.name,
                        },
                        templateId : 4
                    }
    
                    sendEmail(email)

                    return res.render('finalUser/cancelReferred', {
                      session : req.session
                    })
                  }

            } catch (error) {
                console.log(error)
            }

        }else {
          return res.render('finalUser/errorVerify', {
            errors : errors.mapped(),
            session : req.session
          })
        }


      
    }
}