const path = require('path');
const multer = require('multer');


let storageLogos = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images/logos')
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }

});

let storageNotes = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'src/downloads')
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }

})

const fileFilterImages = function(req, file,callback) {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)){
        req.fileValidationError = "Solo se permite imágenes";
        console.log(req.fileValidationError)
        return callback(null,false,req.fileValidationError);
    }
    callback(null,true);
}

const fileFilterDocuments = function(req, file,callback) {
    if(!file.originalname.match(/\.(pdf|docx|doc)$/)){
        req.fileValidationError = "Solo documentos";
        console.log(req.fileValidationError)
        return callback(null,false,req.fileValidationError);
    }
    callback(null,true);

}

const uploadLogos =  multer({
    storage : storageLogos,
    fileFilter: fileFilterImages,
});

const upLoadNotes = multer({
    storage : storageNotes,
    fileFilter: fileFilterDocuments
})


module.exports = {
    uploadLogos,
    upLoadNotes
}