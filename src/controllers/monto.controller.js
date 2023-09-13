import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const crearMontoPagado = async (req, res) => {
    try {
        const { monto_pagado, id_usuarios, id_servicio, tema } = req.body;

        const usuarioExiste = await prisma.usuario.findUnique({
            where: {
                id: parseInt(id_usuarios), // Parsea el valor a entero si es necesario
            },
        });
        if (!usuarioExiste) {
            return res.status(400).json({ msg: "No existe el usuario" });
        }

        const fecha_pago = new Date();
        const fechaPagoFormateada = `${fecha_pago.getDate()}/${fecha_pago.getMonth() + 1}/${fecha_pago.getFullYear()}`;

        const usuarioMonto = await prisma.monto_pagado.create({
            data: {
                monto_pagado: monto_pagado,
                fecha_pago: fechaPagoFormateada,
                usuarioId: parseInt(id_usuarios),
            },
        });

        const usuarioServicio = await prisma.usuario_servicio.create({
            data: {
                id_usuario: parseInt(id_usuarios),
                id_servicio: parseInt(id_servicio),
            }
        })

        const usuarioTema = await prisma.usuario.create({
            where: {
                id_usuario: id_usuarios,
            },
            data: {
                tema: tema,
            }
        })

        res.json({
            usuarioTema: usuarioTema,
            usuarioServicio: usuarioServicio,
            usuarioMonto: usuarioMonto,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al asignar usuario_asesor" });
    }
};