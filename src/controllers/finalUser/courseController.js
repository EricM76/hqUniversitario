module.exports = {
    presentation: (req, res) => {
        res.render("finalUser/coursePresentation");
    },
    content: (req, res) => {
        res.render("finalUser/courseContent");
    }
}