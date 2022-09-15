const db = require('../database/models');

module.exports = {
    add : (req,res) => {

    },
    store : (req,res) => {

    },
    list : async (req,res) => {
        let memberships = await db.Membership.findAll({
            include : [
                {
                    association : 'users',
                    attributes : ['id']
                }
            ]
        })
        return res.render('admin/memberships',{memberships})
    },
    detail : (req,res) => {

    },
    edit : (req,res) => {

    },
    update : (req,res) => {

    },
    remove : (req,res) => {

    },
    search : (req,res) => {

    },
    filter : (req,res) => {
        
    }
}