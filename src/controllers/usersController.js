module.exports = {
    register : (req,res) => {
        return res.render('userRegister')
    },
    processRegister : (req,res) => {
        return res.send(req.body)
    },
    login : (req,res) => {
        return res.render('userLogin')
    },
    processLogin : (req,res) => {
        return res.send(req.body)
    },
    profile : (req,res) => {
        return res.render('userProfile')
    },
    update : (req,res) => {
        return res.send(req.body)
    },
}