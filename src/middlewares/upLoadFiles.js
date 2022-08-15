const path = require('path');
const multer = require('multer');


let storageLogos = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images/logos')
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }

})

const fileFilter = function(req, file,callback) {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)){
        req.fileValidationError = "Solo se permite imágenes";
        console.log(req.fileValidationError)
        return callback(null,false,req.fileValidationError);
    }
    callback(null,true);

}

const uploadLogos =  multer({
    storage : storageLogos,
    fileFilter
})


module.exports = {
    uploadLogos
}