// Importa los módulos y funciones necesarios
import { Router } from "express";
import {
    crearPDFURL,
    descargarPDF,
    actualizarPDFURL,
    eliminarLink
} from "../controllers/pdf_url.controller.js";
import multer from "multer";
import { nanoid } from "nanoid";

// Configura multer para manejar la subida de archivos PDF
const volumeName = process.env.RAILWAY_VOLUME_MOUNT_PATH;

const storage = multer.diskStorage({
    destination: `${volumeName}`, // Establece la carpeta donde se guardarán los archivos subidos
    filename: (req, file, cb) => {
        // Genera un nombre de archivo único utilizando nanoid
        const uniqueFileName = nanoid() + "-" + file.originalname;
        cb(null, uniqueFileName.slice(0, 255)); // Limita el nombre de archivo a 255 caracteres
    },
});

const upload = multer({ storage }); // Crea un objeto de configuración de multer llamado 'upload'

// Ruta para subir un archivo PDF
export const pdf_urlRouter = Router(); // Crea un enrutador de Express llamado 'pdf_urlRouter'
pdf_urlRouter.post("/subir-pdf/:id", upload.single("pdf"), crearPDFURL);
pdf_urlRouter.get('/uploads/pdfs/:nombreArchivo', descargarPDF);
pdf_urlRouter.put("/actualizar-pdf/:id", upload.single("pdf"), actualizarPDFURL);
pdf_urlRouter.delete("/eliminar-pdf/:id",eliminarLink)