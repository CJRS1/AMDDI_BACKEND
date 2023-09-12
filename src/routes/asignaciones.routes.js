import { Router } from "express";
import {
    crearAsignaciones,
    eliminarAsignaciones,
    editarAsignaciones,
    editarAsignacionesUsuarios,
    crearAsignacionesSec,
} from "../controllers/asignaciones.controller.js";

export const asignacionesRouter = Router();
asignacionesRouter.post("/asignaciones/:id_asesor/:id_usuarios", crearAsignaciones);
asignacionesRouter.post("/asignaciones_sec/:id_asesor/:id_usuarios", crearAsignacionesSec);
asignacionesRouter.delete("/asignaciones", eliminarAsignaciones);
asignacionesRouter.put("/asignaciones", editarAsignaciones);
asignacionesRouter.put("/asignaciones", editarAsignacionesUsuarios);
