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
    }
}