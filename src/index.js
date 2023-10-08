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
import { estadoArticuloRouter } from "./routes/estado_articulo.routes.js";
import { estadoTesinasRouter } from "./routes/estado_tesinas.routes.js";
import { estadoTrabajoSuficienciaRouter } from "./routes/estado_trabajo_suficiencia.routes.js";
import { estadoPlanNegocioRouter } from "./routes/estado_plan_de_negocio.routes.js";
import { estadoMonografiaRouter } from "./routes/estado_monografia.routes.js";
import { estadoInformePracticasRouter } from "./routes/estado_informe_de_practicas.routes.js";
import { estadoDiapositivasRouter } from "./routes/estado_diapositivas.routes.js";
import { fileRouter } from "./routes/pdf_url_railway.routes.js"

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


// const PORT = process.env.PORT ?? process.env.PORT2;
const PORT = process.env.PORT ?? 5000;

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
server.use(estadoArticuloRouter);
server.use(estadoTesinasRouter);
server.use(estadoTrabajoSuficienciaRouter);
server.use(estadoPlanNegocioRouter);
server.use(estadoMonografiaRouter);
server.use(estadoInformePracticasRouter);
server.use(estadoDiapositivasRouter);
server.use(fileRouter);


server.listen(PORT, () => {
  console.log(`Servidor HTTPS en el puerto: ${PORT}`);
})


const express = require("express");
const slugify = require('slugify');
const crypto = require("crypto");
const multer = require('multer');
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

const saveDirectory = getSaveDirectory();

console.log("using storage location: " + saveDirectory);

app.use('/files', express.static(saveDirectory, { index: false }));

app.get("/", (_, res) => {
    res.send("Hello World!");
});

app.get("/health", (_, res) => {
    res.sendStatus(200);
});

app.post("/upload", (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.error(err);
            res.status(500).end("multer error occurred");
            return;
        } else if (err) {
            console.error(err);
            res.status(500).end("unknown error occurred");
            return;
        }

        if (!req.files) {
            res.status(400).end("no files were uploaded");
            return;
        }

        res.end("saved file(s)");
    });
});

app.get("/list", (_, res) => {
    const saveDirectory = getSaveDirectory();

    fs.readdir(saveDirectory, function (err, files) {
        if (err) {
            console.log('Unable to scan directory: ' + err);
            res.end("Unable to scan directory");
        }

        files.forEach(function (file) {
            if (file.startsWith(".") || file == "lost+found") {
                return;
            }

            res.write(file + "\n")
        });

        res.end();
    });

    return;
});

app.delete("/delete", (req, res) => {
    const file = req.query.file;

    if (!file) {
        res.status(400).send("no file query parameter found");
        return;
    }

    const filepath = path.join(getSaveDirectory(), file);

    try {
        fs.unlinkSync(filepath);
        res.send("File removed");
    } catch (err) {
        console.error("Unable to remove file: " + file + "\n" + err);
        res.status(500).send("Unable to remove file");
    }

    return;
});

app.listen(port, "::", () => {
    console.log(`Example app listening on port ${port}`)
});

function random(n) {
    return crypto.randomBytes(n / 2).toString('hex');
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, saveDirectory);
    },
    filename: function (req, file, cb) {
        const filenameParsed = path.parse(file.originalname);
        const newFilename = slugify(filenameParsed.name) + "-" + random(6) + filenameParsed.ext;

        cb(null, newFilename);
    }
});

const upload = multer({ storage: storage }).array();

function getSaveDirectory() {
    const railwayVolumeMountPath = process.env.RAILWAY_VOLUME_MOUNT_PATH;
    return (railwayVolumeMountPath) ? railwayVolumeMountPath : path.join(__dirname, "files");
}