const db = require("../../database/models");

module.exports = {
    getByUserId: async (req, res) => {
        try {
            const userId = req.session.user.id;
            const userReferreds = await db.Referred.findAll({
                where: {
                    userId,
                }
            })
        } catch (error) {
            
        }
    },
    getActivesByUserId: async (req, res) => {

    }
}