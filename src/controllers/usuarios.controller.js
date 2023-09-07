import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
        const { email, pwd_hash, nombre, apeMat, apePat, dni, celular, departamento, carrera } = req.body;

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
                celular,
                departamento,
                carrera,
                verification_code: codigoVerificacion,
                createdAt: fechaFormateada,
                fecha_expiracion: fechaExpiracion,
            },
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
        const { email, codigoVerificacion } = req.body;
        console.log(email, codigoVerificacion)
        console.log(email, codigoVerificacion)
        console.log(email, codigoVerificacion)
        console.log(email, codigoVerificacion)
        const fechaActual = new Date();

        const usuarioTemporal = await prisma.usuarioTemporal.findUnique({
            where: {
                email,
                verification_code: codigoVerificacion,
                fecha_expiracion: {
                    gte: fechaActual, // Verificar que el código no haya expirado
                },
            },
        });

        if (!usuarioTemporal) {
            await prisma.usuarioTemporal.delete({
                where: {
                    email,
                },
            });
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
    try {
        const { email, password } = req.body;

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

        // Genera un token JWT con el correo electrónico en el payload
        const secretKey = 'tu-clave-secreta'; // Reemplaza con tu clave secreta real
        const payload = {
            email: user.email,
        };
        const token = jwt.sign(payload, secretKey);

        // Almacena el token JWT en la sesión del usuario (opcional)
        req.session.token = token;

        // Devuelve el token en la respuesta
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor.' });
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
    try {
        const usuario = await prisma.usuario.findUnique({
            where: {
                dni: dni,
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
                nombre: true, // Selecciona el nombre del usuario
                apeMat: true, // Selecciona el apellido materno del usuario
                apePat: true, // Selecciona el apellido paterno del usuario
                email: true,
                dni: true,
                carrera: true,
                departamento: true,
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
        // Hash the password if it's provided
        if (data.pwd_hash) {
            const hashedPassword = await bcrypt.hash(data.pwd_hash, 10);
            data.pwd_hash = hashedPassword;
        }

        if ('monto_pagado' in data) {
            data.monto_pagado = parseFloat(data.monto_pagado);
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
                departamento: data.departamento,
                carrera: data.carrera,
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
                ...(data.departamento && { departamento: true }),
                ...(data.carrera && { carrera: true }),
                ...(data.pdf_url && { pdf_url: true }),
                ...(data.monto_pagado && { monto_pagado: true }),
                ...(data.monto_total && { monto_total: true }),
            },
        });

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
            include: {
                usuario_servicio: {
                    include: {
                        servicio: true
                    }
                },
                asignacion: {
                    include: {
                        asesor: true
                    }
                }
            }
        });

        res.json({ content: usuarios });
    } catch (error) {
        console.error('Error al obtener usuarios con servicios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios con servicios' });
    }
};