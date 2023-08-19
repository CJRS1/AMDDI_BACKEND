import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const crearUsuario = async (req, res) => {
    try {
        const { email, pwd_hash, nombre, apeMat, apePat, dni, departamento, carrera } = req.body;

        const existingUser = await prisma.usuario.findUnique({
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
            prisma.usuario.create({
                data: {
                    email,
                    pwd_hash: await bcrypt.hash(pwd_hash, 10),
                    nombre,
                    apeMat,
                    apePat,
                    dni,
                    departamento,
                    carrera,
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

export const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany();
        return res.status(200).json({
            message: "Usuarios encontrados",
            content: usuarios,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: err.message,
        });
    }
}

export const traerUsuarioPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await prisma.usuario.findUnique({
            where: {
                id: Number(id),
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
