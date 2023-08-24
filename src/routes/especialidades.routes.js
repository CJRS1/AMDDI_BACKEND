import { Router } from "express";
import {
    crearEspecialidad,
    listarEspecialidades,
    traerEspecialidadPorId,
    actualizarEspecialidad,
    eliminarEspecialidad,
} from "../controllers/especialidades.controller.js";

export const especialidadesRouter = Router();
especialidadesRouter.post("/especialidades", crearEspecialidad);
especialidadesRouter.get("/especialidades", listarEspecialidades); 
especialidadesRouter.get("/especialidads/:id", traerEspecialidadPorId);
especialidadesRouter.put("/especialidads/:id", actualizarEspecialidad);
especialidadesRouter.delete("/especialidads/:id", eliminarEspecialidad);