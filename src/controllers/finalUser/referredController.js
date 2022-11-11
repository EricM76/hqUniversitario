const { format, add } = require("date-fns");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const db = require("../../database/models");
const sendEmail = require("../../services/email.service");
const { getUserMembershipData } = require("../../services/membershipService");

module.exports = {
    addReferred: async (req, res) => {
        let errors = validationResult(req);
         
        if(errors.isEmpty()){
            try {
                await db.Referred.create({
                    name: req.body.name,
                    email: req.body.email,
                    userId: req.session.user.id,
                    active: false,
                })

                let email = {
                    subject: `${req.session.user.name} te refirió en HQ Universitario`,
                    title: "Fuiste referido!", 
                    content: `Registrate en <a href="http://localhost:3000/usuario/registro" target="_blank" >HQ Universitario</a>`, 
                    to: [
                        {
                            email: req.body.email,
                            name: req.body.name,
                        }
                    ]
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

            let winnerUser = await db.User.findByPk(userId)

            if(winnerUserUpdate){
                let email = {
                    subject: `Ganaste una membresía en HQ Universitario!`,
                    title: "Ganaste una membresía!", 
                    content: `Ingresá en <a href="http://localhost:3000" target="_blank" >HQ Universitario</a> y elegí tus materias`, 
                    to: [
                        {
                            email: winnerUser.email,
                            name: winnerUser.name,
                        }
                    ]
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
    }
}