import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const crearAdmin = async (req, res) => {
    try {
        const { email, pwd_hash, nombre, apeMat, apePat, dni } = req.body;

        const existingUser = await prisma.admin.findUnique({
            where: {
                email: email,
            },
        });

        if (existingUser) {
            // El correo electrónico ya está en uso
            return res.status(400).json({ msg: "El correo electrónico ya está registrado." });
        }

        // Iniciar transacción
        await prisma.$transaction([
            prisma.admin.create({
                data: {
                    email,
                    pwd_hash: await bcrypt.hash(pwd_hash, 10),
                    nombre,
                    apeMat,
                    apePat,
                    dni,
                },
            }),
        ]);

        // Generar JWT y enviar respuesta
        const token = jwt.sign({ email }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        // Si hay un error, la transacción se revierte y el ID no aumentará
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor." });
    }
};

export const listarAdmins = async (req, res) => {
    try {
        const admins = await prisma.admin.findMany();
        return res.status(200).json({
            message: "Admins encontrados",
            content: admins,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: err.message,
        });
    }
};

export const traerAdminPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const admin = await prisma.admin.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!admin) {
            return res.status(404).json({
                message: "Admin no encontrado",
            });
        }
        return res.status(200).json({
            message: "Admin encontrado",
            content: admin,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
};

export const actualizarAdmin = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const findAdmin = await prisma.admin.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!findAdmin) {
            return res.status(404).json({
                message: "Admin no encontrado",
            });
        }
                // Hash the password if it's provided
                if (data.pwd_hash) {
                    const hashedPassword = await bcrypt.hash(data.pwd_hash, 10);
                    data.pwd_hash = hashedPassword;
                }
                // if (data.email && !isValidEmail(data.email)) {
                //     return res.status(400).json({
                //         message: "El correo electrónico no es válido",
                //     });
                // }
        const admin = await prisma.admin.update({
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
            message: "Admin actualizado",
            content: admin,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
};

export const eliminarAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        const findAdmin = await prisma.admin.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!findAdmin) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        await prisma.admin.delete({
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

// function isValidEmail(email) {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
// }