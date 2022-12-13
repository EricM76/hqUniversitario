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
      /*   const { name, description, price, quota, reason, transaction_amount, billing_day, repetitions, back_url, billing_day_proportional } = req.body;
        try {

            const url = `${process.env.API_MP}/preapproval_plan/${req.query.mp_id}`;
            const body = {
                reason,
                auto_recurring: {
                    frequency: 1,
                    frequency_type: "months",
                    repetitions,
                    billing_day,
                    billing_day_proportional : billing_day_proportional ? true : false,
                    transaction_amount,
                    currency_id: "ARS"
                },
                payment_methods_allowed: {
                    payment_types: [
                        {}
                    ],
                    payment_methods: [
                        {}
                    ]
                },
                back_url
            };

            const updateMP = await axios.put(url,body, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
                }
            });

            await db.Membership.update(
                {
                    name: name.trim(),
                    price :transaction_amount,
                    quota,
                    description: description.trim(),
                    mp_checkout : updateMP.init_point
                },
                {
                    where: { id: req.params.id }
                }
            )
            return res.redirect('/memberships')
        } catch (error) {
            console.log(error)
        } */
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