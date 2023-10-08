import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const prisma = new PrismaClient();

// Obtén la ruta del archivo actual (similar a __dirname en módulos CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const crearPDFURL = async (req, res) => {
    console.log("Entro aquí");
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

        const fecha_pago = new Date();
        console.log(fecha_pago);
        console.log(fecha_pago);
        console.log(fecha_pago);
        const fechaPagoFormateada = `${fecha_pago.getDate() - 1}/${fecha_pago.getMonth() + 1}/${fecha_pago.getFullYear()}`;

        // Obtén el nombre único del archivo subido desde req.file.filename
        const archivoSubido = req.file;
        if (!archivoSubido) {
            return res.status(400).json({ msg: "Debes subir un archivo PDF" });
        }

        // Genera una URL basada en el nombre único del archivo
        const pdfUrl = `/uploads/pdfs/${archivoSubido.filename}`;

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


export const actualizarPDFURL = async (req, res) => {
    console.log("Entro aquí");
    try {
        const { id } = req.params;
        console.log(id);
        const archivoSubido = req.file;
        if (!archivoSubido) {
            return res.status(400).json({ msg: "Debes subir un archivo PDF" });
        }

        // Genera una URL basada en el nombre único del archivo
        const pdfUrl = `/uploads/pdfs/${archivoSubido.filename}`;

        // Actualiza el registro en la base de datos con la nueva URL del archivo
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
            msg: "PDF actualizado y URL generada correctamente",
            usuarioPDFURL,
            pdfUrl,
            downloadLink: `${req.protocol}://${req.get("host")}${pdfUrl}`, // Genera un enlace de descarga absoluto
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al actualizar el PDF y generar la URL" });
    }
};


export const descargarPDF = async (req, res) => {
    try {
        const { nombreArchivo } = req.params;
        console.log(nombreArchivo);
        const rutaArchivo = path.join(__dirname, '..', '..', 'uploads', 'pdfs', nombreArchivo);
        console.log(rutaArchivo);
        console.log('Ruta del archivo:', rutaArchivo); // Agregar registro de depuración

        // Enviar el archivo al cliente para descargar
        res.download(rutaArchivo, (err) => {
            if (err) {
                console.error('Error al descargar el archivo:', err); // Agregar registro de depuración
                res.status(500).json({ msg: 'Error al descargar el archivo' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al descargar el archivo' });
    }
};

export const eliminarLink = async (req, res) => {
    const { id } = req.params;
    console.log("entró aquí eliminar link");
    try {
        const findUsuario = await prisma.pdf_url.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!findUsuario) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        await prisma.pdf_url.delete({
            where: {
                id: Number(id),
            },
        });
        return res.status(200).json({
            message: "Usuario eliminado",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
};