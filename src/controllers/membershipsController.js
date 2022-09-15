const db = require('../database/models');

module.exports = {
    add : (req,res) => {

    },
    store : (req,res) => {

    },
    list : async (req,res) => {
        try {
            let memberships = await db.Membership.findAll({
                include : [
                    {
                        association : 'users',
                        attributes : ['id']
                    }
                ]
            })
            return res.render('admin/memberships',{memberships})
        } catch (error) {
            console.log(error)
        }
       
    },
    detail : (req,res) => {

    },
    edit : async (req,res) => {

    },
    update : async (req,res) => {
        const {name, description, price, quota} =req.body;
        try {
            let {image} = await db.Membership.findByPk(req.params.id)
            await db.Membership.update(
                {
                    name : name.trim(),
                    price,
                    quota,
                    description : description.trim(),
                    image : req.file ? req.file.filename : image
                },
                {
                    where : {id : req.params.id}
                }
            )
            return res.redirect('/memberships')
        } catch (error) {
            console.log(error)
        }
    },
    remove : (req,res) => {

    },
    search : (req,res) => {

    },
    filter : (req,res) => {
        
    }
}