import multer from "multer"


import path, { dirname } from 'node:path'
import { fileURLToPath } from "node:url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload/admin')
    },
    // destination: path.join(__dirname, "./upload",'employee','cover_images'),
    filename: (req, file, cb) => {
        let name = file.originalname.replace(/\s\s+/g, ' ');
        name = name.replace(/[&\/\\#, +()$~%'":=*?<>{}@-]/g, '_');
        cb(null, Date. now() + "_" + name)

    }
})

const fileFilterConfig = (req, file, cb) => {
    if ( file. mimetype === "image/png" ||  file. mimetype === "image/jpg") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilterConfig,
});
export { upload };





// cv upload

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storages = multer.diskStorage({
    // destination: (req, file, cb) => {
    //     cb(null, './upload/userCv/files')
    // },
    destination: path.join(__dirname, "./upload"),
    filename: (req, file, cb) => {
        let name = file.originalname.replace(/\s\s+/g, ' ');
        name = name.replace(/[&\/\\#, +()$~%'":=*?<>{}@-]/g, '_');
        cb(null, Date. now() + "_" + name)

    }
})


const fileFilterConfigs= (req, file, cb) => {
    if (  file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const uploads = multer({ 
    storage: storages,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilterConfigs,
});
export { uploads };