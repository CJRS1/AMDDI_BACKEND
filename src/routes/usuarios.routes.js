import { Router } from "express";
import {
    crearUsuario,
    listarUsuarios,
    traerUsuarioPorDNI,
    actualizarUsuario,
    eliminarUsuario,
    obtenerUsuariosConServicios,
    verificationCode,
    loginUser,
    logoutUser,
    traerUsuarioPorEmail, 
    obtenerServicioPorEmail,
    sendVerificationCode,
    verificationCodeCC,
    actualizarUsuarioCC,
    traerUsuarioPorToken

} from "../controllers/usuarios.controller.js";

export const usuariosRouter = Router();
usuariosRouter.post("/user_t", crearUsuario);
usuariosRouter.post("/login", loginUser);
usuariosRouter.post("/logout", logoutUser);
usuariosRouter.post("/verificacion", verificationCode );
usuariosRouter.post("/cv_por_email/:email", sendVerificationCode);
usuariosRouter.post("/verificar_code/:email", verificationCodeCC);

usuariosRouter.get("/usuarios", listarUsuarios);
usuariosRouter.get("/usuarios/:dni", traerUsuarioPorDNI);
usuariosRouter.get("/usuario_por_email/:email", traerUsuarioPorEmail);
usuariosRouter.get("/servicio_por_email/:email", obtenerServicioPorEmail);
usuariosRouter.get("/usuarios_con_servicio", obtenerUsuariosConServicios);
usuariosRouter.get("/usuario", traerUsuarioPorToken);

usuariosRouter.put("/usuarios/:id", actualizarUsuario);
usuariosRouter.put("/usuario/:email", actualizarUsuarioCC);

usuariosRouter.delete("/usuarios/:id", eliminarUsuario);