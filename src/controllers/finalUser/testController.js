const db = require('../../database/models')
module.exports = {
    list : (req,res) => {

     let course = db.Course.findByPk(req.params.id, {
        attributes : ['id'],
            include: [
             
                {
                    association: 'tests',
                    include: [
                        {
                            association: 'questions',
                            include: ['answers']
                        }
                    ]
                },
            
            ]
        })

        let results = db.UserTest.findAll({
            where : {
                userId : req.session.user.id,
                courseId : req.params.id
            }
        });
        
        
        
        Promise.all([course,results]).then(([course,results]) => {
            return res.render('finalUser/test',{
                tests : course.tests,
                results,
                session: req.session 
            }
            )
        }).catch(error => console.log(error))


    },
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

            let course = await db.Course.findByPk(test.courseId,{
                include : ['university','faculty']
            })

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
            let correctIds = [];
            let answersCorrect = [];
            let answers = [];

            for (const key in req.body) {
                if(key.includes('question')){
                    let position = key.indexOf('_');
                    let id = key.slice(position + 1);
                    answers.push(+req.body[key])
                    results.forEach(result => {
                        if(result.question == id){
                            let check = result.answer == req.body[key];
                            
                            if(check){
                                corrects++;
                                score = score + +result.score;
                                correctIds.push(result.question);
                                answersCorrect.push(result.answer);
                            }
                        }
                    });
                }
            };


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
                    courseId : +course.id,
                    totalScore : test.score,
                    score: score,
                    corrects: corrects,
                    effectiveness: +score * 100 / +test.score,
                    time: test.time - timeRest
                  }
            });

            if(!newRegister[0].isNewRecord){
                await db.UserTest.update(
                    {
                        totalScore : test.score,
                        score : score,
                        corrects : corrects,
                        effectiveness: +score * 100 / +test.score,
                        time: test.time - timeRest,
                        courseId : +course.id,
                    },
                    {
                        where : {
                            userId : req.session.user.id,
                            testId : req.params.id
                          },
                    }
                )
            };

            console.log('====================================');
            console.log(answers);
            console.log('====================================');

            return res.render('finalUser/testResult',{
                session : req.session,
                course,
                test,
                correctIds,
                answersCorrect,
                answers,
                result : {
                    time: test.time - timeRest,
                    total : test.score,
                    score,
                }
            })


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