
const subscriptionPreaprovalCheck = (req, res, next) => {
    const subscriptionPreaprovalId = req.query.preapproval_id;
    if(subscriptionPreaprovalId !== undefined){
        return res.redirect(`/usuario/suscripcion/estado?preapproval_id=${subscriptionPreaprovalId}`)
    }
    next()
};

module.exports = subscriptionPreaprovalCheck;