import { Router } from "express";
import {
    crearUsuario_Servicio,
    eliminarUsuario_Servicio,
    editarUsuarioServicio,
    crearEstadoUsuario
} from "../controllers/usuarios_servicios.controller.js";

export const usuariosserviciosRouter = Router();
usuariosserviciosRouter.post("/usuario_servicio", crearUsuario_Servicio);

usuariosserviciosRouter.put("/usuario_servicio/:id_usuario/:id_servicio", editarUsuarioServicio);

usuariosserviciosRouter.put("/usuario_servicio_estado/:idUsuario/:idServicio", crearEstadoUsuario);

usuariosserviciosRouter.delete("/usuario_servicio/:id", eliminarUsuario_Servicio);
