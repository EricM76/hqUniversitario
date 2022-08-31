const db =require('../database/models');

module.exports = {
    /* apis */
    list : async (req,res) => {
        try {
            let turns = await db.Turn.findAll()
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
    }
}