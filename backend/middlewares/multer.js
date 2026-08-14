import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir),
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null, uniqueName + path.extname(file.originalname)
        )
    }
})

// file filter

const fileFilter = (req,file,cb) =>{
        if(
            file.mimetype === "image/png" || 
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/webp" 
        ){
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"), false);
        }
}

// multer config
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
})

export default upload;