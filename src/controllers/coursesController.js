module.exports = {
    add : (req,res) => {
        return res.render('admin/courseAdd')
    },
    store : (req,res) => {

    },
    list : (req,res) => {
        return res.render('admin/courses')

    },
    detail : (req,res) => {
        return res.render('admin/courseDetail')
    },
    edit : (req,res) => {
        return res.render('admin/courseEdit')
    },
    update : (req,res) => {

    },
    remove : (req,res) => {

    },
    search : (req,res) => {

    },
    filter : (req,res) => {
        
    },
    presentation : (req,res) => {
        return res.render('coursePresentation')
    },
    content : (req,res) => {
        return res.render('courseContent')
    }
}