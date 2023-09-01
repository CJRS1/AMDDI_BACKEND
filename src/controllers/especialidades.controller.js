import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const crearEspecialidad = async (req, res) => {
    try {
        const { nombre_especialidad } = req.body;

        const existingEspecialidad = await prisma.especialidad.findUnique({
            where: {
                nombre_especialidad: nombre_especialidad,
            },
        });

        if (existingEspecialidad) {
            // El correo electrónico ya está en uso
            return res.status(400).json({ msg: "La especialidad ya está registrada" });
        }

        // Crear la especialidad
        const nuevaEspecialidad = await prisma.especialidad.create({
            data: {
                nombre_especialidad,
            },
        });

        res.json({ msg: "Especialidad creada exitosamente", especialidad: nuevaEspecialidad });

    } catch (error) {
        // Si hay un error, la transacción se revierte y el ID no aumentará
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor." });
    }
};

export const listarEspecialidades = async (req, res) => {
    try {
        console.log("Hay espacialidades");
        const especialidades = await prisma.especialidad.findMany();
        return res.status(200).json({
            message: "Especialidades encontrados",
            content: especialidades,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: err.message,
        });
    }
};




export const traerEspecialidadPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const especialidad = await prisma.especialidad.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!especialidad) {
            return res.status(404).json({
                message: "Especialidad no encontrada",
            });
        }
        return res.status(200).json({
            
            message: "Especialidad encontrada",
            content: especialidad,
        });
        
    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
};

export const actualizarEspecialidad = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const findEspecialidad = await prisma.especialidad.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!findEspecialidad ) {
            return res.status(404).json({
                message: "Especialidad  no encontrado",
            });
        }

        const especialidad = await prisma.especialidad.update({
            where: {
                id: Number(id),
            },
            data: {
                nombre_especialidad: data.nombre_especialidad,

            },
            select: {
                id: true,
                ...(data.nombre_especialidad && { nombre_especialidad: true }),

            },
        });

        return res.status(201).json({
            message: "especialidad actualizado",
            content: especialidad,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
};

export const eliminarEspecialidad = async (req, res) => {
    const { id } = req.params;
    try {
        const findEspecialidad  = await prisma.especialidad.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!findEspecialidad) {
            return res.status(404).json({
                message: "Especialidad no encontrado",
            });
        }

        await prisma.especialidad.delete({
            where: {
                id: Number(id),
            },
        });
        return res.status(200).json({
            message: "Especialidad eliminado",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
};