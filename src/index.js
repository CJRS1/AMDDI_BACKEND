import express, { json } from "express";
import { usuariosRouter } from "./routes/usuarios.routes.js";
import { adminsRouter } from "./routes/admins.routes.js";
import { asesoresRouter } from "./routes/asesores.routes.js";
import { especialidadesRouter } from "./routes/especialidades.routes.js";
import { serviciosRouter } from "./routes/servicios.routes.js";
import { asesoresespecialidadesRouter } from "./routes/asesores_especialidades.routes.js"
import { usuariosserviciosRouter } from "./routes/usuarios_servicios.routes.js"
import { asignacionesRouter } from "./routes/asignaciones.routes.js";

const server = express();
server.use(json());
const PORT = process.env.PORT ?? 5000;

server.use(usuariosRouter);
server.use(adminsRouter);
server.use(asesoresRouter);
server.use(especialidadesRouter);
server.use(serviciosRouter);
server.use(asesoresespecialidadesRouter);
server.use(usuariosserviciosRouter);
server.use(asignacionesRouter);


server.listen(PORT, () => {
    console.log(`Conectado al servidor ${PORT}`);
})

// server.route('/')
//         .get( (req, res) => {
//             res.status(200).json({
//                 message:'Se contectó correctamente'
//             });
//         })

