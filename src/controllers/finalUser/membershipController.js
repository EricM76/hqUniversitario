const db = require("../../database/models");

module.exports = {
    getById: async (req, res) => {
        const membershipId = req.params.membershipId;
        try {
            const membership = await db.Membership.findByPk(membershipId);

            return res.status(200).json(membership)
        } catch (error) {
            res.json(error)
        }
    },
    getByUserId: async (req, res) => {
        const userId = req.params.userId;
        try {
            const user = await db.User.findByPk(userId);

            return res.status(200).json(user);
        } catch (error) {
            res.json(error)
        }
    },
}