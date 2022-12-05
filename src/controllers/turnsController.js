const db = require('../database/models')

module.exports = {
    list : async (req,res) => {
        try {
            let {turns} = await db.Course.findByPk(req.query.course,{
                include : ['turns']
            })
            return res.status(201).json({
                ok : true,
                code : res.statusCode,
                turns
            })
        } catch (error) {
            console.log(error);
            return res.status(res.statusCode || 500).json({
                ok : false,
                code : res.statusCode,
                msg : 'Comuníquese con el administrador del sitio'
            })
        }
    },
    update : async  (req,res) => {
        const {ids,months} = req.body;
       
        try {
            ids.forEach(async (id) => {
                await db.Turn.update(
                    {
                        month
                    },
                    {
                        where : {id}
                    }
                )
            });
        
            await db.TurnCourses.destroy({
                where : {
                    courseId : req.params.id
                }
            })
            await db.TurnCourses.bulkCreate(turns, { validate: true });
            return res.redirect('/courses/edit/' + req.params.id)
        } catch (error) {
            console.log(error)
        }
      
    },
    /* APIs */
    add : async (req,res) => {
        /* 
        body : {
            turns, -> array de string
            newTurn -> string
        }
        */
       let {turns, newTurn} = req.body;
        try {
            if(turns){
                turns = typeof turns === "string" && [turns]
                let turnsAdded = turns.map(turn => ({
                    courseId : req.query.course,
                    turnId : turn
                }))
                await db.TurnCourses.bulkCreate(turnsAdded, { validate: true });
            }
            if(newTurn){
                const turn = await db.Turn.create({
                    month : newTurn
                })
                await db.TurnCourses.create({
                    turnId : turn.id,
                    courseId : req.query.course
                })
            }
            return res.redirect(`/courses/edit/${req.query.course}?next=turns`)
            
        } catch (error) {
            console.log(error)
           
        }
    },
    remove : async (req,res) => {
        try {
            const {courseId, turnId} = req.query;
            await db.TurnCourses.destroy({
               where : {
                courseId,
                turnId
               }
            });
            return res.status(201).json({
                ok : true,
                code : res.statusCode,
                msg : 'Turno eliminado corretamente'
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
  
}