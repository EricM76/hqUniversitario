const db = require("../../database/models");
const { getActivesUserCourses } = require("../../services/userCoursesService");

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
            const user = await db.User.findOne({
                where: {
                    id: userId
                },
                include: ["membership"]
            });

            const {data} = await getActivesUserCourses(userId);

            const response = {
                membershipId: user.membershipId,
                expires: user.expires,
                status: user.status,
                membershipName: user.membership.name,
                freeMembership: user.freeMembership,
                membershipQuota: user.membership.quota,
                activesUserCourses: data.total,
                quotasAvailable: user.membership.quota - data.total,
            }

            return res.status(200).json({ 
                response
            });
        } catch (error) {
            res.json({error})
        }
    },
}