import { Router } from "express";
import {
    crearAsignaciones,
    eliminarAsignaciones,
} from "../controllers/asignaciones.controller.js";

export const asignacionesRouter = Router();
asignacionesRouter.post("/asignaciones", crearAsignaciones);
asignacionesRouter.delete("/asignaciones", eliminarAsignaciones);
