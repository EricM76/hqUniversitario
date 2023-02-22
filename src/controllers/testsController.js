const fs = require('fs');
const path = require('path');
const db = require("../database/models")

module.exports = {
    add: async (req, res) => {
        try {
            let course = await db.Course.findByPk(req.params.idCourse, {
                include: ['faculty']
            })
            return res.render('admin/testAdd', { course })
        } catch (error) {
            console.log(error)
        }
    },
    store: async (req, res) => {
        try {
            let test = await db.Test.create({
                name: req.body.name.trim(),
                score: req.body.score,
                time : req.body.time,
                courseId: req.query.course
            })
            if (test) {
                return res.redirect(`/courses/edit/tests/${test.courseId}`)
            }

        } catch (error) {
            console.log(error)
        }
    },
    list: (req, res) => {

    },
    detail: (req, res) => {

    },
    edit: async (req, res) => {
        try {
            let course = await db.Course.findByPk(req.query.course, {
                include: [
                    {
                        association: 'faculty',
                        attributes: ['acronym']
                    }
                ]
            });
            let test = await db.Test.findByPk(req.params.id, {
                include: [
                    {
                        association: 'questions',
                        include: {
                            all: true
                        }
                    }
                ]
            })

            return res.render('admin/testEdit', {
                course,
                test,
                new: req.query.new ? true : false
            })

        } catch (error) {
            console.log(error)
        }
    },
    update: async (req, res) => {
        const questions = [];
        const answers = [];
        const corrects = [];
        const {name, score, time} = req.body;

        for (const key in req.body) {
            if (key.includes('question')) {
                let position = key.indexOf('_')
                let id = key.slice(position + 1)

                questions.push({
                    id,
                    content: req.body[key],
                    score: req.body['score_' + id]
                })
            }
            if (key.includes('answer')) {
                let position = key.indexOf('_')
                let id = key.slice(position + 1)
                answers.push({
                    id,
                    content: req.body[key],
                })
            }
        
            if (key.includes('correct')) {
                corrects.push(req.body[key])
            }
        }

        try {

            await db.Test.update(
                {
                    name : name.trim(),
                    score,
                    time
                },
                {
                    where : {id : req.params.id}
                }
            )
    
            const answerUpdated = answers.map(answer => {
                if(corrects.includes(answer.id)){
                    return {
                        ...answer,
                        correct : true
                    }
                }
                return {
                    ...answer,
                    correct: false
                }
            })
    
            answerUpdated.forEach(async (answer) => {
                await db.Answer.update(
                    {
                        content : answer.content,
                        correct : answer.correct
                    },
                    {
                        where : {id : answer.id}
                    }
                )
            });
            questions.forEach(async (question) => {
                await db.Question.update(
                    {
                        content : question.content,
                        score : question.score,
                    },
                    {
                        where : {id : question.id}
                    }
                )
            })
           
            return res.redirect(`/courses/edit/tests/${req.query.course}`)
            
        } catch (error) {
            console.log(error)
        }
    },

    search: (req, res) => {

    },
    filter: (req, res) => {

    },
    /* questions */
    addQuestion: async (req, res) => {
        console.log(req.files)
        const { answers, correct, score } = req.body;
        const { test, course } = req.query;
        const mappedAnswers = answers.map((answer, index) => {
            let image;
            for (const key in req.files) {

                if (key === 'image' + index) {
                    image = req.files[key][0].filename
                }
            }

            if (answer != "") {
                return {
                    content: answer,
                    correct: index == correct ? true : false,
                    image: image ? image : null
                }
            }
            return null
        });
        const filteredAnswers = mappedAnswers.filter(answer => answer !== null);
        try {
            let question = await db.Question.create({
                content: req.body.question,
                score : req.body.score,
                testId: test,
                image : req.files.image ? req.files.image[0].filename : null
            });

            filteredAnswers.forEach(async answer => {
                await db.Answer.create({
                    ...answer,
                    questionId: question.id
                })
            });

            return res.redirect(`/tests/edit/${test}?course=${course}`)

        } catch (error) {
            console.log(error)
        }
    },
    /* test APIs */
    remove: async (req, res) => {
        try {
            await db.Test.destroy({
                where : {id : req.params.id}
            })
            return res.status(200).json({
                ok : true,
                msg : 'Test eliminado correctamente'
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                ok : false,
                msg: 'ups, hubo un error!'
            })
        }
    },
    /* questions APIs */
    deleteQuestion: async (req, res) => {
        try {

            let answers = await db.Answer.findAll({
                where: {
                    questionId: req.params.id
                }
            });

            if (answers) {
                answers.forEach(answer => {
                    fs.existsSync('./public/images/questions' + answer.image) && fs.unlinkSync('./public/images/questions' + answer.image)
                });
            };

            await db.Answer.destroy({
                where: {
                    questionId: req.params.id
                }
            });

            await db.Question.destroy({
                where: { id: req.params.id }

            });

            return res.status(200).json({
                ok: true,
                msg: 'pregunta eliminada correctamente'
            })


        } catch (error) {
            console.log(error)
            return res.status(500).json({
                ok: false,
                msg: 'ups, un error!!'
            })
        }
    },
    changeQuestionImage: async (req, res) => {

        try {
            const question = await db.Question.findByPk(req.params.id);
            if (question.image) {
                fs.unlinkSync(path.join(__dirname, '../../public/images/questions/' + question.image))
            }
            await db.Question.update(
                {
                    image: req.file.filename
                },
                {
                    where: {
                        id: req.params.id
                    }
                }
            )
            return res.status(200).json({
                ok: true,
                msg: 'Imagen actualizada!!'
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                ok: false,
                msg: 'ups, hubo un error'
            })
        }

    },
    /* answers APIs */
    changeImage: async (req, res) => {

        try {
            const answer = await db.Answer.findByPk(req.params.id);
            if (answer.image) {
                fs.unlinkSync(path.join(__dirname, '../../public/images/questions/' + answer.image))
            }
            await db.Answer.update(
                {
                    image: req.file.filename
                },
                {
                    where: {
                        id: req.params.id
                    }
                }
            )
            return res.status(200).json({
                ok: true,
                msg: 'Imagen actualizada!!'
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                ok: false,
                msg: 'ups, hubo un error'
            })
        }

    },
    deleteAnswer : async (req,res) => {
        try {
            let answer = await db.Answer.findByPk(req.params.id);
            if (answer.image) {
                fs.unlinkSync(path.join(__dirname, '../../public/images/questions/' + answer.image))
            }
            await db.Answer.destroy({
                where: {
                    id: req.params.id
                }
            });
            return res.status(200).json({
                ok: true,
                msg: 'Pregunta eliminada con éxito!!'
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                ok : false,
                msg : 'ups, hubo un error'
            })
        }
    },
    addAnwer : async (req,res) => {

        const {content, score} = req.body;
        try {
            let answer = await db.Answer.create({
                            content: content.trim(),
                            correct: false,
                            score,
                            image: req.file ? req.file.filename : null,
                            questionId : req.params.idQuestion
                        });
            console.log(answer)
            if(answer){
                return res.status(201).json({
                    ok : true,
                    msg : 'Pregunta añadida exitosamente!'
                })
            }
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                ok : false,
                msg: 'ups, hubo un error!'
            })
        }
    },
    countAnswers : async (req,res) => {
        try {
            const {questionId} = await db.Answer.findByPk(req.params.id)
            const total = await db.Answer.count({
                where : {
                    questionId
                }
            })
            return res.status(200).json({
                ok : true,
                data : total
            })
        } catch (error) {
            return res.status(error.status || 500).json({
                ok : false,
                msg : error.message || 'ups! Hubo un problema'
            })
        }    
    }
}