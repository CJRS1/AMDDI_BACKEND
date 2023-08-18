import { Router } from "express";
import {
    crearAsesor,
    listarAsesores,
} from "../controllers/asesores.controller.js";

export const asesoresRouter = Router();
asesoresRouter.post("/asesores", crearAsesor);
asesoresRouter.get("/asesores", listarAsesores);
