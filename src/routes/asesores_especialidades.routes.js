import { Router } from "express";
import {
    crearAsesorEspecialidad,
    eliminarAsesor_Especialidad,
} from "../controllers/asesores_especialidades.controller.js";

export const asesoresespecialidadesRouter = Router();
asesoresespecialidadesRouter.post("/asesor_especialidad", crearAsesorEspecialidad);
asesoresespecialidadesRouter.delete("/asesor_especialidad", eliminarAsesor_Especialidad);
