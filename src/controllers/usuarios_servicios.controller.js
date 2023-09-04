import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const crearUsuario_Servicio = async (req, res) => {
    try {
        const { id_usuario, id_servicio } = req.body;
        const usuarioExiste = await prisma.usuario.findUnique({
            where: {
                id: id_usuario
            }
        });

        if (!usuarioExiste) {
            return res.status(400).json({ msg: "No existe el usuario" });
        }

        // Validar que servicio exista
        const servicioExiste = await prisma.servicio.findUnique({
            where: {
                id: id_servicio
            }
        });

        if (!servicioExiste) {
            return res.status(400).json({ msg: "No existe la servicio" });
        }

        const usuarioServicio = await prisma.usuario_servicio.create({
            data: {
                id_usuario: id_usuario,
                id_servicio: id_servicio
            }
        });

        res.json(usuarioServicio);

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al asignar especialidad" });
    }

}

export const editarUsuarioServicio = async (req, res) => {
    try {
        const { id_usuario, id_servicio } = req.body;

        // Verificar si el usuario existe por su ID
        const usuarioExiste = await prisma.usuario.findUnique({
            where: {
                id: id_usuario,
            },
        });

        if (!usuarioExiste) {
            return res.status(400).json({ msg: "No existe el usuario" });
        }

        // Validar que el servicio exista
        const servicioExiste = await prisma.servicio.findUnique({
            where: {
                id: id_servicio,
            },
        });

        if (!servicioExiste) {
            return res.status(400).json({ msg: "No existe el servicio" });
        }

        // Verificar si el usuario ya tiene el servicio asignado
        const usuarioTieneServicio = await prisma.usuario_servicio.findFirst({
            where: {
                id_usuario: usuarioExiste.id,
                id_servicio: id_servicio,
            },
        });

        if (usuarioTieneServicio) {
            return res.status(400).json({ msg: "El usuario ya tiene este servicio asignado" });
        }

        const usuarioServicio = await prisma.usuario_servicio.create({
            data: {
                id_usuario: usuarioExiste.id,
                id_servicio: id_servicio,
            },
        });

        res.json(usuarioServicio);

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al editar el servicio del usuario" });
    }
};

export const eliminarUsuario_Servicio = async (req, res) => {
    const { id } = req.params;
    try {
        const findUsuario_Servicio = await prisma.usuario_servicio.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!findUsuario_Servicio) {
            return res.status(404).json({
                message: "usuario_servicio no encontrado",
            });
        }

        await prisma.usuario_servicio.delete({
            where: {
                id: Number(id),
            },
        });
        return res.status(200).json({
            message: "usuario_servicio eliminado",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
};

