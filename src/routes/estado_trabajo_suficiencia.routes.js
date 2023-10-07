import { Router } from "express";
import {
    crearEstado,
    listarEstados,
    // traerEstadoPorId,
    actualizarEstado,
    eliminarEstado,
} from "../controllers/estado_trabajo_suficiencia.controller.js";

export const estadoTrabajoSuficienciaRouter = Router();
estadoTrabajoSuficienciaRouter.post("/estado_trabajo_suficiencia", crearEstado);
estadoTrabajoSuficienciaRouter.get("/estado_trabajo_suficiencia", listarEstados);
// estadoTrabajoSuficienciaRouter.get("/estado_trabajo_suficiencia/:id", traerEstadoPorId);

estadoTrabajoSuficienciaRouter.put("/estado_trabajo_suficiencia/:id", actualizarEstado);

estadoTrabajoSuficienciaRouter.delete("/estado_trabajo_suficiencia/:id", eliminarEstado);