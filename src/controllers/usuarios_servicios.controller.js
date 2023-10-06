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

};

export const editarUsuarioServicio = async (req, res) => {
    try {
        const { id_usuario, id_servicio } = req.params;

        // Verificar si el asesor existe
        const usuarioExiste = await prisma.usuario_servicio.findFirst({
            where: {
                id_usuario: Number(id_usuario)
            }
        });

        if (!usuarioExiste) {
            return res.status(400).json({ msg: "No existe el asesor" });
        }

        // Eliminar todos los registros relacionados con el id_usuario
        await prisma.usuario_servicio.deleteMany({
            where: {
                id_usuario: Number(id_usuario)
            }
        });

        // Asignar el nuevo servicio al asesor
        await prisma.usuario_servicio.create({
            data: {
                id_usuario: Number(id_usuario),
                id_servicio: Number(id_servicio),
            }
        });

        // Cerrar la conexión de Prisma después de usarla
        await prisma.$disconnect();

        res.json({ msg: "Servicios del asesor actualizados correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al actualizar los servicios del asesor" });
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

export const crearEstadoUsuario = async (req, res) => {
    try {
        // Obtener los valores de idUsuario e idServicio desde los parámetros de la solicitud
        const { idUsuario, idServicio } = req.params;

        // Validar los valores de entrada
        if (!idUsuario || isNaN(idUsuario) || !idServicio || isNaN(idServicio)) {
            return res.status(400).json({ error: 'ID de usuario y servicio no válidos' });
        }

        // Consulta el estado actual del usuario
        const usuario = await prisma.usuario.findUnique({ where: { id: parseInt(idUsuario) } });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Si el usuario ya tiene un estado, no hagas nada
        if (usuario.estado) {
            return res.status(200).json({ message: `El usuario ya tiene un estado definido: "${usuario.estado}"` });
        }

        let nuevoEstadoUsuario = null;

        // Determina el nuevo estado del usuario en función de id_servicio
        if (idServicio === '1' || idServicio === '2' || idServicio === '3') {
            // Si id_servicio es 1, 2 o 3, toma el estado de estadoTesis
            const estadoTesis = await prisma.estadoTesis.findFirst({ orderBy: { id: 'asc' } });
            if (estadoTesis) {
                nuevoEstadoUsuario = estadoTesis.estado;
            }
        } else if (idServicio === '4' || idServicio === '5') {
            // Si id_servicio es 4 o 5, toma el estado de estadoObservacion
            const estadoObservacion = await prisma.estadoObservacion.findFirst({ orderBy: { id: 'asc' } });
            if (estadoObservacion) {
                nuevoEstadoUsuario = estadoObservacion.estado;
            }
        } else if (idServicio === '6') {
            // Si id_servicio es 4 o 5, toma el estado de estadoObservacion
            const estadoParafraseo = await prisma.estadoParafraseo.findFirst({ orderBy: { id: 'asc' } });
            if (estadoParafraseo) {
                nuevoEstadoUsuario = estadoParafraseo.estado;
            }
        } else if (idServicio === '7') {
            // Si id_servicio es 4 o 5, toma el estado de estadoObservacion
            const estadoTrabajoSuficiencia = await prisma.estadoTrabajoSuficiencia.findFirst({ orderBy: { id: 'asc' } });
            if (estadoTrabajoSuficiencia) {
                nuevoEstadoUsuario = estadoTrabajoSuficiencia.estado;
            }
        } else if (idServicio === '8' || idServicio === '9' || idServicio === '10') {
            // Si id_servicio es 4 o 5, toma el estado de estadoObservacion
            const estadoArticulo = await prisma.estadoArticulo.findFirst({ orderBy: { id: 'asc' } });
            if (estadoArticulo) {
                nuevoEstadoUsuario = estadoArticulo.estado;
            }
        }else if (idServicio === '11') {
            // Si id_servicio es 4 o 5, toma el estado de estadoObservacion
            const estadoMonografia = await prisma.estadoMonografia.findFirst({ orderBy: { id: 'asc' } });
            if (estadoMonografia) {
                nuevoEstadoUsuario = estadoMonografia.estado;
            }
        }else if (idServicio === '12') {
            // Si id_servicio es 4 o 5, toma el estado de estadoObservacion
            const estadoPlanDeNegocio = await prisma.estadoPlanDeNegocio.findFirst({ orderBy: { id: 'asc' } });
            if (estadoPlanDeNegocio) {
                nuevoEstadoUsuario = estadoPlanDeNegocio.estado;
            }
        }else if (idServicio === '13') {
            // Si id_servicio es 4 o 5, toma el estado de estadoObservacion
            const estadoInformePracticas = await prisma.estadoInformePracticas.findFirst({ orderBy: { id: 'asc' } });
            if (estadoInformePracticas) {
                nuevoEstadoUsuario = estadoInformePracticas.estado;
            }
        }else if (idServicio === '14') {
            // Si id_servicio es 4 o 5, toma el estado de estadoObservacion
            const estadoTesinas = await prisma.estadoTesinas.findFirst({ orderBy: { id: 'asc' } });
            if (estadoTesinas) {
                nuevoEstadoUsuario = estadoTesinas.estado;
            }
        }else if (idServicio === '15') {
            // Si id_servicio es 4 o 5, toma el estado de estadoObservacion
            const estadoDiapositivas = await prisma.estadoDiapositivas.findFirst({ orderBy: { id: 'asc' } });
            if (estadoDiapositivas) {
                nuevoEstadoUsuario = estadoDiapositivas.estado;
            }
        }

        if (nuevoEstadoUsuario) {
            // Actualiza el estado del usuario en la base de datos
            await prisma.usuario.update({
                where: { id: parseInt(idUsuario) },
                data: { estado: nuevoEstadoUsuario },
            });
            return res.status(200).json({ message: `Estado del usuario actualizado a "${nuevoEstadoUsuario}"` });
        } else {
            return res.status(400).json({ error: 'No se pudo determinar un nuevo estado para el usuario.' });
        }


    } catch (error) {
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};
