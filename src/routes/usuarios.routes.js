import { Router } from "express";
import {
    crearUsuario,
} from "../controllers/usuarios.controller.js";

export const usuariosRouter = Router();
usuariosRouter.post("/usuarios", crearUsuario);