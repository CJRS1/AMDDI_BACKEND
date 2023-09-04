import { Router } from "express";
import {
    crearAsignaciones,
    eliminarAsignaciones,
    editarAsignaciones,
    editarAsignacionesUsuarios,
} from "../controllers/asignaciones.controller.js";

export const asignacionesRouter = Router();
asignacionesRouter.post("/asignaciones/:id_asesor/:id_usuarios", crearAsignaciones);
asignacionesRouter.delete("/asignaciones", eliminarAsignaciones);
asignacionesRouter.put("/asignaciones", editarAsignaciones);
asignacionesRouter.put("/asignaciones", editarAsignacionesUsuarios);
