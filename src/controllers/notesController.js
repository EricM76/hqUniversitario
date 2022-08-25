const db = require('../database/models');
const fs = require('fs');
const path = require('path');

module.exports = {
    /* APIs */
    remove : async (req,res) => {
        try {
           
            let confirm = await db.Note.destroy({
                where : {
                    id : req.params.id
                }
            });

            if(confirm){

                fs.existsSync(path.resolve(__dirname, '..', 'assets','downloads',req.body.file)) && fs.unlinkSync(path.resolve(__dirname, '..', 'assets','downloads',req.body.file));
                let count = await db.Note.count({
                    where : {
                        id : req.params.id
                    }
                })
                return res.status(200).json({
                    ok: true,
                    code: res.statusCode,
                    msg : 'Apunte eliminado!!',
                    count : count
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(res.statusCode || 500).json({
                ok : false,
                code : res.statusCode,
                msg : 'Comuníquese con el administrador del sitio'
            })
        }
    }
}