import express, { json } from "express";
import cors from 'cors';
import session from 'express-session';

import { setCSPHeader } from "./middleware/cspMiddleware.js"; // Importa el middleware CSP

import { usuariosRouter } from "./routes/usuarios.routes.js";
import { adminsRouter } from "./routes/admins.routes.js";
import { asesoresRouter } from "./routes/asesores.routes.js";
import { especialidadesRouter } from "./routes/especialidades.routes.js";
import { serviciosRouter } from "./routes/servicios.routes.js";
import { asesoresespecialidadesRouter } from "./routes/asesores_especialidades.routes.js"
import { usuariosserviciosRouter } from "./routes/usuarios_servicios.routes.js"
import { asignacionesRouter } from "./routes/asignaciones.routes.js";
import { montoRouter } from "./routes/monto.routes.js";
import { pdf_urlRouter } from "./routes/pdf_url.routes.js";
import { estadoTesisRouter } from "./routes/estado_tesis.routes.js";
import { estadoObservacionRouter } from "./routes/estado_observacion.routes.js";
import { emailRouter } from "./routes/email.routes.js";

const server = express();

server.use(json());
server.use(cors());

server.use(setCSPHeader);


// Después de server.use(cors());
//origin: ['http://localhost:3000', 'http://localhost:3001']
server.use(cors({
  origin: ['https://amddi.com', 'https://www.amddi.com'], // Reemplaza con el origen correcto de tu aplicación de frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

//ESTO SERVIRÁ PARA CUANDO SE LLEVE A PRODUCCIÓN
// const allowedOrigins = ['https://tu-dominio.com', 'https://www.tu-dominio.com'];
// app.use(cors({
//     origin: function (origin, callback) {
//         if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     }
// }));


server.use(
  session({
    secret: process.env.SESSION_SECRET, // Cambia esto a una cadena secreta segura
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Cambia esto según tus necesidades
      maxAge: 1000 * 60 * 60 * 24, // Duración de la sesión (en milisegundos), cambia según tus necesidades
    },
  })
);


const PORT = process.env.PORT ?? process.env.PORT2;

server.use(usuariosRouter);
server.use(adminsRouter);
server.use(asesoresRouter);
server.use(especialidadesRouter);
server.use(serviciosRouter);
server.use(asesoresespecialidadesRouter);
server.use(usuariosserviciosRouter);
server.use(asignacionesRouter);
server.use(montoRouter);
server.use(estadoTesisRouter);
server.use(estadoObservacionRouter);
server.use(pdf_urlRouter);
server.use(emailRouter);


server.listen(PORT, () => {
  console.log(`Servidor HTTPS en el puerto: ${PORT}`);
})

