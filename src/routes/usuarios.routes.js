import { Router } from "express";
import {
    crearUsuario,
    listarUsuarios,
    traerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario,
} from "../controllers/usuarios.controller.js";

export const usuariosRouter = Router();
usuariosRouter.post("/usuarios", crearUsuario);
usuariosRouter.get("/usuarios", listarUsuarios);
usuariosRouter.get("/usuarios/:id", traerUsuarioPorId);
usuariosRouter.put("/usuarios/:id", actualizarUsuario);
usuariosRouter.delete("/usuarios/:id", eliminarUsuario);