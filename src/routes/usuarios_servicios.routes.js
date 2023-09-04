import { Router } from "express";
import {
    crearUsuario_Servicio,
    eliminarUsuario_Servicio,
    editarUsuarioServicio,
} from "../controllers/usuarios_servicios.controller.js";

export const usuariosserviciosRouter = Router();
usuariosserviciosRouter.post("/usuario_servicio", crearUsuario_Servicio);
usuariosserviciosRouter.put("/usuario_servicio/:id_usuario/:id_servicio", editarUsuarioServicio);
usuariosserviciosRouter.delete("/usuario_servicio/:id", eliminarUsuario_Servicio);
