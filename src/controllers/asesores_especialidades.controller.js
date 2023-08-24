import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const crearAsesorEspecialidad = async (req, res) => {
    try {
        const { id_asesor, id_especialidad } = req.body;
        const asesorExiste = await prisma.asesor.findUnique({
            where: {
                id: id_asesor
            }
        });

        if (!asesorExiste) {
            return res.status(400).json({ msg: "No existe el asesor" });
        }

        // Validar que especialidad exista
        const especialidadExiste = await prisma.especialidad.findUnique({
            where: {
                id: id_especialidad
            }
        });

        if (!especialidadExiste) {
            return res.status(400).json({ msg: "No existe la especialidad" });
        }

        const asesorEspecialidad = await prisma.asesor_especialidad.create({
            data: {
                id_asesor: id_asesor,
                id_especialidad: id_especialidad
            }
        });

        res.json(asesorEspecialidad);

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al asignar especialidad" });
    }

}

export const eliminarAsesor_Especialidad = async (req, res) => {
    const { id } = req.params;
    try {
        const findAsesor_Especialidad = await prisma.asesor_especialidad.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!findAsesor_Especialidad) {
            return res.status(404).json({
                message: "Asesor_Especialidad no encontrado",
            });
        }

        await prisma.asesor_especialidad.delete({
            where: {
                id: Number(id),
            },
        });
        return res.status(200).json({
            message: "Asesor_Especialidad eliminado",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
};

