const adminCheck = (req, res, next) => {
    if(req.session.user.rol == 1){
        return next()
    }else{
        res.redirect("/")
    }
}

module.exports = adminCheck;