import express, {json} from "express";
import { usuariosRouter } from "./routes/usuarios.routes.js";
import { adminsRouter } from "./routes/admins.routes.js";
import { asesoresRouter } from "./routes/asesores.routes.js";


const server = express();
server.use(json());
const PORT = process.env.PORT ?? 5000;

server.use(usuariosRouter);
server.use(adminsRouter);
server.use(asesoresRouter);

server.listen(PORT,() => {
    console.log(`Conectado al servidor ${PORT}`);
})

// server.route('/')
//         .get( (req, res) => {
//             res.status(200).json({
//                 message:'Se contectó correctamente'
//             });
//         })

