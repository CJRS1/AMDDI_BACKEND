import express from 'express';
import { Router } from "express";
import {
    uploadFile,
    listFiles,
    deleteFile
} from "../controllers/pdf_url_railway.controller.js";


const saveDirectory = getSaveDirectory();

function getSaveDirectory() {
    const railwayVolumeMountPath = process.env.RAILWAY_VOLUME_MOUNT_PATH;
    console.log("Está realizando el getSaveDirectory", railwayVolumeMountPath);

    return railwayVolumeMountPath
        ? railwayVolumeMountPath
        : path.join(import.meta.url, 'files');
}

export const fileRouter = Router();

fileRouter.post("/upload/:id", uploadFile);
fileRouter.get("/list", listFiles);
fileRouter.delete("/delete", deleteFile);
fileRouter.use("/files", express.static(saveDirectory, { index: false }));
console.log("Usando el storage: " + saveDirectory);

