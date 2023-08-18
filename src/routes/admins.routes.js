import { Router } from "express";
import {
    crearAdmin,
    listarAdmins,
} from "../controllers/admins.controller.js";

export const adminsRouter = Router();
adminsRouter.post("/admins", crearAdmin);
adminsRouter.get("/admins", listarAdmins);