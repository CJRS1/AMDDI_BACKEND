import slugify from 'slugify';
import crypto from 'crypto';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

function random(n) {
    return crypto.randomBytes(n / 2).toString('hex');
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const saveDirectory = getSaveDirectory();
        cb(null, saveDirectory);
    },
    filename: function (req, file, cb) {
        const filenameParsed = path.parse(file.originalname);
        const newFilename =
            slugify(filenameParsed.name) + '-' + random(6) + filenameParsed.ext;

        cb(null, newFilename);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true); // Acepta el archivo
    } else {
        cb(new Error('El archivo debe ser un PDF.'), false); // Rechaza el archivo
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
}).array('file'); // 'file' debe coincidir con el nombre del campo del formulario

function getSaveDirectory() {
    const railwayVolumeMountPath = process.env.RAILWAY_VOLUME_MOUNT_PATH;
    return railwayVolumeMountPath
        ? railwayVolumeMountPath
        : path.join(import.meta.url, 'files');
}

export const uploadFile = (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.error(err);
            res.status(500).end('Error de Multer');
            return;
        } else if (err) {
            console.error(err);
            res.status(500).end('Error desconocido');
            return;
        }

        if (!req.files) {
            res.status(400).end('No se cargaron archivos');
            return;
        }

        res.end('Archivos guardados');
    });
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