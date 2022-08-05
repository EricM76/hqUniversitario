module.exports = {
    presentation : (req,res) => {
        return res.render('coursePresentation')
    },
    content : (req,res) => {
        return res.render('courseContent')
    }
}