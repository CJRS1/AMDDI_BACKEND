import { Router } from "express";
import {
    crearEstado,
    listarEstados,
    // traerEstadoPorId,
    actualizarEstado,
    eliminarEstado,
} from "../controllers/estado_informe_de_practicas.controller.js";

export const estadoInformePracticasRouter = Router();
estadoInformePracticasRouter.post("/estado_informe_de_practicas", crearEstado);
estadoInformePracticasRouter.get("/estado_informe_de_practicas", listarEstados);
// estadoInformePracticasRouter.get("/estado_informe_de_practicas/:id", traerEstadoPorId);

estadoInformePracticasRouter.put("/estado_informe_de_practicas/:id", actualizarEstado);

estadoInformePracticasRouter.delete("/estado_informe_de_practicas/:id", eliminarEstado);