const adminCheck = (req, res, next) => {
    if(req.session.user.rolId == 1){
        next()
    }else{
        res.redirect("/")
    }
}

module.exports = adminCheck;