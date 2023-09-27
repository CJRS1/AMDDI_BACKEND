import { Router } from "express";
import {
    crearEstado,
    listarEstados,
    // traerEstadoPorId,
    actualizarEstado,
    eliminarEstado,
} from "../controllers/estado_observacion.controller.js";

export const estadoObservacionRouter = Router();
estadoObservacionRouter.post("/estado_observacion", crearEstado);

estadoObservacionRouter.get("/estado_observacion", listarEstados);
// estadoObservacionRouter.get("/estado_observacion/:id", traerEstadoPorId);

estadoObservacionRouter.put("/estado_observacion/:id", actualizarEstado);

estadoObservacionRouter.delete("/estado_observacion/:id", eliminarEstado);