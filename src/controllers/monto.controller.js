import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

        const montoPagadoCount = await prisma.monto_pagado.count({
            where: {
                usuarioId: parseInt(id_usuarios),
            },
        });

        console.log(montoPagadoCount); 

        if (montoPagadoCount >= 4) {
            return res.status(400).json({ msg: "El usuario ya tiene las 4 cuotas pagadas" });
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

// export const editarMontoPagado = async (req, res) => {
//     const { id } = req.params;
//     const data = req.body;

//     try {
//         const findUsuario = await prisma.usuario.findUnique({
//             where: {
//                 id: Number(id),
//             },
//             include: {
//                 monto_pagado: true, // Incluye los registros de monto_pagado
//             },
//         });

//         if (!findUsuario) {
//             return res.status(404).json({
//                 message: "Usuario no encontrado",
//             });
//         }

//         if (data.monto_pagado && Array.isArray(data.monto_pagado)) {
//             // Itera sobre los objetos de monto_pagado y actualiza la base de datos
//             for (const montoPagadoObj of data.monto_pagado) {
//                 const { index, monto, fecha } = montoPagadoObj;

//                 // Asegúrate de que el índice sea un número válido y dentro del rango de montos_pagados
//                 if (index >= 0 && index < findUsuario.monto_pagado.length) {
//                     // Actualiza el monto pagado en la base de datos para el usuario
//                     findUsuario.monto_pagado[index].monto_pagado = parseFloat(monto);
//                     findUsuario.monto_pagado[index].fecha_pago = fecha;
//                 }
//             }
//             console.log(findUsuario.monto_pagado)
//             // Actualiza la relación monto_pagado manualmente
//             await prisma.usuario.update({
//                 where: {
//                     id: Number(id),
//                 },
//                 data: {
//                     monto_pagado: {
//                         updateMany: findUsuario.monto_pagado.map((montoPagado) => ({
//                             where: {
//                                 id: montoPagado.id,
//                             },
//                             data: {
//                                 monto_pagado: montoPagado.monto_pagado,
//                                 fecha_pago: montoPagado.fecha_pago,
//                             },
//                         })),
//                     },
//                 },
//             });

//             return res.status(201).json({
//                 message: "Montos pagados actualizados",
//             });
//         }

//         return res.status(400).json({
//             message: "Datos de montos pagados no proporcionados correctamente",
//         });
//     } catch (error) {
//         return res.status(500).json({
//             message: "Error en el servidor",
//             error: error.message,
//         });
//     }
// };+

// export const editarMontoPagado = async (req, res) => {
//     const { id } = req.params;
//     const data = req.body;
//     console.log("monto_pagado",data);
//     try {
//         const findUsuario = await prisma.usuario.findUnique({
//             where: {
//                 id: Number(id),
//             },
//             select: {
//                 id: true,
//                 email: true,
//                 nombre: true,
//                 apeMat: true,
//                 apePat: true,
//                 dni: true,
//                 celular: true,
//                 tema: true,
//                 monto_pagado: true, 
//             },
//         });

//         if (!findUsuario) {
//             return res.status(404).json({
//                 message: "Usuario no encontrado",
//             });
//         }
//         if (data.monto_pagado && Array.isArray(data.monto_pagado)) {
//             // Actualiza la relación monto_pagado del usuario utilizando los valores de la solicitud
//             await prisma.usuario.update({
//                 where: {
//                     id: Number(id),
//                 },
//                 data: {
//                     monto_pagado: {
//                         updateMany: data.monto_pagado.map((montoPagadoObj) => ({
//                             where: {
//                                 id: montoPagadoObj.index,
//                             },
//                             data: {
//                                 monto_pagado: parseFloat(montoPagadoObj.monto),
//                                 fecha_pago: montoPagadoObj.fecha,
//                             },
//                         })),
//                     },
//                 },
//             });

//             return res.status(201).json({
//                 message: "Montos pagados actualizados",
//             });
//         }

//         return res.status(400).json({
//             message: "Datos de montos pagados no proporcionados correctamente",
//         });
//     } catch (error) {
//         return res.status(500).json({
//             message: "Error en el servidor",
//             error: error.message,
//         });
//     }
// };

export const editarMontoPagado = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    console.log(data);
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

        // Actualiza los registros monto_pagado existentes con los datos proporcionados en req.body
        for (let i = 0; i < montoPagadoRecords.length; i++) {
            const existingMontoPagado = montoPagadoRecords[i];
            const montoPagadoObj = data.monto_pagado[i];

            console.log(existingMontoPagado);

            if (existingMontoPagado) {
                await prisma.monto_pagado.update({
                    where: {
                        id: existingMontoPagado.id,
                    },
                    data: {
                        monto_pagado: parseFloat(montoPagadoObj.monto),
                        fecha_pago: montoPagadoObj.fecha,
                    },
                });
            }
        }

        return res.status(201).json({
            message: "Montos pagados actualizados",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
};
