import { Router } from "express";
import {
    crearAsesor,
    listarAsesores,
    traerAsesorPorId,
    actualizarAsesor,
    eliminarAsesor,
} from "../controllers/asesores.controller.js";

export const asesoresRouter = Router();
asesoresRouter.post("/asesores", crearAsesor);
asesoresRouter.get("/asesores", listarAsesores);
asesoresRouter.get("/asesores/:id", traerAsesorPorId);
asesoresRouter.put("/asesores/:id", actualizarAsesor);
asesoresRouter.delete("/asesores/:id", eliminarAsesor);
