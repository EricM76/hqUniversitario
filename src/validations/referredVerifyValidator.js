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
        return db.Referred.findOne({
            where : {
                code : req.query.code
            }
        }).then(referred => {
            if(!referred){
                return Promise.reject()
            }
        }).catch(error => Promise.reject('El referido no existe'))
    }),
  
]