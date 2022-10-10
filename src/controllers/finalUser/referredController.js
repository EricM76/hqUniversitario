const { format, add } = require("date-fns");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const db = require("../../database/models");

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
        
            const winnerUser = await db.User.update({
                membershipId: 4, //Refactorizar esto (ID de membresía free)
                entry: new Date(),
                expires: add(new Date(), {days: 30}),
            }, {
              where: { id: userId } 
            })

            if(winnerUser){
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