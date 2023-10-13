import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import nodemailer from 'nodemailer';

import { format, addMinutes } from 'date-fns';
const revokedTokens = new Set();
const prisma = new PrismaClient();

const generarCodigoVerificacion = () => {
    // Genera un código de verificación aleatorio (puedes personalizar la lógica según tus necesidades)
    return Math.floor(1000 + Math.random() * 9000).toString();
};

const tiempoExpiracionCodigo = 15; // 15 minutos

export const crearUsuario = async (req, res) => {
    try {
        console.log(req.body);
        const { email, pwd_hash, nombre, apeMat, apePat, pais, dni, celular, departamento, carrera } = req.body;

        const usuarioExistente = await prisma.usuario.findUnique({
            where: {
                email,
            },
        });

        if (usuarioExistente) {
            return res.status(400).json({ msg: "El correo electrónico ya está registrado." });
        }

        const usuarioTemp = await prisma.usuarioTemporal.findUnique({
            where: {
                email,
            },
        })

        if (usuarioTemp) {
            await prisma.usuarioTemporal.delete({
                where: {
                    email,
                },
            });
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.titan.email',
            port: 465,
            auth: {
                user: process.env.EMAIL, // Tu dirección de correo temporal de Ethereal
                pass: process.env.PASS, // Tu contraseña temporal de Ethereal
            },
        });

        const fechaActual = new Date();
        const fechaFormateada = format(fechaActual, 'dd/MM/yyyy');

        const codigoVerificacion = generarCodigoVerificacion();

        // Calcular la fecha de expiración
        const fechaExpiracion = addMinutes(fechaActual, tiempoExpiracionCodigo);

        const usuarioTemporal = await prisma.usuarioTemporal.create({
            data: {
                email,
                pwd_hash: await bcrypt.hash(pwd_hash, 10),
                nombre,
                apeMat,
                apePat,
                dni,
                pais,
                celular,
                departamento,
                carrera,
                verification_code: codigoVerificacion,
                createdAt: fechaFormateada,
                fecha_expiracion: fechaExpiracion,
            },
        });

        const mensaje = `Hola ${usuarioTemporal.nombre} ${usuarioTemporal.apePat}. Te saluda AMDDI, tú código de verificación es: ${usuarioTemporal.verification_code} \n\n ¡Que tenga un buen día!\n\n Saludos cordiales, \n AMDDI`

        const mailOptions = {
            from: process.env.EMAIL,
            to: usuarioTemporal.email,
            subject: 'Código de verificación AMDDI',
            text: mensaje,
        };

        console.log(mailOptions);

        // Aquí puedes enviar el correo electrónico correspondiente
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar correo:', error);
            } else {
                console.log('Correo enviado:', info.response);
            }
        });

        // Respuesta exitosa con el código de verificación
        res.json({ codigoVerificacion, createdAt: fechaFormateada, usuarioTemporal });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor." });
    }
};

export const verificationCode = async (req, res) => {
    try {
        const { email, verificationCode } = req.body;
        console.log(req.body);
        console.log(email, verificationCode)

        const fechaActual = new Date();

        const usuarioTemporal = await prisma.usuarioTemporal.findUnique({
            where: {
                email,
                verification_code: verificationCode,
                fecha_expiracion: {
                    gte: fechaActual, // Verificar que el código no haya expirado
                },
            },
        });

        console.log(usuarioTemporal);

        if (!usuarioTemporal) {
            return res.status(400).json({ msg: "Código de verificación no válido o ha expirado." });
        }

        // Mover los datos de usuarioTemporal a usuario
        await prisma.usuario.create({
            data: {
                email: usuarioTemporal.email,
                pwd_hash: usuarioTemporal.pwd_hash,
                nombre: usuarioTemporal.nombre,
                apeMat: usuarioTemporal.apeMat,
                apePat: usuarioTemporal.apePat,
                dni: usuarioTemporal.dni,
                celular: usuarioTemporal.celular,
                pais: usuarioTemporal.pais,
                departamento: usuarioTemporal.departamento,
                carrera: usuarioTemporal.carrera,
                createdAt: usuarioTemporal.createdAt,
            },
        });

        const userEmail = email;

        const secretKey = process.env.JWT_SECRET; // Reemplaza con tu clave secreta real

        // Generar un token JWT solo con el correo electrónico en el payload
        const payload = {
            email: userEmail,
        };

        // Generar el token JWT
        const token = jwt.sign(payload, secretKey);
        console.log(token);

        // Eliminar la entrada en usuarioTemporal
        await prisma.usuarioTemporal.delete({
            where: {
                email,
            },
        });

        res.json({ msg: "Cuenta creada exitosamente." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor." });
    }
};

export const loginUser = async (req, res) => {
    console.log("hola")
    try {
        const { email, password } = req.body;
        console.log(email, password);
        // Busca al usuario por su correo electrónico en la base de datos
        const user = await prisma.usuario.findUnique({
            where: {
                email,
            },
        });

        // Si el usuario no existe, devuelve un error
        if (!user) {
            return res.status(401).json({ msg: 'Correo electrónico o contraseña incorrectos.' });
        }

        // Compara la contraseña proporcionada con la contraseña almacenada en la base de datos
        const isPasswordValid = await bcrypt.compare(password, user.pwd_hash);

        // Si la contraseña no coincide, devuelve un error
        if (!isPasswordValid) {
            return res.status(401).json({ msg: 'Correo electrónico o contraseña incorrectos.' });
        }
        // console.log(!isPasswordValid);

        // Genera un token JWT con el correo electrónico en el payload
        const secretKey = process.env.SESSION_SECRET; // Reemplaza con tu clave secreta real
        const payload = {
            email: user.email,
        };
        const token = jwt.sign(payload, secretKey);

        // Almacena el token JWT en la sesión del usuario (opcional)
        req.session.token = token;
        console.log(token);

        // Devuelve el token en la respuesta
        res.json({ token, rol: 'user' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
};

export const traerUsuarioPorToken = async (req, res) => {

    try {
        const token = req.header('Authorization');
        console.log(token);
        if (!token) {
            return res.status(401).json({ message: 'Token no proporcionado' });
        }

        const secretKey = process.env.SESSION_SECRET; // Reemplaza con tu clave secreta real
        const tokenWithoutBearer = token.replace('Bearer ', ''); // Elimina "Bearer "
        const decoded = jwt.verify(tokenWithoutBearer, secretKey);

        console.log("hola", decoded);

        const usuario = await prisma.usuario.findUnique({
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
                pais: true,
                carrera: true,
                departamento: true,
                fecha_estimada: true,
                monto_restante: true,
                estado: true,
                usuario_servicio: {
                    include: {
                        servicio: true,
                    },
                },
                pdf_url: {
                    select: {
                        id: true,
                        pdf_url: true,
                    }
                }
            },
        });

        console.log("hola");
        let estados = [];

        if (usuario.usuario_servicio && Array.isArray(usuario.usuario_servicio) && usuario.usuario_servicio.length > 0) {
            console.log("Valor de usuario.usuario_servicio[0].servicio.id:", usuario.usuario_servicio[0].servicio.id);

            if (
                usuario.usuario_servicio[0].servicio.id === 1 ||
                usuario.usuario_servicio[0].servicio.id === 2 ||
                usuario.usuario_servicio[0].servicio.id === 3
            ) {
                console.log("Entró al primer if");
                estados = await prisma.estadoTesis.findMany({ orderBy: { id: 'asc' } });
            } else if (usuario.usuario_servicio[0].servicio.id === 4 ||
                usuario.usuario_servicio[0].servicio.id === 5) {
                console.log("Entró al segundo if");
                estados = await prisma.estadoObservacion.findMany({ orderBy: { id: 'asc' } });
            } else if (usuario.usuario_servicio[0].servicio.id === 6) {
                console.log("Entró al segundo if");
                estados = await prisma.estadoParafraseo.findMany({ orderBy: { id: 'asc' } });
            } else if (usuario.usuario_servicio[0].servicio.id === 7) {
                console.log("Entró al segundo if");
                estados = await prisma.estadoTrabajoSuficiencia.findMany({ orderBy: { id: 'asc' } });
            } else if (usuario.usuario_servicio[0].servicio.id === 8 ||
                usuario.usuario_servicio[0].servicio.id === 9 ||
                usuario.usuario_servicio[0].servicio.id === 10) {
                console.log("Entró al segundo if");
                estados = await prisma.estadoArticulo.findMany({ orderBy: { id: 'asc' } });
            } else if (usuario.usuario_servicio[0].servicio.id === 11) {
                console.log("Entró al segundo if");
                estados = await prisma.estadoMonografia.findMany({ orderBy: { id: 'asc' } });
            } else if (usuario.usuario_servicio[0].servicio.id === 12) {
                console.log("Entró al segundo if");
                estados = await prisma.estadoPlanDeNegocio.findMany({ orderBy: { id: 'asc' } });
            } else if (usuario.usuario_servicio[0].servicio.id === 13) {
                console.log("Entró al segundo if");
                estados = await prisma.estadoInformePracticas.findMany({ orderBy: { id: 'asc' } });
            } else if (usuario.usuario_servicio[0].servicio.id === 14) {
                console.log("Entró al segundo if");
                estados = await prisma.estadoTesinas.findMany({ orderBy: { id: 'asc' } });
            } else if (usuario.usuario_servicio[0].servicio.id === 15) {
                console.log("Entró al segundo if");
                estados = await prisma.estadoDiapositivas.findMany({ orderBy: { id: 'asc' } });
            }
        }


        console.log("usuario", usuario);
        console.log("estados", estados);


        res.status(200).json({
            message: "Usuario encontrado",
            content: {
                usuario: usuario,
                estados: estados
            }
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Token no válido' });
    }
};

export const logoutUser = (req, res) => {
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

export const sendVerificationCode = async (req, res) => {
    console.log("hola")
    try {
        const { email } = req.params;

        // Generar un código de verificación aleatorio (puedes personalizarlo según tus necesidades)
        const codigoVerificacion = Math.floor(1000 + Math.random() * 9000);

        // Guardar el código de verificación en la base de datos asociado al correo electrónico
        const usuario = await prisma.usuario.update({
            where: {
                email: email,
            },
            data: {
                verification_code: codigoVerificacion.toString(),
            },
        });

        console.log(usuario);

        const transporter = nodemailer.createTransport({
            host: 'smtp.titan.email',
            port: 465,
            auth: {
                user: process.env.EMAIL, // Tu dirección de correo temporal de Ethereal
                pass: process.env.PASS, // Tu contraseña temporal de Ethereal
            },
        });

        const mensaje = `Hola ${usuario.nombre} ${usuario.apePat}. Te saluda AMDDI, tú código de verificación es: ${usuario.verification_code} \n\n ¡Que tenga un buen día!\n\n Saludos cordiales, \n AMDDI`

        const mailOptions = {
            from: process.env.EMAIL,
            to: usuario.email,
            subject: 'Código de verificación AMDDI',
            text: mensaje,
        };

        console.log(mailOptions);

        // Aquí puedes enviar el correo electrónico correspondiente
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar correo:', error);
            } else {
                console.log('Correo enviado:', info.response);
            }
        });

        res.json({ msg: "Código de verificación generado exitosamente." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor." });
    }
};

export const verificationCodeCC = async (req, res) => {
    console.log("Verification Code");
    try {
        const { email, codigoVerificacion } = req.body;
        console.log(email, codigoVerificacion)

        const usuarioTemporal = await prisma.usuario.findUnique({
            where: {
                email,
                verification_code: codigoVerificacion,
            },
        });

        if (!usuarioTemporal) {
            return res.status(400).json({ msg: "Código de verificación no válido o ha expirado." });
        }

        res.json({ msg: "Cuenta verificada exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor." });
    }
};


export const listarUsuarios = async (req, res) => {
    try {
        console.log("Antes de obtener usuarios");
        const usuarios = await prisma.usuario.findMany();
        // console.log("Después de obtener usuarios", usuarios);
        res.json({
            message: "Usuarios encontrados",
            content: usuarios,
            // usuarios: [...usuarios] 
        })
        // return res.status(200).json({
        //     message: "Usuarios encontrados",
        //     content: usuarios,
        // });
    } catch (err) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: err.message,
        });
    }
}

export const traerUsuarioPorDNI = async (req, res) => {
    const { dni } = req.params;
    console.log(dni);
    try {
        const usuario = await prisma.usuario.findUnique({
            where: {
                dni: dni,
            },
            select: {
                id: true,
                id_amddi: true,
                nombre: true,
                apeMat: true,
                apePat: true,
                dni: true,
                celular: true,
                carrera: true,
                tema: true,
                monto_total: true,
                monto_restante: true,
                pdf_url: {
                    select: {
                        pdf_url: true,
                        fecha_pdf_url: true
                    }
                },
                usuario_servicio: {
                    include: {
                        servicio: true
                    }
                },
                asignacion: {
                    include: {
                        asesor: true
                    }
                },
                monto_pagado: {
                    select: {
                        monto_pagado: true,
                        fecha_pago: true
                    }
                },
                asignacion_secundaria: {
                    include: {
                        asesor: true
                    }
                },
            }
        });

        if (!usuario) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }
        return res.status(200).json({
            message: "Usuario encontrado",
            content: usuario,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
};

export const traerUsuarioPorIdAmddi = async (req, res) => {
    const { id_amddi } = req.params;
    // const id_amddi = parseInt(id_amddi); 
    console.log(id_amddi);
    try {
        const usuario = await prisma.usuario.findFirst({
            where: {
                id_amddi: id_amddi,
            },
            select: {
                id: true,
                id_amddi: true,
                nombre: true,
                apeMat: true,
                apePat: true,
                dni: true,
                celular: true,
                carrera: true,
                tema: true,
                id_amddi: true,
                monto_total: true,
                monto_restante: true,
                pdf_url: {
                    select: {
                        pdf_url: true,
                        fecha_pdf_url: true
                    }
                },
                usuario_servicio: {
                    include: {
                        servicio: true
                    }
                },
                asignacion: {
                    include: {
                        asesor: true
                    }
                },
                monto_pagado: {
                    select: {
                        monto_pagado: true,
                        fecha_pago: true
                    }
                },
                asignacion_secundaria: {
                    include: {
                        asesor: true
                    }
                },
            }
        });

        console.log(usuario);

        if (!usuario) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }
        return res.status(200).json({
            message: "Usuario encontrado",
            content: usuario,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
};

// Controlador para buscar un usuario por correo electrónico
export const traerUsuarioPorEmail = async (req, res) => {
    const { email } = req.params;
    console.log(email);
    try {
        const usuario = await prisma.usuario.findUnique({
            where: {
                email: email,
            },
            select: {
                id: true,
                nombre: true, // Selecciona el nombre del usuario
                apeMat: true, // Selecciona el apellido materno del usuario
                apePat: true, // Selecciona el apellido paterno del usuario
                email: true,
                dni: true,
                carrera: true,
                departamento: true,
                pais: true,
            },
        });
        if (!usuario) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }
        return res.status(200).json({
            message: "Usuario encontrado",
            content: usuario,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
};


export const actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    console.log("hola")
    console.log(id);
    console.log(data);
    console.log(data.estado);
    try {
        const findUsuario = await prisma.usuario.findUnique({
            where: {
                id: Number(id),
            },
        });

        console.log("usuario encontrado", findUsuario);
        console.log("usuario encontrado", findUsuario);
        console.log("usuario encontrado", findUsuario);

        if (!findUsuario) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }
        // Hash the password if it's provided
        if (data.pwd_hash) {
            const hashedPassword = await bcrypt.hash(data.pwd_hash, 10);
            data.pwd_hash = hashedPassword;
        }

        if ('monto_total' in data) {
            data.monto_total = parseFloat(data.monto_total);
        }


        const usuario = await prisma.usuario.update({
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
                asesor_ventas: data.asesor_ventas,
                estado: data.estado,
                celular: data.celular,
                departamento: data.departamento,
                carrera: data.carrera,
                tema: data.tema,
                pais: data.pais,
                id_amddi: data.id_amddi,
                fecha_estimada: data.fecha_estimada,
                institucion_educativa: data.institucion_educativa,
                pdf_url: data.pdf_url,
                monto_pagado: data.monto_pagado,
                monto_total: data.monto_total,
            },
            select: {
                id: true,
                ...(data.pwd_hash && { pwd_hash: true }),
                ...(data.email && { email: true }),
                ...(data.nombre && { nombre: true }),
                ...(data.apeMat && { apeMat: true }),
                ...(data.apePat && { apePat: true }),
                ...(data.dni && { dni: true }),
                ...(data.estado && { estado: true }),
                ...(data.asesor_ventas && { asesor_ventas: true }),
                ...(data.pais && { pais: true }),
                ...(data.id_amddi && { id_amddi: true }),
                ...(data.celular && { celular: true }),
                ...(data.institucion_educativa && { institucion_educativa: true }),
                ...(data.departamento && { departamento: true }),
                ...(data.carrera && { carrera: true }),
                ...(data.pdf_url && { pdf_url: true }),
                ...(data.monto_pagado && { monto_pagado: true }),
                ...(data.monto_total && { monto_total: true }),
            },
        });
        console.log("Usuario actualizado:", usuario);
        return res.status(201).json({
            message: "Usuario actualizado",
            content: usuario,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
};

export const actualizarUsuarioCC = async (req, res) => {
    const { email } = req.params;
    const data = req.body;
    console.log("holaaa");
    console.log("xdd", data);
    try {
        const findUsuario = await prisma.usuario.findUnique({
            where: {
                email: email,
            },
        });
        console.log(findUsuario);
        if (!findUsuario) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }
        // Hash the password if it's provided
        if (data.pwd_hash) {
            const hashedPassword = await bcrypt.hash(data.pwd_hash, 10);
            data.pwd_hash = hashedPassword;
        }


        const usuario = await prisma.usuario.update({
            where: {
                email: email,
            },
            data: {
                pwd_hash: data.pwd_hash,

            },
        });
        console.log("Usuario actualizado:", usuario);
        return res.status(201).json({
            message: "Usuario actualizado",
            content: usuario,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
};


export const eliminarUsuario = async (req, res) => {
    const { id } = req.params;
    console.log(id);
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
        console.log(findUsuario)

        await prisma.usuario.delete({
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

export const obtenerUsuariosConServicios = async (req, res) => {
    console.log("Obtener")
    //Realiza un left join
    try {
        const usuarios = await prisma.usuario.findMany({
            select: {
                id: true,
                nombre: true,
                email: true,
                apeMat: true,
                apePat: true,
                dni: true,
                celular: true,
                pais: true,
                departamento: true,
                carrera: true,
                tema: true,
                asesor_ventas: true,
                monto_total: true,
                monto_restante: true,
                fecha_estimada: true,
                institucion_educativa: true,
                id_amddi: true,
                estado: true,
                pdf_url: {
                    select: {
                        id: true,
                        pdf_url: true,
                        fecha_pdf_url: true,
                        usuarioId: true
                    }
                },
                usuario_servicio: {
                    include: {
                        servicio: true
                    }
                },
                asignacion: {
                    include: {
                        asesor: true
                    }
                },
                asignacion_secundaria: {
                    include: {
                        asesor: true
                    }
                },
                monto_pagado: {
                    select: {
                        monto_pagado: true,
                        fecha_pago: true
                    }
                }
            }
        });

        // Calcular y actualizar monto_restante para cada usuario
        // for (const usuario of usuarios) {
        //     const montosPagados = usuario.monto_pagado.map((pago) => pago.monto_pagado);
        //     const montoRestante = usuario.monto_total - (montosPagados.reduce((a, b) => a + b, 0) || 0);
        //     usuario.monto_restante = montoRestante;
        // }
        // for (const usuario of usuarios) {
        //     const montosPagados = usuario.monto_pagado.map((pago) => pago.monto_pagado);
        //     const montoRestante = usuario.monto_total - (montosPagados.reduce((a, b) => a + b, 0) || 0);

        //     // Actualizar el monto_restante en la base de datos
        //     await prisma.usuario.update({
        //         where: {
        //             id: usuario.id,
        //         },
        //         data: {
        //             monto_restante: montoRestante,
        //         },
        //     });

        //     // Actualizar el objeto de usuario con el nuevo monto_restante
        //     usuario.monto_restante = montoRestante;
        // }
        for (const usuario of usuarios) {
            const montosPagados = usuario.monto_pagado.map((pago) => pago.monto_pagado);
            const montoRestante = usuario.monto_total - (montosPagados.reduce((a, b) => a + b, 0) || 0);
            console.log(montosPagados)
            if (montoRestante < 0) {
                // Monto restante es negativo, manejar el error aquí
                console.error(`El monto restante para el usuario ${usuario.id} es negativo.`);
                // Puedes lanzar una excepción, retornar un mensaje de error, o realizar cualquier otra acción necesaria.
                // En este ejemplo, se lanzará una excepción.
                throw new Error("El monto restante no puede ser negativo.");
            }

            // Actualizar el monto_restante en la base de datos
            await prisma.usuario.update({
                where: {
                    id: usuario.id,
                },
                data: {
                    monto_restante: montoRestante,
                },
            });

            // Actualizar el objeto de usuario con el nuevo monto_restante
            usuario.monto_restante = montoRestante;
        }


        res.json({ content: usuarios });
    } catch (error) {
        console.error('Error al obtener usuarios con servicios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios con servicios' });
    }
};


export const obtenerServicioPorEmail = async (req, res) => {
    const { email } = req.params;

    try {
        // Buscar el usuario por email
        const usuario = await prisma.usuario.findUnique({
            where: { email },
        });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Buscar el usuario_servicio relacionado con el usuario
        const usuarioServicio = await prisma.usuario_servicio.findUnique({
            where: { id_usuario: usuario.id },
            include: {
                servicio: true,
            },
        });

        if (!usuarioServicio) {
            return res.status(404).json({ message: 'Usuario no tiene un servicio relacionado' });
        }

        // El servicio relacionado está en usuarioServicio.servicio
        const servicio = usuarioServicio.servicio;

        res.json({ content: servicio });
    } catch (error) {
        console.error('Error al obtener servicio por email:', error);
        res.status(500).json({ message: 'Error al obtener servicio por email' });
    }
};

