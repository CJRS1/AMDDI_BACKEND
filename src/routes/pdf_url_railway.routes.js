import { Router } from "express";
import {
    uploadFile,
    listFiles,
    deleteFile
} from "../controllers/pdf_url_railway.controller.js";

export const fileRouter = Router();

fileRouter.post("/upload", uploadFile);
fileRouter.get("/list", listFiles);
fileRouter.delete("/delete", deleteFile);


