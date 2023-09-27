import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// export const crearMontoPagado = async (req, res) => {
//     try {
//         const { monto_pagado, id_usuarios, id_servicio, tema, monto_total } = req.body;

//         console.log(monto_pagado, id_usuarios, id_servicio, tema, monto_total);

//         console.log("monto", monto_pagado);
//         console.log("usu", id_usuarios);
//         console.log("serv", id_servicio);
//         console.log("tema", tema);
//         console.log("total", monto_total);

//         const montoPagadoFloat = parseFloat(monto_pagado);
//         const montoTotalFloat = parseFloat(monto_total);

//         const usuarioExiste = await prisma.usuario.findUnique({
//             where: {
//                 id: parseInt(id_usuarios), // Parsea el valor a entero si es necesario
//             },
//         });
//         if (!usuarioExiste) {
//             return res.status(400).json({ msg: "No existe el usuario" });
//         }

//         const montoPagadoCount = await prisma.monto_pagado.count({
//             where: {
//                 usuarioId: parseInt(id_usuarios),
//             },
//         });

//         console.log(montoPagadoCount); 

//         if (montoPagadoCount >= 4) {
//             return res.status(400).json({ msg: "El usuario ya tiene las 4 cuotas pagadas" });
//         }

//         const montoPagadoRecords = await prisma.monto_pagado.findMany({
//             where: {
//                 usuarioId: parseInt(id_usuarios),
//             },
//         });
//         const sumaMontosPagados = montoPagadoRecords.reduce((total, record) => {
//             return total + record.monto_pagado;
//         }, 0);

//         // Verifica si la suma de los montos pagados más el nuevo monto pagado supera el monto total permitido
//         if (sumaMontosPagados + montoPagadoFloat > montoTotalFloat) {
//             return res.status(400).json({ msg: "La suma de los montos pagados supera el monto total permitido" });
//         }


//         const fecha_pago = new Date();
//         const fechaPagoFormateada = `${fecha_pago.getDate()}/${fecha_pago.getMonth() + 1}/${fecha_pago.getFullYear()}`;

//         const fecha_entrega = new Date(fecha_pago);
//         fecha_entrega.setDate(fecha_pago.getDate() + 14);
//         const fechaEntregaFormateada = `${fecha_entrega.getDate()}/${fecha_entrega.getMonth() + 1}/${fecha_entrega.getFullYear()}`;

//         const usuarioMonto = await prisma.monto_pagado.create({
//             data: {
//                 monto_pagado: montoPagadoFloat,
//                 fecha_pago: fechaPagoFormateada,
//                 usuarioId: parseInt(id_usuarios),
//             },
//         });
//         let usuarioServicio = null;
//         if (id_servicio) {
//             const usuarioServicio = await prisma.usuario_servicio.create({
//                 data: {
//                     id_usuario: parseInt(id_usuarios),
//                     id_servicio: parseInt(id_servicio),
//                 }
//             })
//         }
//         let usuarioTema = null;
//         if (tema) {
//             const usuarioTema = await prisma.usuario.update({
//                 where: {
//                     id: id_usuarios,
//                 },
//                 data: {
//                     tema: tema,
//                     monto_total: montoTotalFloat,
//                     fecha_estimada: fechaEntregaFormateada
//                 }
//             })
//         }

//         res.json({
//             usuarioTema: usuarioTema,
//             usuarioServicio: usuarioServicio,
//             usuarioMonto: usuarioMonto,
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ msg: "Error al asignar usuario_asesor" });
//     }
// };

export const crearMontoPagado = async (req, res) => {
    try {
        const { monto_pagado, id_usuarios, id_servicio, tema, monto_total } = req.body;

        console.log(monto_pagado, id_usuarios, id_servicio, tema, monto_total);

        console.log("monto", monto_pagado);
        console.log("usu", id_usuarios);
        console.log("serv", id_servicio);
        console.log("tema", tema);
        console.log("total", monto_total);

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

        // Calcula la suma actual de los montos pagados
        const montoPagadoRecords = await prisma.monto_pagado.findMany({
            where: {
                usuarioId: parseInt(id_usuarios),
            },
        });
        const sumaMontosPagados = montoPagadoRecords.reduce((total, record) => {
            return total + record.monto_pagado;
        }, 0);

        console.log(sumaMontosPagados);
        console.log(montoPagadoFloat);
        console.log(montoPagadoFloat + sumaMontosPagados);
        console.log(usuarioExiste.monto_total);

        // Verifica si agregar el nuevo monto superaría el monto total permitido
        if ((sumaMontosPagados + montoPagadoFloat) > (montoTotalFloat ? montoTotalFloat : usuarioExiste.monto_total)) {
            return res.status(400).json({ msg: "La suma de los montos pagados supera el monto total permitido" });
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
        let usuarioServicio = null;
        if (id_servicio) {
            const usuarioServicio = await prisma.usuario_servicio.create({
                data: {
                    id_usuario: parseInt(id_usuarios),
                    id_servicio: parseInt(id_servicio),
                }
            })
        }
        let usuarioTema = null;
        if (tema) {
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
        }

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

export const editarMontoPagado = async (req, res) => {
    const { id } = req.params;
    const updates = req.body.monto_pagado; // Un arreglo de objetos con { position, monto_pagado, fecha_pago }
    console.log("losupdates", updates);
    try {
        const findUsuario = await prisma.usuario.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!findUsuario) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        // Busca todos los registros monto_pagado del usuario
        const montoPagadoRecords = await prisma.monto_pagado.findMany({
            where: {
                usuarioId: Number(id),
            },
        });

        const sumaMontosPagados = updates.reduce((total, record) => {
            return total + record.monto_pagado;
        }, 0);
        console.log(sumaMontosPagados);
        // Calcula el monto total permitido para el usuario
        const montoTotalPermitido = findUsuario.monto_total;
        console.log(montoTotalPermitido);
        // Verifica si la suma de los montos pagados es mayor al monto total permitido
        if (sumaMontosPagados > montoTotalPermitido) {
            return res.status(400).json({
                message: "La suma de los montos pagados supera el monto total permitido",
            });
        }

        // Itera a través de las actualizaciones y aplica los cambios
        for (const update of updates) {
            const { position, monto_pagado, fecha_pago } = update;

            if (position >= 0 && position < montoPagadoRecords.length) {
                const existingMontoPagado = montoPagadoRecords[position];

                if (existingMontoPagado) {
                    const updateFields = {};

                    // Verifica que monto_pagado no sea undefined
                    if (monto_pagado !== undefined) {
                        updateFields.monto_pagado = parseFloat(monto_pagado);
                    }

                    // Verifica que fecha_pago no sea undefined
                    if (fecha_pago !== undefined) {
                        updateFields.fecha_pago = fecha_pago;
                    }

                    await prisma.monto_pagado.update({
                        where: {
                            id: existingMontoPagado.id,
                        },
                        data: updateFields,
                    });
                }
            }
        }

        return res.status(201).json({
            message: "Montos pagados actualizados",
        });
    } catch (error) {
        console.error("Error en el servidor:", error); // Agrega esta línea para registrar el error en la consola
        return res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
};
