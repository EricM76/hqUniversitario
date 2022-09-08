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
    }
}