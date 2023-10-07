import { Router } from "express";
import {
    crearEstado,
    listarEstados,
    // traerEstadoPorId,
    actualizarEstado,
    eliminarEstado,
} from "../controllers/estado_diapositivas.controller.js";

export const estadoDiapositivasRouter = Router();
estadoDiapositivasRouter.post("/estado_diapositivas", crearEstado);
estadoDiapositivasRouter.get("/estado_diapositivas", listarEstados);
// estadoDiapositivasRouter.get("/estado_diapositivas/:id", traerEstadoPorId);

estadoDiapositivasRouter.put("/estado_diapositivas/:id", actualizarEstado);

estadoDiapositivasRouter.delete("/estado_diapositivas/:id", eliminarEstado);