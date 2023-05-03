const userSessionCheck = (req, res, next) => {
    if(req.session.user){
        return next()
    }else{
        return res.redirect('/usuario/login')
    }
}

module.exports = userSessionCheck;