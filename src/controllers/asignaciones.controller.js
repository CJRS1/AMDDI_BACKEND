import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const crearAsignacionesSec = async (req, res) => {
    try {
        const { id_asesor, id_usuarios } = req.params; // Cambio aquí
        console.log(id_asesor, id_usuarios);

        const asesorExiste = await prisma.asesor.findUnique({
            where: {
                id: parseInt(id_asesor), // Parsea el valor a entero si es necesario
            },
        });
        if (!asesorExiste) {
            return res.status(400).json({ msg: "No existe el asesor" });
        }

        const usuarioExiste = await prisma.usuario.findUnique({
            where: {
                id: parseInt(id_usuarios), // Parsea el valor a entero si es necesario
            },
        });
        if (!usuarioExiste) {
            return res.status(400).json({ msg: "No existe el usuario" });
        }

        const asesorUsuario = await prisma.asignacion_secundaria.create({
            data: {
                id_asesor: parseInt(id_asesor), // Parsea el valor a entero si es necesario
                id_usuarios: parseInt(id_usuarios), // Parsea el valor a entero si es necesario
            },
        });

        res.json(asesorUsuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al asignar usuario_asesor" });
    }
};

export const crearAsignaciones = async (req, res) => {
    try {
        const { id_asesor, id_usuarios } = req.params; // Cambio aquí
        console.log(id_asesor, id_usuarios);
        // Check if the user already has an advisor
        const existingAsignacion = await prisma.asignacion.findFirst({
            where: {
                id_usuarios: parseInt(id_usuarios),
            },
        });

        if (existingAsignacion) {
            console.log("existe")
            return res.status(400).json({ msg: "El usuario ya tiene un asesor asignado" });
        }

        const asesorExiste = await prisma.asesor.findUnique({
            where: {
                id: parseInt(id_asesor), // Parsea el valor a entero si es necesario
            },
        });
        if (!asesorExiste) {
            return res.status(400).json({ msg: "No existe el asesor" });
        }

        const usuarioExiste = await prisma.usuario.findUnique({
            where: {
                id: parseInt(id_usuarios), // Parsea el valor a entero si es necesario
            },
        });
        if (!usuarioExiste) {
            return res.status(400).json({ msg: "No existe el usuario" });
        }

        const asesorUsuario = await prisma.asignacion.create({
            data: {
                id_asesor: parseInt(id_asesor), // Parsea el valor a entero si es necesario
                id_usuarios: parseInt(id_usuarios), // Parsea el valor a entero si es necesario
                id_estado: 1, 
            },
        });

        res.json(asesorUsuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al asignar usuario_asesor" });
    }
};



export const editarAsignaciones = async (req, res) => {
    try {
        const { id_asesor, nombres_usuarios } = req.body;

        // Verificar si el asesor existe
        const asesorExiste = await prisma.asesor.findUnique({
            where: {
                id: id_asesor,
            },
        });

        if (!asesorExiste) {
            return res.status(400).json({ msg: "No existe el asesor" });
        }

        // Obtener una lista de IDs de usuarios por sus nombres
        const usuariosPorNombres = await prisma.usuario.findMany({
            where: {
                nombre: {
                    in: nombres_usuarios,
                },
            },
            select: {
                id: true,
            },
        });

        // Crear asignaciones para cada usuario
        const asignaciones = usuariosPorNombres.map(usuario => ({
            id_asesor: id_asesor,
            id_usuarios: usuario.id,
        }));

        // Crear o actualizar las asignaciones en la base de datos
        for (const asignacion of asignaciones) {
            await prisma.asignacion.upsert({
                where: {
                    id_asesor_id_usuarios: {
                        id_asesor: id_asesor,
                        id_usuarios: asignacion.id_usuarios,
                    },
                },
                update: {},
                create: asignacion,
            });
        }

        res.json({ msg: "Asignaciones de usuarios actualizadas correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al editar las asignaciones de usuarios" });
    }
};


export const editarAsignacionesUsuarios = async (req, res) => {
    try {
        const { id_usuario, nombre_asesor } = req.body;
        console.log(id_usuario, nombre_asesor);
        // Verificar si el asesor existe por su nombre
        const asesorExiste = await prisma.asesor.findUnique({
            where: {
                nombre: nombre_asesor,
            },
        });

        if (!asesorExiste) {
            return res.status(400).json({ msg: "No existe el asesor" });
        }

        // Verificar si el usuario existe por su ID
        const usuarioExiste = await prisma.usuario.findUnique({
            where: {
                id: id_usuario,
            },
        });

        if (!usuarioExiste) {
            return res.status(400).json({ msg: "No existe el usuario" });
        }

        // Verificar si la asignación ya existe
        const asignacionExistente = await prisma.asignacion.findFirst({
            where: {
                id_usuarios: id_usuario,
                id_asesor: asesorExiste.id,
            },
        });

        if (asignacionExistente) {
            return res.status(400).json({ msg: "La asignación ya existe" });
        }

        // Crear la asignación en la base de datos
        const nuevaAsignacion = await prisma.asignacion.create({
            data: {
                id_usuarios: id_usuario,
                id_asesor: asesorExiste.id,
            },
        });

        res.json({ msg: "Asignación de usuario actualizada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al editar la asignación de usuario" });
    }
};





export const eliminarAsignaciones = async (req, res) => {
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

