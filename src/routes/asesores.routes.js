import { Router } from "express";
import {
    crearAsesor,
} from "../controllers/asesores.controller.js";

export const asesoresRouter = Router();
asesoresRouter.post("/asesores", crearAsesor);
