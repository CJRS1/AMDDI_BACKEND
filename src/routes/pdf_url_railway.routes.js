import { Router } from "express";
import {
    uploadFile,
    listFiles,
    deleteFile
} from "../controllers/pdf_url_railway.controller.js";
import express from "express";

function getSaveDirectory() {
    const railwayVolumeMountPath = process.env.RAILWAY_VOLUME_MOUNT_PATH;
    console.log("Está realizando el getSaveDirectory", railwayVolumeMountPath);

    return railwayVolumeMountPath
        ? railwayVolumeMountPath
        : path.join(import.meta.url, 'files');
}

const saveDirectory = getSaveDirectory();

export const fileRouter = Router();

fileRouter.post("/upload", uploadFile);
fileRouter.get("/list", listFiles);
fileRouter.delete("/delete", deleteFile);
fileRouter.use("/files", express.static(saveDirectory, { index: false }));
console.log("using storage location: " + saveDirectory);