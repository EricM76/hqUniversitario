const db = require('../../database/models')
module.exports = {
    feedback: async (req, res) => {
        const {timeHour, timeMinute, timeSecond} = req.body;
        try {
            let test = await db.Test.findByPk(req.params.id,{
                include : [
                    {
                        association: 'questions',
                        include : ['answers']
                    }
                ]
            });

            let results = test.questions.map(question => {
                let answer = question.answers.find(answer => answer.correct)
                return {
                    question : question.id,
                    answer : answer.id,
                    score : question.score
                }
            });

            let corrects = 0;
            let score = 0;

            for (const key in req.body) {
                if(key.includes('question')){
                    let position = key.indexOf('_');
                    let id = key.slice(position + 1);
    
                    results.forEach(result => {
                        if(result.question == id){
                            let check = result.answer == req.body[key];
                            if(check){
                                corrects++;
                                score = score + +result.score
                            }
                        }
                    });
                }
            };

            console.log('====================================');
            console.log(corrects,score,+score * 100 / +test.score);
            console.log('====================================');


           /*  console.log('horas',+timeHour * 60);
            console.log('minutos',+timeMinute);
            console.log('segundos',Math.floor(+timeSecond / 60)) */
            let timeRest = (+timeHour * 60) + +timeMinute + Math.floor(+timeSecond / 60);
           
            let newRegister = await db.UserTest.findOrCreate({
                where : {
                    userId : req.session.user.id,
                    testId : req.params.id
                  },
                  defaults : {
                    userId : req.session.user.id,
                    testId : req.params.id,
                    totalScore : test.score,
                    score: score,
                    corrects: corrects,
                    effectiveness: +score * 100 / +test.score,
                    time: timeRest
                  }
            });

            if(!newRegister[0].isNewRecord){
                await db.UserTest.update(
                    {
                        totalScore : test.score,
                        score : score,
                        corrects : corrects,
                        effectiveness: +score * 100 / +test.score,
                        time: timeRest
                    },
                    {
                        where : {
                            userId : req.session.user.id,
                            testId : req.params.id
                          },
                    }
                )
            }

            return res.redirect(`/materia/contenido/1?suscribe=true&result=true}&test=${req.params.id}`)


        } catch (error) {
            console.log(error)
        }
    },
    /* APIs */
    result : async (req,res) => {
        try {

            let result = await db.UserTest.findOne({
                where : {
                    userId : req.session.user.id,
                    testId : req.params.id
                }
            });
            if(!result) {

                let error = new Error('No hay resultados registrados para este exámen.');
                error.status = 404;
                throw error;
            }

            return res.status(200).json({
                ok : true,
                data : result,
            })
           
          

            
        } catch (error) {
            return res.status(error.status || 500).json({
                ok : false,
                msg : error.message || 'ups! Hubo un problema'
            })
        }
    }
}