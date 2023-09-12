import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const crearAsesor = async (req, res) => {
    try {
        const { email, pwd_hash, nombre, apeMat, apePat, dni } = req.body;
        const existingUser = await prisma.asesor.findUnique({
            where: {
                email: email,
            },
        });
        if (existingUser) {
            // El correo electrónico ya está en uso
            return res.status(400).json({ msg: "El correo electrónico ya está registrado." });
        }
        const existingDNI = await prisma.asesor.findUnique({
            where: {
                dni: dni,
            },
        });
        if (existingDNI) {
            // El correo electrónico ya está en uso
            return res.status(400).json({ msg: "El DNI ya está registrado." });
        }
        // Iniciar transacción
        const nuevoAsesor = await prisma.asesor.create({
            data: {
                email,
                pwd_hash,
                nombre,
                apeMat,
                apePat,
                dni,
            },
        });
        res.json({ msg: "Asesor creado exitosamente", servicio: nuevoAsesor });
    } catch (error) {
        // Si hay un error, la transacción se revierte y el ID no aumentará
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor." });
    }
};

export const listarAsesores = async (req, res) => {
    try {
        const asesores = await prisma.asesor.findMany();
        return res.status(200).json({
            message: "Asesores encontrados",
            content: asesores,
        });
        
    } catch (err) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: err.message,
        });
    }
};

export const traerAsesorPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const asesor = await prisma.asesor.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!asesor) {
            return res.status(404).json({
                message: "Asesor no encontrado",
            });
        }
        return res.status(200).json({
            message: "Asesor encontrado",
            content: asesor,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
};

// export const traerAsesorPorEspecialidad = async (req, res) => {
//     const { especialidad } = req.params;
//     try {
//         const asesores = await prisma.especialidad.findUnique({
//             where: {
//                 nombre_especialidad: especialidad,
//             },
//             select: {
//                 asesor_especialidad: {
//                     select: {
//                         asesor: {
//                             include: {
//                                 asignacion: true,
//                             },
//                         },
//                     },
//                 },
//             },
//         });

//         if (!asesores) {
//             return res.status(404).json({
//                 message: "Especialidad no encontrada",
//             });
//         }

//         // const asesoresConEspecialidad = asesores.asesor_especialidad.map(item => item.asesor);
//         const asesoresConEspecialidad = asesores.asesor_especialidad.map(item => {
//             const asesorData = item.asesor;
//             const asesoradoData = asesorData.asignacion.map(asignacion => asignacion.usuario);
//             return {
//                 asesor: asesorData,
//                 asesorados: asesoradoData,
//                 especialidad: asesores, // Aquí se guarda la información de la especialidad
//             };
//         });

//         if (asesoresConEspecialidad.length === 0) {
//             return res.status(404).json({
//                 message: "No se encontraron asesores con esa especialidad",
//             });
//         }

//         return res.status(200).json({
//             message: "Asesores encontrados",
//             content: asesoresConEspecialidad,
//         });
//     } catch (error) {
//         return res.status(500).json({
//             message: "Error en el servidor",
//             error: error.message,
//         });
//     }
// };

export const traerAsesorPorEspecialidad = async (req, res) => {
    const { especialidad } = req.params;
    try {
        const asesores = await prisma.asesor.findMany({
            where: {
                asesor_especialidad: {
                    some: {
                        especialidad: {
                            nombre_especialidad: especialidad,
                        },
                    },
                },

            },
            include: {
                asignacion: {
                    include: {
                        usuario: true,
                    }
                },
                asesor_especialidad: {
                    include: {
                        especialidad: true,
                    },
                },
            },
        });

        if (!asesores || asesores.length === 0) {
            return res.status(404).json({
                message: "No se encontraron asesores con esa especialidad",
            });
        }

        return res.status(200).json({
            message: "Asesores encontrados",
            content: asesores,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
};


export const traerUltimoAsesor = async (req,res) =>{
    try{
        const asesor = await prisma.asesor.findFirst({
            orderBy: {
                id: 'desc'
            }
        })
        if (!asesor) {
            return res.status(404).json({
                message: "No se encontró ningún asesor",
            });
        }
        return res.status(200).json({
            message: "Asesor encontrado",
            content: asesor,
        });

    }catch(error){
        return res.status(500).json({
            message: "Error en el servidor",
            error: error.message 
        })
    }
}

export const actualizarAsesor = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const findAsesor = await prisma.asesor.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!findAsesor) {
            return res.status(404).json({
                message: "Asesor no encontrado",
            });
        }

        const asesor = await prisma.asesor.update({
            where: {
                id: Number(id),
            },
            data: {
                pwd_hash: data.pwd_hash,
                email: data.email,
                nombre: data.nombre,
                apeMat: data.apeMat,
                apePat: data.apePat,
                dni: data.dni,
            },
            select: {
                id: true,
                ...(data.pwd_hash && { pwd_hash: true }),
                ...(data.email && { email: true }),
                ...(data.nombre && { nombre: true }),
                ...(data.apeMat && { apeMat: true }),
                ...(data.apePat && { apePat: true }),
                ...(data.dni && { dni: true }),
            },
        });

        return res.status(201).json({
            message: "Asesor actualizado",
            content: asesor,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
};

export const eliminarAsesor = async (req, res) => {
    const { id } = req.params;
    try {
        const findAsesor = await prisma.asesor.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!findAsesor) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        await prisma.asesor.delete({
            where: {
                id: Number(id),
            },
        });
        return res.status(200).json({
            message: "Usuario eliminado",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
};

export const obtenerAsesoresConAsignados = async (req, res) => {
    console.log("Obtener")
    //Realiza un left join
    try {
        const asesores = await prisma.asesor.findMany({
            include: {
                asignacion:{
                    include:{
                        asesor: true,
                        usuario: true
                    }
                },
                asesor_especialidad:{
                    include:{
                        especialidad: true
                    }
                },
                asignacion_secundaria:{
                    include:{
                        asesor: true
                    }
                }
            }
        });
        // console.log(asesores);
        res.json({ content: asesores });
    } catch (error) {
        console.error('Error al obtener asesors con servicios:', error);
        res.status(500).json({ message: 'Error al obtener asesors con servicios' });
    }
};