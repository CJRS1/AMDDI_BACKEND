import { Router } from "express";
import {
    crearUsuario,
    listarUsuarios,
    traerUsuarioPorDNI,
    actualizarUsuario,
    eliminarUsuario,
    obtenerUsuariosConServicios,
    verificationCode ,
} from "../controllers/usuarios.controller.js";

export const usuariosRouter = Router();
usuariosRouter.post("/user_t", crearUsuario);
usuariosRouter.post("/verificacion", verificationCode );
usuariosRouter.get("/usuarios", listarUsuarios);
usuariosRouter.get("/usuarios/:dni", traerUsuarioPorDNI);
usuariosRouter.put("/usuarios/:id", actualizarUsuario);
usuariosRouter.delete("/usuarios/:id", eliminarUsuario);
usuariosRouter.get("/usuarios_con_servicio", obtenerUsuariosConServicios);