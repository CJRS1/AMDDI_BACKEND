import { PrismaClient } from "@prisma/client";
// import { format } from 'date-fns';

const prisma = new PrismaClient();

export const crearEstado = async (req, res) => {
    console.log("entro aqui")
    try {
        const { nombre_estado } = req.body;
        console.log(nombre_estado);
        // const fechaActual = new Date();
        // const fechaFormateada = format(fechaActual, 'dd/MM/yyyy');

        const existingEstado = await prisma.estadoObservacion.findFirst({
            where: {
                estado: nombre_estado,
            },
        });

        if (existingEstado) {
            // El correo electrónico ya está en uso
            return res.status(400).json({ msg: "El estado ya está registrado." });
        }

        // Crear la servicio
        const nuevoEstado = await prisma.estadoObservacion.create({
            data: {
                estado: nombre_estado,
                // fecha_servicio: fechaFormateada,
            },
        });

        res.json({ msg: "Servicio creado exitosamente", estado: nuevoEstado });

    } catch (error) {
        // Si hay un error, la transacción se revierte y el ID no aumentará
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor." });
    }
};

export const listarEstados = async (req, res) => {
    try {
        const estados = await prisma.estadoObservacion.findMany();
        return res.status(200).json({
            message: "estados encontrados",
            content: estados,
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

export const actualizarEstado = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const updatedEstado = await prisma.estadoObservacion.update({
            where: {
                id: Number(id),
            },
            data: {
                estado: data.nombre_estado
            },
        });

        return res.status(201).json({
            message: "Servicio actualizado",
            content: updatedEstado,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
};

export const eliminarEstado = async (req, res) => {
    const { id } = req.params;
    try {
        const findEstado = await prisma.estadoObservacion.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!findEstado) {
            return res.status(404).json({
                message: "Estado no encontrado",
            });
        }

        await prisma.estadoObservacion.delete({
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
