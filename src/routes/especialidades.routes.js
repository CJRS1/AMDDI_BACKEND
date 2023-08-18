import { Router } from "express";
import {
    crearEspecialidad,
    listarEspecialidades,
} from "../controllers/especialidades.controller.js";

export const especialidadesRouter = Router();
especialidadesRouter.post("/especialidades", crearEspecialidad);
especialidadesRouter.get("/especialidades", listarEspecialidades); 