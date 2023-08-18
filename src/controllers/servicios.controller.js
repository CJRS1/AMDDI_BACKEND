import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const crearServicio = async (req, res) => {
    try {
        const { servicio, monto_total } = req.body;

        const existingServicio = await prisma.servicio.findUnique({
            where: {
                servicio: servicio,
            },
        });

        if (existingServicio) {
            // El correo electrónico ya está en uso
            return res.status(400).json({ msg: "El servicio ya está registrado." });
        }

        // Crear la servicio
        const nuevoServicio = await prisma.servicio.create({
            data: {
                servicio,
                monto_total,
            },
        });

        res.json({ msg: "Servicio creado exitosamente", servicio: nuevoServicio });

    } catch (error) {
        // Si hay un error, la transacción se revierte y el ID no aumentará
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor." });
    }
};

export const listarServicios = async (req, res) => {
    try {
        const servicios = await prisma.servicio.findMany();
        return res.status(200).json({
            message: "Servicios encontrados",
            content: servicios,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: err.message,
        });
    }
}