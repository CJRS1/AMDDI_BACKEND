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

especialidadesRouter.get("/especialidades/:id", traerEspecialidadPorId);

especialidadesRouter.put("/especialidades/:id", actualizarEspecialidad);
especialidadesRouter.delete("/especialidades/:id", eliminarEspecialidad);