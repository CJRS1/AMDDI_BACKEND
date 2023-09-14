import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const crearMontoPagado = async (req, res) => {
    try {
        const { monto_pagado, id_usuarios, id_servicio, tema, monto_total } = req.body;
        
        console.log(monto_pagado, id_usuarios, id_servicio, tema, monto_total);


        const montoPagadoFloat = parseFloat(monto_pagado);
        const montoTotalFloat = parseFloat(monto_total);


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
        
        const fecha_entrega = new Date(fecha_pago);
        fecha_entrega.setDate(fecha_pago.getDate() + 14);
        const fechaEntregaFormateada = `${fecha_entrega.getDate()}/${fecha_entrega.getMonth() + 1}/${fecha_entrega.getFullYear()}`;
        
        const usuarioMonto = await prisma.monto_pagado.create({
            data: {
                monto_pagado: montoPagadoFloat,
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

        const usuarioTema = await prisma.usuario.update({
            where: {
                id: id_usuarios,
            },
            data: {
                tema: tema,
                monto_total: montoTotalFloat,
                fecha_estimada: fechaEntregaFormateada
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


export const traerMontoPagado = async (req, res) => {
    try {
        const { id } = req.params;

        const usuarioExiste = await prisma.usuario.findUnique({
            where: {
                id: parseInt(id), // Parsea el valor a entero si es necesario
            },
        });
        if (!usuarioExiste) {
            return res.status(400).json({ msg: "No existe el usuario" });
        }

        const usuarioMonto = await prisma.monto_pagado.findFirst({
            where: {
                usuarioId: parseInt(id), // Parsea el valor a entero si es necesario
            },
        });

        if (!usuarioMonto) {
            return res.status(404).json({ msg: "El usuario no tiene monto pagado registrado" });
        }

        res.json({
            monto_pagado: usuarioMonto.monto_pagado,
            fecha_pago: usuarioMonto.fecha_pago,
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al obtener el monto pagado" });
    }
};