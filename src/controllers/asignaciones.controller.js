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
            },
        });

        res.json(asesorUsuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al asignar usuario_asesor" });
    }
};

export const editarAsignacionesUsuarios = async (req, res) => {
    try {
        const { id_usuario, id_asesor } = req.body;
        console.log(id_usuario, id_asesor);

        // Verificar si el asesor existe por su nombre
        const asesorExiste = await prisma.asesor.findUnique({
            where: {
                id: Number(id_asesor),
            },
        });

        if (!asesorExiste) {
            return res.status(400).json({ msg: "No existe el asesor" });
        }

        // Verificar si el usuario existe por su ID
        const usuarioExiste = await prisma.usuario.findUnique({
            where: {
                id: Number(id_usuario),
            },
        });

        if (!usuarioExiste) {
            return res.status(400).json({ msg: "No existe el usuario" });
        }

        // Verificar si la asignación ya existe
        const asignacionExistente = await prisma.asignacion.findFirst({
            where: {
                id_usuarios: Number(id_usuario),
                // id_asesor: asesorExiste.id,
            },
        });

        if (!asignacionExistente) {
            return res.status(400).json({ msg: "No existe una asignación previa" });
        }

        // Crear la asignación en la base de datos
        await prisma.asignacion.updateMany({
            where: {
                id_usuarios: Number(id_usuario),
            },
            data: {
                id_usuarios: Number(id_usuario),
                id_asesor: Number(asesorExiste.id),
            },
        });

        // res.json({ msg: "Asignación de usuario actualizada correctamente" });
        res.status(200).json({ msg: "Asignación de usuario actualizada correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al editar la asignación de usuario" });
    }
};

export const editarAsignacionesUsuariosSec = async (req, res) => {
    try {
        const { id_usuario, id_asesor } = req.body;
        console.log(id_usuario, id_asesor);

        const usuarioExiste = await prisma.usuario.findUnique({
            where: {
                id: Number(id_usuario),
            },
        });

        if (!usuarioExiste) {
            return res.status(400).json({ msg: "No existe el usuario" });
        }

        // Iterate through the id_asesor array and update each assignment individually
        const asignacionExistente = await prisma.asignacion_secundaria.findMany({
            where: {
                id_usuarios: Number(id_usuario),
                // id_asesor: asesorExiste.id,
            },
        });

        if (!asignacionExistente) {
            return res.status(400).json({ msg: "No existe una asignación previa" });
        }

        // for (let i = 0; i < asignacionExistente.length; i++) {
        //     const posicion = i; // Usar el índice actual para identificar la asignación
        //     const valor = id_asesor.hasOwnProperty(posicion.toString()) ? id_asesor[posicion.toString()] : id_asesor['0']; // Obtener el valor correspondiente según la posición

        //     await prisma.asignacion_secundaria.update({
        //         where: {
        //             id: asignacionExistente[i].id, // Usar la posición actual para identificar la asignación
        //         },
        //         data: {
        //             id_asesor: Number(valor), // Convertir el valor a número
        //         },
        //     });
        // }

        for (let i = 0; i < asignacionExistente.length; i++) {
            const posicion = i; // Usar el índice actual para identificar la asignación

            // Check if id_asesor for the current position exists in the request
            if (id_asesor.hasOwnProperty(posicion.toString())) {
                const valor = id_asesor[posicion.toString()];

                await prisma.asignacion_secundaria.update({
                    where: {
                        id: asignacionExistente[i].id, // Use the current position to identify the assignment
                    },
                    data: {
                        id_asesor: Number(valor), // Convert the value to a number
                    },
                });
            }
        }

        return res.json({ msg: "Asignaciones de usuario actualizadas correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al editar las asignaciones de usuario" });
    }
};

export const editarAsignacionEstado = async (req, res) => {

    try {
        const { id } = req.params;
        const { estado } = req.body;
        console.log("elll", id, estado);
        const usuarioEncontado = await prisma.asignacion.findFirst({
            where: {
                id_usuarios: Number(id),
            }
        });
        console.log(usuarioEncontado);

        if (!usuarioEncontado) {
            return res.status(404).json({ msg: ' Usuario no encontrado' })
        };

        await prisma.asignacion.update({
            where: {
                id: usuarioEncontado.id, // Utiliza el id de la asignación encontrada
            },
            data: {
                id_estado: Number(estado),
            }
        })

        return res.json({ msg: "Se cambió el estado correctamente" })
    } catch (err) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: err.message,
        });
    }
}

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

export const eliminarAsignacionesSec = async (req, res) => {
    const { id } = req.params;
    try {

        await prisma.asignacion_secundaria.delete({
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

export const asesoresDisponibles = async (req, res) => {
    console.log("ingreso aqui");
    console.log("ingreso aqui");
    console.log("ingreso aqui");
    console.log("ingreso aqui");
    const { id } = req.params;
    console.log(id);
    try {
        const usuario = await prisma.usuario.findFirst({
            where: {
                id: Number(id)
            }
        })

        console.log(usuario);

        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' })
        }

        const asePrincipal = await prisma.asignacion.findFirst({
            where: {
                id_usuarios: Number(id),
            }
        })

        const aseSecundario = await prisma.asignacion_secundaria.findMany({
            where: {
                id_usuarios: Number(id),
            }
        })

        const asesores = await prisma.asesor.findMany();

        const advisorsDisponibles = asesores.filter((advisor) => {
            const advisorId = advisor.id;
            return (
                !asePrincipal || asePrincipal.id_asesor !== advisorId
            ) && !aseSecundario.some((secundario) => secundario.id_asesor === advisorId);
        });

        res.status(200).json({ advisorsDisponibles });

    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
};
