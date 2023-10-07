import { Router } from "express";
import {
    crearEstado,
    listarEstados,
    // traerEstadoPorId,
    actualizarEstado,
    eliminarEstado,
} from "../controllers/estado_articulo.controller.js";

export const estadoArticuloRouter = Router();
estadoArticuloRouter.post("/estado_articulo", crearEstado);
estadoArticuloRouter.get("/estado_articulo", listarEstados);
// estadoArticuloRouter.get("/estado_articulo/:id", traerEstadoPorId);

estadoArticuloRouter.put("/estado_articulo/:id", actualizarEstado);

estadoArticuloRouter.delete("/estado_articulo/:id", eliminarEstado);