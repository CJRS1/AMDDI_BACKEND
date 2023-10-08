import express from "express";
import { Router } from "express";
import {
    uploadFile,
    listFiles,
    deleteFile
} from "../controllers/pdf_url_railway.controller.js";

console.log("Aquí es la ruta", process.env.RAILWAY_VOLUME_MOUNT_PATH);

export const fileRouter = Router();

fileRouter.post("/upload", uploadFile);
fileRouter.get("/list", listFiles);
fileRouter.delete("/delete", deleteFile);


const saveDirectory = getSaveDirectory();
// Reemplaza esto con la ubicación de tus archivos estáticos.

function getSaveDirectory() {
    const railwayVolumeMountPath = process.env.RAILWAY_VOLUME_MOUNT_PATH;
    console.log("Está realizando el getSaveDirectory", railwayVolumeMountPath);

    return railwayVolumeMountPath
        ? railwayVolumeMountPath
        : path.join(import.meta.url, 'files');
}


// Usar express.static para servir archivos estáticos en la ruta /files
fileRouter.use("/files", express.static(saveDirectory, { index: false }));