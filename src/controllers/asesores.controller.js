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
}