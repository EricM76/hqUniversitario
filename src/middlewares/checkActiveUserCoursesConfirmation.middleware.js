const db = require("../database/models");

const checkActiveUserCoursesConfirmation = async (res, res, next) => {
    // Tiene materias para vencidas para confirmar?
    // si
    try {
        const expiredToConfirmActiveUserCourses = await db.UserCourses.findAll({
            where: {
                [Op.and]: [
                    {
                        userId: req.session.user.id 
                    },
                    { 
                      continueConfirm: 0 
                    },
                    {
                      active: 1,
                    },
                ],
            }
        })

        // La fecha de vencimiento es hoy
        if(expiredToConfirmActiveUserCourses) {
            // devuelve vista de confirmacion con la lista de materias
            // 
        }else{
             // no
            // next
            next()
        }
    } catch (error) {
        
    }
   
}

module.exports