module.exports = {
    login: (req, res) => {
       res.render("finalUser/userLogin")
    },
    processLogin: (req, res) => {
        res.send(req.body)
    },
    register: (req, res) => {
       res.render("finalUser/userRegister")
    }, 
    processRegister: (req, res) => {
        res.send(req.body)
    },
    logout: (req, res) => {
        res.send("Logout")
    },
    profile: (req, res) => {
       res.render("finalUser/userProfile")
    },
}