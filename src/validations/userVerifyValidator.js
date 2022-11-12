const {body} = require('express-validator')
const db = require('../database/models')
module.exports = [
    body('code').custom((value, {req}) => {
        if(!req.query.code){
            return false
        }
        return true
    }).withMessage('Código inexistente')
    .bail(),
    body('code').custom((value, {req}) => {
        return db.User.findOne({
            where : {
                code : req.query.code
            }
        }).then(user => {
            if(!user){
                return Promise.reject()
            }
        }).catch(error => Promise.reject('Código incorrecto'))
    }).bail(),
    body('code').custom((value, {req}) => {
        return db.User.findOne({
            where : {
                code : req.query.code,
                verify : true
            }
        }).then(user => {
            if(user){
                return Promise.reject()
            }
        }).catch(error => Promise.reject('Ya está validado'))
    })
]