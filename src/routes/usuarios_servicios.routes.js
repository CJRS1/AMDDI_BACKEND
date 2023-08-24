import { Router } from "express";
import {
    crearUsuario_Servicio,
    eliminarUsuario_Servicio,
} from "../controllers/usuarios_servicios.controller.js";

export const usuariosserviciosRouter = Router();
usuariosserviciosRouter.post("/usuario_servicio", crearUsuario_Servicio);
usuariosserviciosRouter.delete("/usuario_servicio", eliminarUsuario_Servicio);
