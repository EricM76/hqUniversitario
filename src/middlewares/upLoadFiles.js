const path = require('path');
const multer = require('multer');

let storageCourse = multer.diskStorage({
    destination : (req,file,cb) => {
        switch (file.fieldname) {
            case 'note':
                cb(null, 'src/assets/downloads')
                break;
            case 'video':
                cb(null, 'public/videos')
                break;
            case 'image':
                cb(null, 'public/images/courses')
                break;
        }
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }})

let storageLogos = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images/logos')
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const filters = (req,file, cb) => {
    switch (file.fieldname) {
        case 'note':
            if(!file.originalname.match(/\.(pdf)$/)){
                req.fileValidationError = "Solo se permiten pdf";
                console.log(req.fileValidationError)
                return cb(null,false,req.fileValidationError);
            }
            cb(null,true);
            break;
        case 'video':
            if(!file.originalname.match(/\.(mp4)$/)){
                req.fileValidationError = "Solo se permite videos mp4";
                console.log(req.fileValidationError)
                return cb(null,false,req.fileValidationError);
            }
            cb(null,true);
            break;
        case 'image':
            if(!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)){
                req.fileValidationError = "Solo se permite imágenes";
                console.log(req.fileValidationError)
                return cb(null,false,req.fileValidationError);
            }
            cb(null,true);
            break;
    }
}

const fileFilterImages = function(req, file,callback) {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)){
        req.fileValidationError = "Solo se permite imágenes";
        console.log(req.fileValidationError)
        return callback(null,false,req.fileValidationError);
    }
    callback(null,true);
}


const uploadLogos =  multer({
    storage : storageLogos,
    fileFilter: fileFilterImages,
});

const uploadCourse = multer({
    storage : storageCourse,
    fileFilter :filters

})


module.exports = {
    uploadLogos,
    uploadCourse
}