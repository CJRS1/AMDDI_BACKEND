import { Router } from "express";
import {
    crearAdmin,
    listarAdmins,
    traerAdminPorId,
    actualizarAdmin,
    eliminarAdmin,
} from "../controllers/admins.controller.js";

export const adminsRouter = Router();
adminsRouter.post("/admins", crearAdmin);
adminsRouter.get("/admins", listarAdmins);
adminsRouter.get("/admins/:id", traerAdminPorId);
adminsRouter.put("/admins/:id", actualizarAdmin);
adminsRouter.delete("/admins/:id", eliminarAdmin);