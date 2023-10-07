import { Router } from "express";
import {
    crearEstado,
    listarEstados,
    // traerEstadoPorId,
    actualizarEstado,
    eliminarEstado,
} from "../controllers/estado_monografia.controller.js";

export const estadoMonografiaRouter = Router();
estadoMonografiaRouter.post("/estado_monografia", crearEstado);
estadoMonografiaRouter.get("/estado_monografia", listarEstados);
// estadoMonografiaRouter.get("/estado_monografia/:id", traerEstadoPorId);

estadoMonografiaRouter.put("/estado_monografia/:id", actualizarEstado);

estadoMonografiaRouter.delete("/estado_monografia/:id", eliminarEstado);