import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

        // Iniciar transacción
        await prisma.$transaction([
            prisma.asesor.create({
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
                // Hash the password if it's provided
                if (data.pwd_hash) {
                    const hashedPassword = await bcrypt.hash(data.pwd_hash, 10);
                    data.pwd_hash = hashedPassword;
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
