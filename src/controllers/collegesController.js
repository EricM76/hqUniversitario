module.exports = {
    add : (req,res) => {
        return res.render('admin/collegeAdd')
    },
    store : (req,res) => {

    },
    list : (req,res) => {
        return res.render('admin/colleges')
    },
    detail : (req,res) => {
        return res.render('admin/collegeDetail')
    },
    edit : (req,res) => {
        return res.render('admin/collegeEdit')
    },
    update : (req,res) => {

    },
    remove : (req,res) => {

    },
    search : (req,res) => {

    },
    filter : (req,res) => {
        
    }
}