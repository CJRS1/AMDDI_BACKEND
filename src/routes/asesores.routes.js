import { Router } from "express";
import {
    crearAsesor,
    listarAsesores,
    traerAsesorPorId,
    actualizarAsesor,
    eliminarAsesor,
    obtenerAsesoresConAsignados,
    traerUltimoAsesor,
    traerAsesorPorEspecialidad,
} from "../controllers/asesores.controller.js";

export const asesoresRouter = Router();
asesoresRouter.post("/asesores", crearAsesor);
asesoresRouter.get("/asesores", listarAsesores);
asesoresRouter.get("/asesores/:id", traerAsesorPorId);

asesoresRouter.get("/ultimo_asesor", traerUltimoAsesor);
asesoresRouter.get("/asesor/:especialidad", traerAsesorPorEspecialidad);

asesoresRouter.put("/asesores/:id", actualizarAsesor);
asesoresRouter.delete("/asesores/:id", eliminarAsesor);
asesoresRouter.get("/asesores_usuarios", obtenerAsesoresConAsignados);
