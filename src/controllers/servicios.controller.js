import { PrismaClient } from "@prisma/client";
// import { format } from 'date-fns';

const prisma = new PrismaClient();

export const crearServicio = async (req, res) => {
    try {
        const { nombre_servicio } = req.body;

        // const fechaActual = new Date();
        // const fechaFormateada = format(fechaActual, 'dd/MM/yyyy');

        const existingServicio = await prisma.servicio.findUnique({
            where: {
                nombre_servicio: nombre_servicio,
            },
        });

        if (existingServicio) {
            // El correo electrónico ya está en uso
            return res.status(400).json({ msg: "El servicio ya está registrado." });
        }

        // Crear la servicio
        const nuevoServicio = await prisma.servicio.create({
            data: {
                nombre_servicio,
                // fecha_servicio: fechaFormateada,
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
};

export const traerServicioPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const servicio = await prisma.servicio.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!servicio) {
            return res.status(404).json({
                message: "servicio no encontrado",
            });
        }
        return res.status(200).json({
            message: "servicio encontrado",
            content: servicio,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
};

export const actualizarServicio = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const updatedServicio = await prisma.servicio.update({
            where: {
                id: Number(id),
            },
            data: {
                servicio: data.servicio,
                usuario_id:{
                    set: data.usuario_id
                },
            },
        });

        return res.status(201).json({
            message: "Servicio actualizado",
            content: updatedServicio,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
};

export const eliminarServicio = async (req, res) => {
    const { id } = req.params;
    try {
        const findServicio = await prisma.servicio.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!findServicio) {
            return res.status(404).json({
                message: "Servicio no encontrado",
            });
        }

        await prisma.servicio.delete({
            where: {
                id: Number(id),
            },
        });
        return res.status(200).json({
            message: "Servicio eliminado",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
};

