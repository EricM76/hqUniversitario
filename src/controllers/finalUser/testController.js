module.exports = {
    index: (req, res) => {
        res.render("finalUser/test",{session:req.session,})
    }
}