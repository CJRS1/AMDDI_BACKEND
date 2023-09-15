import { Router } from "express";
import {
    crearAsesor,
    listarAsesores,
    traerAsesorPorId,
    traerAsesorPorEmail,
    actualizarAsesor,
    eliminarAsesor,
    obtenerAsesoresConAsignados,
    traerUltimoAsesor,
    traerAsesorPorEspecialidad,
    loginA,
    logoutA,
    traerAsesorPorToken
} from "../controllers/asesores.controller.js";

export const asesoresRouter = Router();
asesoresRouter.post("/asesores", crearAsesor);
asesoresRouter.post("/loginA", loginA);
asesoresRouter.post("/logoutA", logoutA);

asesoresRouter.get("/asesores", listarAsesores);
asesoresRouter.get("/asesores/:id", traerAsesorPorId);
asesoresRouter.get("/asesoress/:email", traerAsesorPorEmail);
asesoresRouter.get("/asesores_usuarios", obtenerAsesoresConAsignados);
asesoresRouter.get("/ultimo_asesor", traerUltimoAsesor);
asesoresRouter.get("/asesor/:especialidad", traerAsesorPorEspecialidad);
asesoresRouter.get("/asesor", traerAsesorPorToken);

asesoresRouter.put("/asesores/:id", actualizarAsesor);

asesoresRouter.delete("/asesores/:id", eliminarAsesor);
