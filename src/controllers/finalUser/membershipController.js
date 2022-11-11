const { format } = require("date-fns");
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

            let date1 = new Date(user.expires);
            let date2 =  new Date(`${format(new Date(), "yyyy-MM-dd")}T13:22:55.000Z`);
            let Difference_In_Time = date2.getTime() - date1.getTime();
            let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

            const response = {
                membershipId: user.membershipId,
                expires: user.expires,
                daysToExpires: Math.abs(Difference_In_Days),
                status: user.status,
                membershipName: user.membership && user.membership.name,
                freeMembership: user.freeMembership,
                membershipQuota: user.membership && user.membership.quota,
                activesUserCourses: data && data.total,
                quotasAvailable: user.membership && user.membership.quota - data && data.total,
            }

            return res.status(200).json(response);
        } catch (error) {
            console.log(error)
            res.status(400).json({error: "Sin membresía"})
        }
    },
}