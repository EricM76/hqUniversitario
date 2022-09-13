const db = require("../../../database/models");

module.exports = {
    universities: (req, res) => {
        db.University.findAll({
            include: [{association: "faculties"}]
        })
        .then(universities => {
            res.status(200).json(universities)
        })
        .catch(error => res.json(error))
    },
    careers: (req, res) => {
        const careerId = req.query.career;
        db.Career.findByPk(careerId, {
            include: ["courses", "faculty" ,"university"],
        })
        .then(career => {
            res.status(200).json(career)
        })
        .catch(error => res.json(error))
    },
    referred: (req, res) => {
        let userEmail = req.params.email
        db.Users.findOne(
            {
                where: {
                    email: userEmail
                }
            }).then((user) => {
                if(user){
                    res.status(200).json(true)
                }else{
                    res.status(400).json(false)
                }
            })
    }
}