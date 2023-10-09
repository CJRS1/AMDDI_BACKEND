import { PrismaClient } from "@prisma/client";
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

const prisma = new PrismaClient();

function getSaveDirectory() {
    const railwayVolumeMountPath = process.env.RAILWAY_VOLUME_MOUNT_PATH;
    console.log("Está realizando el getSaveDirectory", railwayVolumeMountPath);

    return railwayVolumeMountPath
        ? railwayVolumeMountPath
        : path.join(import.meta.url, 'files');
}

export const uploadFile = async (req, res) => {
    console.log("Aquí esta en upload", process.env.RAILWAY_VOLUME_MOUNT_PATH);
    try {

        const { id } = req.params;

        const usuarioExiste = await prisma.usuario.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!usuarioExiste) {
            return res.status(400).json({ msg: "No existe el usuario" });
        }

        console.log("encontrò usuario");

        // Verifica si req.file no está definido
        if (!req.file) {
            res.status(400).end('No se cargó un archivo');
            return;
        }

        console.log("hoal", req.file.filename);
        const fileName = req.file.filename;

        const fecha_pago = new Date();
        fecha_pago.setHours(fecha_pago.getHours() - 5);

        const fechaPagoFormateada = `${fecha_pago.getDate()}/${fecha_pago.getMonth() + 1}/${fecha_pago.getFullYear()}`;
        console.log(fechaPagoFormateada);
        // Obtén el nombre único del archivo subido desde req.file.filename

        // Genera una URL basada en el nombre único del archivo
        // const pdfUrl = `/files/${newFilename}`;
        const pdfUrl = `/files/${fileName}`;
        console.log(pdfUrl);

        // Crea un registro en la base de datos con la URL del archivo
        const usuarioPDFURL = await prisma.pdf_url.create({
            data: {
                fecha_pdf_url: fechaPagoFormateada,
                usuarioId: parseInt(id),
                pdf_url: pdfUrl, // Almacena la URL en el campo pdf_url
            },
        });

        // Cambia la respuesta para que incluya un enlace de descarga
        res.json({
            msg: "PDF subido y URL generada correctamente",
            usuarioPDFURL,
            pdfUrl,
            downloadLink: `${req.protocol}://${req.get("host")}${pdfUrl}`, // Genera un enlace de descarga absoluto
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al subir el PDF y generar la URL" });
    }
};


export const listFiles = async (req, res) => {
    const saveDirectory = getSaveDirectory();
    try {
        const files = await fs.readdir(saveDirectory);

        for (const file of files) {
            if (file.startsWith(".") || file === "lost+found") {
                continue;
            }

            res.write(file + "\n");
        }

        res.end();
    } catch (err) {
        console.error('Unable to scan directory: ' + err);
        res.end("Unable to scan directory");
    }
};

// Resto de tu código para listar y eliminar archivos...
export const deleteFile = async (req, res) => {
    const file = req.query.file;

    if (!file) {
        res.status(400).send("no file query parameter found");
        return;
    }

    const filepath = path.join(getSaveDirectory(), file);

    try {
        await fs.unlink(filepath);
        res.send("File removed");
    } catch (err) {
        console.error("Unable to remove file: " + file + "\n" + err);
        res.status(500).send("Unable to remove file");
    }
};

export const updateFile = async (req, res) => {
    console.log("Aquí esta en upload", process.env.RAILWAY_VOLUME_MOUNT_PATH);
    try {

        const { id } = req.params;

        const usuarioExiste = await prisma.usuario.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!usuarioExiste) {
            return res.status(400).json({ msg: "No existe el usuario" });
        }

        console.log("encontrò usuario");

        // Verifica si req.file no está definido
        if (!req.file) {
            res.status(400).end('No se cargó un archivo');
            return;
        }

        console.log("hoal", req.file.filename);
        const fileName = req.file.filename;

        const fecha_pago = new Date();
        fecha_pago.setHours(fecha_pago.getHours() - 5);

        const fechaPagoFormateada = `${fecha_pago.getDate()}/${fecha_pago.getMonth() + 1}/${fecha_pago.getFullYear()}`;
        console.log(fechaPagoFormateada);
        // Obtén el nombre único del archivo subido desde req.file.filename

        // Genera una URL basada en el nombre único del archivo
        // const pdfUrl = `/files/${newFilename}`;
        const pdfUrl = `/files/${fileName}`;
        console.log(pdfUrl);

        // Crea un registro en la base de datos con la URL del archivo
        const usuarioPDFURL = await prisma.pdf_url.update({
            where: {
                id: Number(id),
            },
            data: {
                pdf_url: pdfUrl, // Actualiza la URL en el campo pdf_url
            },
        });

        // Cambia la respuesta para que incluya un enlace de descarga
        res.json({
            msg: "PDF subido y URL actualizadas",
            usuarioPDFURL,
            pdfUrl,
            downloadLink: `${req.protocol}://${req.get("host")}${pdfUrl}`, // Genera un enlace de descarga absoluto
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al subir el PDF y generar la URL" });
    }
}