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


