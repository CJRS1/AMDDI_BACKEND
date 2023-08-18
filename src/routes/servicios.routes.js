import { Router } from "express";
import {
    crearServicio,
    listarServicios,
} from "../controllers/servicios.controller.js";

export const serviciosRouter = Router();
serviciosRouter.post("/servicios", crearServicio);
serviciosRouter.get("/servicios", listarServicios);