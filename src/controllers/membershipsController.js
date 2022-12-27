const db = require('../database/models');
const axios = require("axios");

module.exports = {
    add: (req, res) => {

    },
    store: (req, res) => {

    },
    list: async (req, res) => {
        try {

            let memberships = await db.Membership.findAll({
                include: [
                    {
                        association: 'users',
                        attributes: ['id','freeMembership','membershipId']
                    }
                ]
            })
            return res.render('admin/memberships', { memberships })
        } catch (error) {
            console.log(error)
        }

    },
    detail: (req, res) => {

    },
    edit: async (req, res) => {

    },
    update: async (req, res) => {
        const { name, description, price, quota, days} = req.body;
        try {

            await db.Membership.update(
                {
                    name: name.trim(),
                    price,
                    quota,
                    description: description.trim(),
                    days
                },
                {
                    where: { id: req.params.id }
                }
            )
            return res.redirect('/memberships')
        } catch (error) {
            console.log(error)
        }
    },
    remove: (req, res) => {

    },
    search: (req, res) => {

    },
    filter: (req, res) => {

    },
    /* apis */
    getSubscriptionPlan: async (req, res) => {

        try {
            const url = `${process.env.API_MP}/preapproval_plan/${req.params.id}`;
            const plan = await axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
                }
            });
            console.log(plan)
            return res.status(200).json({
                ok: true,
                data: plan.data
            })
        } catch (error) {
            console.log(error)
            return res.status(error.status || 500).json({
                ok: false,
                error: error.message || 'Upss, error!!'
            })
        }
    }
}