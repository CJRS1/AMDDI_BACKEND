import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();


export const loginA = async (req, res) => {
    console.log("Ingresó al login")
    try {
        const { email, password } = req.body;

        // Busca al asesor por su correo electrónico en la base de datos
        const asesor = await prisma.asesor.findUnique({
            where: {
                email,
            },
        });
        console.log(asesor);
        // Si no se encuentra al asesor, busca al administrador
        if (!asesor) {
            const admin = await prisma.admin.findUnique({
                where: {
                    email,
                },
            });
            console.log(admin);

            // Comprueba si el administrador existe
            if (!admin) {
                return res.status(401).json({ msg: 'El correo no existe' });
            }

            // Compara la contraseña proporcionada con la contraseña del administrador
            if (!(await bcrypt.compare(password, admin.pwd_hash))) {
                console.log(password);
                console.log(admin.pwd_hash);
                return res.status(401).json({ msg: 'Accesso no autorizado' });
            }

            // Genera un token JWT con el correo electrónico y rol en el payload
            const secretKey = process.env.SESSION_SECRET_AD;
            const payload = {
                email,
                rol: 'admin', // Rol del administrador
            };
            const token = jwt.sign(payload, secretKey);

            // Almacena el token JWT en la sesión del usuario (opcional)
            req.session.token = token;

            // Devuelve el token y el rol en la respuesta
            return res.json({ token, rol: 'admin' });
        }

        const pw = await bcrypt.compare(password, asesor.pwd_hash);
        console.log('Password ingresada:', password);
        console.log('Hash de contraseña almacenado:', asesor.pwd_hash);
        console.log('Resultado de bcrypt.compare():', pw);


        if (!(await bcrypt.compare(password, asesor.pwd_hash))) {
            console.log(password);
            console.log(asesor.pwd_hash);
            console.log(asesor.pwd_hash);
            return res.status(401).json({ msg: 'Acceso no autorizado' });
        }

        const secretKey = process.env.SESSION_SECRET_A;
        const payload = {
            email,
            rol: 'asesor', // Rol del asesor
        };
        const token = jwt.sign(payload, secretKey);
        console.log(token);
        // Almacena el token JWT en la sesión del usuario (opcional)
        req.session.token = token;

        // Devuelve el token y el rol en la respuesta
        res.json({ token, rol: 'asesor' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
};

export const traerAsesorPorToken = async (req, res) => {

    try {
        // Obtiene el token del encabezado de la solicitud
        const token = req.header('Authorization');
        console.log(token);
        // Verifica si el token existe
        if (!token) {
            return res.status(401).json({ message: 'Token no proporcionado' });
        }

        // Verifica y decodifica el token utilizando tu clave secreta
        const secretKey = process.env.SESSION_SECRET_A; // Reemplaza con tu clave secreta real
        const tokenWithoutBearer = token.replace('Bearer ', ''); // Elimina "Bearer "
        const decoded = jwt.verify(tokenWithoutBearer, secretKey);

        console.log("hola", decoded);

        // Utiliza la información del token para buscar los datos del asesor en tu base de datos
        const asesor = await prisma.asesor.findUnique({
            where: {
                email: decoded.email,
            },
            select: {
                id: true,
                nombre: true,
                apeMat: true,
                apePat: true,
                email: true,
                dni: true,
                rol: true,
                asesor_especialidad: {
                    include: {
                        especialidad: true,
                    },
                },
                asignacion: {
                    include: {
                        usuario: {
                            select: {
                                id: true,
                                nombre: true,
                                apeMat: true,
                                apePat: true,
                                email: true,
                                dni: true,
                                rol: true,
                                tema: true,
                                id_amddi: true,
                                estado: true,
                                link_reunion: true,
                                fecha_estimada: true,
                                usuario_servicio: {
                                    include: {
                                        servicio: true
                                    }
                                },
                                monto_pagado: {
                                    select: {
                                        fecha_pago: true
                                    }
                                },
                                pdf_url: {
                                    select: {
                                        id: true,
                                        pdf_url: true,
                                        fecha_pdf_url: true,
                                        usuarioId: true
                                    }
                                },
                            },
                        }
                    },
                },
                asignacion_secundaria: {
                    include: {
                        usuario: {
                            select: {
                                id: true,
                                nombre: true,
                                apeMat: true,
                                apePat: true,
                                email: true,
                                dni: true,
                                rol: true,
                                tema: true,
                                id_amddi: true,
                                estado: true,
                                link_reunion: true,
                                fecha_estimada: true,
                                usuario_servicio: {
                                    include: {
                                        servicio: true
                                    }
                                },
                                monto_pagado: {
                                    select: {
                                        fecha_pago: true
                                    }
                                },
                                pdf_url: {
                                    select: {
                                        id: true,
                                        pdf_url: true,
                                        fecha_pdf_url: true,
                                        usuarioId: true
                                    }
                                },
                            }
                        }
                    }
                }
            },
        });

        console.log("asesor",asesor);



        let estadosAsesores = {};

        for (let i = 0; i < asesor.asignacion.length; i++) {
            const servicioId = asesor.asignacion[i].usuario.usuario_servicio[0].servicio.id;
            const asesorId = asesor.id; // Adjust this based on your data model

            console.log(`Asignación ${i + 1}: Servicio ID = ${servicioId}`);
            let estadosServicio = [];
            switch (servicioId) {
                case 1:
                case 2:
                case 3:
                    console.log("Entró al primer if");
                    estadosServicio = await prisma.estadoTesis.findMany({ orderBy: { id: 'asc' } });
                    break;
                case 4:
                case 5:
                    console.log("Entró al segundo if");
                    estadosServicio = await prisma.estadoObservacion.findMany({ orderBy: { id: 'asc' } });
                    break;
                case 6:
                    console.log("Entró al tercer if");
                    estadosServicio = await prisma.estadoParafraseo.findMany({ orderBy: { id: 'asc' } });
                    break;
                case 7:
                    console.log("Entró al cuarto if");
                    estadosServicio = await prisma.estadoTrabajoSuficiencia.findMany({ orderBy: { id: 'asc' } });
                    break;
                case 8:
                case 9:
                case 10:
                    console.log("Entró al quinto if");
                    estadosServicio = await prisma.estadoArticulo.findMany({ orderBy: { id: 'asc' } });
                    break;
                case 11:
                    console.log("Entró al sexto if");
                    estadosServicio = await prisma.estadoMonografia.findMany({ orderBy: { id: 'asc' } });
                    break;
                case 12:
                    console.log("Entró al séptimo if");
                    estadosServicio = await prisma.estadoPlanDeNegocio.findMany({ orderBy: { id: 'asc' } });
                    break;
                case 13:
                    console.log("Entró al octavo if");
                    estadosServicio = await prisma.estadoInformePracticas.findMany({ orderBy: { id: 'asc' } });
                    break;
                case 14:
                    console.log("Entró al noveno if");
                    estadosServicio = await prisma.estadoTesinas.findMany({ orderBy: { id: 'asc' } });
                    break;
                case 15:
                    console.log("Entró al décimo if");
                    estadosServicio = await prisma.estadoDiapositivas.findMany({ orderBy: { id: 'asc' } });
                    break;
                default:
                    console.log("Servicio no reconocido");
            }
            if (!estadosAsesores[asesorId]) {
                estadosAsesores[asesorId] = [];
            }

            estadosAsesores[asesorId] = estadosAsesores[asesorId].concat(estadosServicio);
        }
        
        console.log("estados", estados);
        console.log("estados", estados);

        // console.log("asesor", asesor);
        // Verifica si se encontraron los datos del asesor
        if (!asesor) {
            return res.status(404).json({ message: 'Asesor no encontrado' });
        }

        // Devuelve los datos del asesor en la respuesta
        res.status(200).json({
            message: "Asesor encontrado",
            content: {
                asesor: asesor,
                estados: estadosAsesores
            }
        });
    } catch (error) {
        // console.error(error);
        // res.status(401).json({ message: 'Token no válido' });
    }
};

export const logoutA = (req, res) => {
    try {
        // Si estás utilizando tokens JWT, puedes invalidar el token aquí
        // Opcionalmente, puedes borrar el token de la sesión si lo almacenaste allí

        // Destruye la sesión en el servidor
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ msg: 'Error al cerrar sesión.' });
            } else {
                res.clearCookie('sessionCookie'); // Elimina la cookie de sesión (cambia el nombre según tu configuración)
                res.json({ msg: 'Sesión cerrada con éxito' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
};

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
            // El DNI ya está en uso
            return res.status(400).json({ msg: "El DNI ya está registrado." });
        }

        // Hashea la contraseña antes de almacenarla
        const saltRounds = 10; // Número de rondas de hashing (ajusta según tu necesidad)
        const hashedPwd = await bcrypt.hash(pwd_hash, saltRounds);

        // Iniciar transacción
        const nuevoAsesor = await prisma.asesor.create({
            data: {
                email,
                pwd_hash: hashedPwd, // Almacena la contraseña hasheada
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
        const asesores = await prisma.asesor.findMany({
            select: {
                id: true,
                email: true,
                nombre: true,
                apeMat: true,
                apePat: true,
                dni: true,
                rol: true
            }
        });
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
            select: {
                id: true,
                email: true,
                nombre: true,
                apeMat: true,
                apePat: true,
                dni: true,
                rol: true
            }
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

export const traerAsesorPorEmail = async (req, res) => {
    const { email } = req.params;
    console.log(email);
    try {
        const asesor = await prisma.asesor.findUnique({
            where: {
                email: email,
            },
            select: {
                id: true,
                email: true,
                nombre: true,
                apeMat: true,
                apePat: true,
                dni: true,
                rol: true
            }
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


export const traerUltimoAsesor = async (req, res) => {
    try {
        const asesor = await prisma.asesor.findFirst({
            orderBy: {
                id: 'desc'
            },
            select: {
                id: true,
                email: true,
                nombre: true,
                apeMat: true,
                apePat: true,
                dni: true,
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

    } catch (error) {
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

        await prisma.asignacion_secundaria.deleteMany({
            where: {
                id_asesor: Number(id)
            }
        })

        await prisma.asignacion.deleteMany({
            where: {
                id_asesor: Number(id)
            }
        })

        await prisma.asesor_especialidad.deleteMany({
            where: {
                id_asesor: Number(id)
            }
        })

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
    console.log("Entró aquí")
    //Realiza un left join
    try {
        const asesores = await prisma.asesor.findMany({
            select: {
                id: true,
                email: true,
                nombre: true,
                apeMat: true,
                apePat: true,
                dni: true,
                asignacion: {
                    include: {
                        asesor: {
                            select: {
                                id: true,
                                email: true,
                                nombre: true,
                                apeMat: true,
                                apePat: true,
                                dni: true,
                            },
                        },
                        usuario: {
                            select: {
                                id: true,
                                email: true,
                                nombre: true,
                                apeMat: true,
                                apePat: true,
                                dni: true,
                                estado: true,
                            },
                        },
                    },
                },
                asesor_especialidad: {
                    include: {
                        especialidad: true,
                    },
                },
                asignacion_secundaria: {
                    include: {
                        asesor: {
                            select: {
                                id: true,
                                email: true,
                                nombre: true,
                                apeMat: true,
                                apePat: true,
                                dni: true,
                            },
                        },
                        usuario: {
                            select: {
                                id: true,
                                email: true,
                                nombre: true,
                                apeMat: true,
                                apePat: true,
                                dni: true,
                                tema: true,
                                estado: true,
                                link_reunion: true,
                                fecha_estimada: true,
                            },
                        },
                    },
                },
            },
        });


        // console.log(asesores);
        res.json({ content: asesores });
    } catch (error) {
        console.error('Error al obtener asesors con servicios:', error);
        res.status(500).json({ message: 'Error al obtener asesors con servicios' });
    }
};

// Controlador de inicio de sesión en el servidor



        // Asumiendo que asesor.asignacion es un arreglo
        // for (let i = 0; i < asesor.asignacion.length; i++) {
        //     const servicioId = asesor.asignacion[i].usuario.usuario_servicio[0].servicio.id;
        //     console.log(`Asignación ${i + 1}: Servicio ID = ${servicioId}`);
        //     if (
        //         usuario.usuario_servicio[0].servicio.id === 1 ||
        //         usuario.usuario_servicio[0].servicio.id === 2 ||
        //         usuario.usuario_servicio[0].servicio.id === 3
        //     ) {
        //         console.log("Entró al primer if");
        //         estados = await prisma.estadoTesis.findMany({ orderBy: { id: 'asc' } });
        //     } else if (usuario.usuario_servicio[0].servicio.id === 4 ||
        //         usuario.usuario_servicio[0].servicio.id === 5) {
        //         console.log("Entró al segundo if");
        //         estados = await prisma.estadoObservacion.findMany({ orderBy: { id: 'asc' } });
        //     } else if (usuario.usuario_servicio[0].servicio.id === 6) {
        //         console.log("Entró al segundo if");
        //         estados = await prisma.estadoParafraseo.findMany({ orderBy: { id: 'asc' } });
        //     } else if (usuario.usuario_servicio[0].servicio.id === 7) {
        //         console.log("Entró al segundo if");
        //         estados = await prisma.estadoTrabajoSuficiencia.findMany({ orderBy: { id: 'asc' } });
        //     } else if (usuario.usuario_servicio[0].servicio.id === 8 ||
        //         usuario.usuario_servicio[0].servicio.id === 9 ||
        //         usuario.usuario_servicio[0].servicio.id === 10) {
        //         console.log("Entró al segundo if");
        //         estados = await prisma.estadoArticulo.findMany({ orderBy: { id: 'asc' } });
        //     } else if (usuario.usuario_servicio[0].servicio.id === 11) {
        //         console.log("Entró al segundo if");
        //         estados = await prisma.estadoMonografia.findMany({ orderBy: { id: 'asc' } });
        //     } else if (usuario.usuario_servicio[0].servicio.id === 12) {
        //         console.log("Entró al segundo if");
        //         estados = await prisma.estadoPlanDeNegocio.findMany({ orderBy: { id: 'asc' } });
        //     } else if (usuario.usuario_servicio[0].servicio.id === 13) {
        //         console.log("Entró al segundo if");
        //         estados = await prisma.estadoInformePracticas.findMany({ orderBy: { id: 'asc' } });
        //     } else if (usuario.usuario_servicio[0].servicio.id === 14) {
        //         console.log("Entró al segundo if");
        //         estados = await prisma.estadoTesinas.findMany({ orderBy: { id: 'asc' } });
        //     } else if (usuario.usuario_servicio[0].servicio.id === 15) {
        //         console.log("Entró al segundo if");
        //         estados = await prisma.estadoDiapositivas.findMany({ orderBy: { id: 'asc' } });
        //     }
        // }