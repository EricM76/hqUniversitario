module.exports = {
    home : (req,res) => {
        return res.render('home')
    },
    admin : (req,res) => {
        return res.render('admin/index')
    }
}