module.exports = {
    home : (req,res) => {
        return res.render('finalUser/home')
    },
    admin : (req,res) => {
        return res.render('admin/index')
    }
}