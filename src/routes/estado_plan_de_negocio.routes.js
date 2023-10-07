import { Router } from "express";
import {
    crearEstado,
    listarEstados,
    // traerEstadoPorId,
    actualizarEstado,
    eliminarEstado,
} from "../controllers/estado_plan_de_negocio.controller.js";

export const estadoPlanNegocioRouter = Router();
estadoPlanNegocioRouter.post("/estado_plan_de_negocio", crearEstado);
estadoPlanNegocioRouter.get("/estado_plan_de_negocio", listarEstados);
// estadoPlanNegocioRouter.get("/estado_plan_de_negocio/:id", traerEstadoPorId);

estadoPlanNegocioRouter.put("/estado_plan_de_negocio/:id", actualizarEstado);

estadoPlanNegocioRouter.delete("/estado_plan_de_negocio/:id", eliminarEstado);