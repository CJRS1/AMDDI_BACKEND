import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const crearAsesorEspecialidad = async (req, res) => {
    try {
        const { id_asesor, id_especialidades } = req.body;
        console.log(id_asesor, id_especialidades);
        const asesorExiste = await prisma.asesor.findUnique({
            where: {
                id: id_asesor
            }
        });

        if (!asesorExiste) {
            return res.status(400).json({ msg: "No existe el asesor" });
        }

        const asesorEspecialidadesActuales = await prisma.asesor_especialidad.findMany({
            where: {
                id_asesor: id_asesor,
                id_especialidad: { in: id_especialidades }
            }
        });

        const especialidadesExistentes = new Set();
        asesorEspecialidadesActuales.forEach(asesorEspecialidad => {
            especialidadesExistentes.add(asesorEspecialidad.id_especialidad);
        });

        const nuevasEspecialidades = [];
        for (const id_especialidad of id_especialidades) {
            if (!especialidadesExistentes.has(id_especialidad)) {
                nuevasEspecialidades.push(id_especialidad);
            }
        }

        for (const id_especialidad of nuevasEspecialidades) {
            const especialidadExiste = await prisma.especialidad.findUnique({
                where: {
                    id: id_especialidad
                }
            });

            if (!especialidadExiste) {
                console.error(`No existe la especialidad con ID ${id_especialidad}`);
                continue;
            }

            const asesorEspecialidad = await prisma.asesor_especialidad.create({
                data: {
                    id_asesor: id_asesor,
                    id_especialidad: id_especialidad
                }
            });

            console.log(`Especialidad ${id_especialidad} asignada al asesor ${id_asesor}`);
        }

        res.json({ msg: "Especialidades asignadas correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al asignar especialidades" });
    }
};


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

