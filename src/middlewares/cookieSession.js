const cookieSession = (req, res, next) => {
    if(req.cookies.hq){
        req.session.user = req.cookies.hq;
        res.locals.user = req.session.user;
    }
    return next()
}

module.exports = cookieSession;