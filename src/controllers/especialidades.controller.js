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
}