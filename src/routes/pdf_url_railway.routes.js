import express from 'express';
import { Router } from "express";
import {
    uploadFile,
    listFiles,
    deleteFile
} from "../controllers/pdf_url_railway.controller.js";
import slugify from 'slugify';
import crypto from 'crypto';
import multer from 'multer';
import path from 'path';



const saveDirectory = getSaveDirectory();

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


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const saveDirectory = getSaveDirectory();
        cb(null, saveDirectory);
    },
    filename: function (req, file, cb) {
        const filenameParsed = path.parse(file.originalname);
        newFilename =
            slugify(filenameParsed.name) + '-' + random(6) + filenameParsed.ext;
        cb(null, newFilename);
    },
});



const upload = multer({
    storage: storage,
})


export const fileRouter = Router();
fileRouter.post("/upload/:id", upload.single("file"), uploadFile);
fileRouter.get("/list", listFiles);
fileRouter.delete("/delete", deleteFile);
fileRouter.use("/files", express.static(saveDirectory, { index: false }));
console.log("Usando el storage: " + saveDirectory);

