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
        const userPromise = db.User.findOne({where: {email: userEmail}})
        const usersReferredPromise = db.Referred.findAll({where: {userId: req.session.user.id}})
        Promise.all([userPromise, usersReferredPromise])
        .then(([userPromise, usersReferredPromise]) => {
            let userIsRegister = userPromise !== null;
            let referredUsers = usersReferredPromise.map(item => item.email);
            let userIsReferred = referredUsers.includes(userEmail);

            switch (true) {
                case userIsRegister :
                    return res.json({state: true, message: "Usuario ya registrado"});
                case userIsReferred :
                    return res.json({state: true, message: "Usuario ya referido"});
                default:
                    return res.json({state: false, message: ""});
            }
        })
        .catch(err => console.log(err))
    }
}