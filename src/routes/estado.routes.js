import { Router } from "express";
import {
    crearEstado,
    listarEstados,
    // traerEstadoPorId,
    actualizarEstado,
    eliminarEstado,
} from "../controllers/estado.controller.js";

export const estadoRouter = Router();
estadoRouter.post("/estado", crearEstado);
estadoRouter.get("/estado", listarEstados);
// estadoRouter.get("/estado/:id", traerEstadoPorId);

estadoRouter.put("/estado/:id", actualizarEstado);

estadoRouter.delete("/estado/:id", eliminarEstado);