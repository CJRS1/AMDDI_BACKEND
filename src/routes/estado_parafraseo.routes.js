import { Router } from "express";
import {
    crearEstado,
    listarEstados,
    actualizarEstado,
    eliminarEstado,
} from "../controllers/estado_parafraseo.controller.js";

export const estadoParafraseoRouter = Router();
estadoParafraseoRouter.post("/estado_tesinas", crearEstado);
estadoParafraseoRouter.get("/estado_tesinas", listarEstados);
// estadoParafraseoRouter.get("/estado_tesinas/:id", traerEstadoPorId);

estadoParafraseoRouter.put("/estado_tesinas/:id", actualizarEstado);

estadoParafraseoRouter.delete("/estado_tesinas/:id", eliminarEstado);