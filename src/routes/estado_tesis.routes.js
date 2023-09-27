import { Router } from "express";
import {
    crearEstado,
    listarEstados,
    // traerEstadoPorId,
    actualizarEstado,
    eliminarEstado,
} from "../controllers/estado_tesis.controller.js";

export const estadoTesisRouter = Router();
estadoTesisRouter.post("/estado_tesis", crearEstado);
estadoTesisRouter.get("/estado_tesis", listarEstados);
// estadoTesisRouter.get("/estado_tesis/:id", traerEstadoPorId);

estadoTesisRouter.put("/estado_tesis/:id", actualizarEstado);

estadoTesisRouter.delete("/estado_tesis/:id", eliminarEstado);