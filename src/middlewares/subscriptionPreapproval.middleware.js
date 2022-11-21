const db = require("../database/models");

const subscriptionPreaprovalCheck = async (req, res, next) => {
    const subscriptionPreaprovalId = req.query.preapproval_id;
    if(subscriptionPreaprovalId !== undefined){
        return res.redirect(`/usuario/suscripcion/estado?preapproval_id=${subscriptionPreaprovalId}`)
    } else if (req.session.user){
        const user = await db.User.findByPk(req.session.user.id);
        if(!user.confirmedSubscription && user.subscriptionId){
           return res.redirect(`/usuario/suscripcion/estado?preapproval_id=${user.subscriptionId}`)
        }
    }
    next()
};

module.exports = subscriptionPreaprovalCheck;