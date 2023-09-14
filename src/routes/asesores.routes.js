import { Router } from "express";
import {
    crearAsesor,
    listarAsesores,
    traerAsesorPorId,
    actualizarAsesor,
    eliminarAsesor,
    obtenerAsesoresConAsignados,
    traerUltimoAsesor,
    traerAsesorPorEspecialidad,
    loginA,
    logoutA,
} from "../controllers/asesores.controller.js";

export const asesoresRouter = Router();
asesoresRouter.post("/asesores", crearAsesor);
asesoresRouter.post("/loginA", loginA);
asesoresRouter.post("/logoutA", logoutA);

asesoresRouter.get("/asesores", listarAsesores);
asesoresRouter.get("/asesores/:id", traerAsesorPorId);
asesoresRouter.get("/asesores_usuarios", obtenerAsesoresConAsignados);
asesoresRouter.get("/ultimo_asesor", traerUltimoAsesor);
asesoresRouter.get("/asesor/:especialidad", traerAsesorPorEspecialidad);

asesoresRouter.put("/asesores/:id", actualizarAsesor);

asesoresRouter.delete("/asesores/:id", eliminarAsesor);
