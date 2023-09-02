import { Router } from "express";
import {
    crearServicio,
    listarServicios,
    traerServicioPorId,
    actualizarServicio,
    eliminarServicio,
} from "../controllers/servicios.controller.js";

export const serviciosRouter = Router();
serviciosRouter.post("/servicios", crearServicio);
serviciosRouter.get("/servicios", listarServicios);
serviciosRouter.get("/servicios/:id", traerServicioPorId);

serviciosRouter.put("/servicios/:id", actualizarServicio);

serviciosRouter.delete("/servicios/:id", eliminarServicio);