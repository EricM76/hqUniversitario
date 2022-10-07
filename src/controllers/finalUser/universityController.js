const db = require("../../database/models");

module.exports = {
    index: (req, res) => {
        const universityId = req.params.id;

        db.University.findByPk(universityId, {
            include: [
                {
                    association: "faculties", 
                    include: [ "careers",'university']
                }
            ]
        })
        .then((university) => {
            res.render("finalUser/university", {
                university,
                session:req.session,
            })
        })
    }
}