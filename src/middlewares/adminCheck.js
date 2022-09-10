const adminCheck = (req, res, next) => {
    if(req.session.user.rolId == 2){
        next()
    }else{
        res.send("No tienes permisos para ingresar")
    }
}

module.exports = adminCheck;