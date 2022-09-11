const db = require('../database/models');
const {validationResult} = require('express-validator')

module.exports = {
    home : (req,res) => {
        /* Obtener Banners */
        /* Obtener Universidades */
        /* Obtener Últimas materias agregadas */
        /* Obtener Materias populares */
        /* const getBanners = db.Banner.findAll(); */
        /*  const getMostPopularCourses = db.Course.findAll({
            
         }) */
        const getUniversities = db.University.findAll();
        const getLastestCourses = db.Course.findAll({
            where: {
                visible: true,
            },
            order: [["id", "DESC"]],
            limit: 10,
        });
        Promise.all([getUniversities, getLastestCourses])
        .then(([universities, lastestCourses]) => {
            return res.render("finalUser/home", {
                universities,
                lastestCourses,
                session: req.session,
            })
        })
    },
    admin : (req,res) => {
        return res.render('admin/index')
    },
    contact: (req, res) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            //Lógica de envio de email
            res.status(200).json({message: "Mensaje enviado correctamente"})
        } else {
            res.status(400).json({
                errores: errors.mapped(),
            })
        }
    }
}