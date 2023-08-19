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
especialidadsRouter.get("/especialidads/:id", traerEspecialidadPorId);
especialidadsRouter.put("/especialidads/:id", actualizarEspecialidad);
especialidadsRouter.delete("/especialidads/:id", eliminarEspecialidad);