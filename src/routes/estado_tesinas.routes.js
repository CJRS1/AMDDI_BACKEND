import { Router } from "express";
import {
    crearEstado,
    listarEstados,
    // traerEstadoPorId,
    actualizarEstado,
    eliminarEstado,
} from "../controllers/estado_tesinas.controller.js";

export const estadoTesinasRouter = Router();
estadoTesinasRouter.post("/estado_tesinas", crearEstado);
estadoTesinasRouter.get("/estado_tesinas", listarEstados);
// estadoTesinasRouter.get("/estado_tesinas/:id", traerEstadoPorId);

estadoTesinasRouter.put("/estado_tesinas/:id", actualizarEstado);

estadoTesinasRouter.delete("/estado_tesinas/:id", eliminarEstado);