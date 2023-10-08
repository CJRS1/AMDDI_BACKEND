import { Router } from "express";
import express from "express";
import multer from 'multer'; // Importar multer antes de su uso
import slugify from 'slugify';
import path from 'path';
import crypto from 'crypto';
import {
    uploadFile,
    listFiles,
    deleteFile,
    updateFile
} from "../controllers/pdf_url_railway.controller.js";

function getSaveDirectory() {
    const railwayVolumeMountPath = process.env.RAILWAY_VOLUME_MOUNT_PATH;
    console.log("Está realizando el getSaveDirectory", railwayVolumeMountPath);

    return railwayVolumeMountPath
        ? railwayVolumeMountPath
        : path.join(import.meta.url, 'files');
}

function random(n) {
    return crypto.randomBytes(n / 2).toString('hex');
}

const saveDirectory = getSaveDirectory();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const saveDirectory = getSaveDirectory();
        cb(null, saveDirectory);
    },
    filename: function (req, file, cb) {
        const filenameParsed = path.parse(file.originalname);
        const newFilename =
            slugify(filenameParsed.name) + '-' + random(6) + filenameParsed.ext;
        cb(null, newFilename);
    },
});

const upload = multer({
    storage: storage,
})


export const fileRouter = Router();

fileRouter.post("/upload/:id",upload.single('file'),uploadFile);
fileRouter.post("/update/:id",upload.single('file'),updateFile);
fileRouter.get("/list", listFiles);
fileRouter.delete("/delete", deleteFile);
fileRouter.use("/files", express.static(saveDirectory, { index: false }));
console.log("using storage location: " + saveDirectory);