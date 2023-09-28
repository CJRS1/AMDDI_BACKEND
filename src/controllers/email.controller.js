import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function enviarNotificaciones() {
    try {
        const usuarios = await prisma.usuario.findMany({
            select: {
                id: true,
                fecha_estimada: true,
                id_amddi: true,
                asignacion: {
                    include: {
                        asesor: true,
                    }
                } // Incluir información del asesor
            },
        });

        console.log("hola", usuarios);

        usuarios.forEach((usuario) => {
            const { id, fecha_estimada, asignacion } = usuario;
            console.log(`Usuario ID: ${id}`);
            console.log(`Fecha Estimada: ${fecha_estimada}`);

            if (asignacion[0] && asignacion[0].asesor) {
                const asesorEmail = asignacion[0].asesor.email;
                console.log(`Correo Electrónico del Asesor: ${asesorEmail}`);
            } else {
                console.log("El usuario no tiene asignado un asesor o el asesor no tiene correo electrónico.");
            }
        });

        const transporter = nodemailer.createTransport({
            host: 'smtp.titan.email',
            port: 465,
            auth: {
                user: process.env.EMAIL, // Tu dirección de correo temporal de Ethereal
                pass: process.env.PASS, // Tu contraseña temporal de Ethereal
            },
        });


        const hoy = new Date();

        for (const usuario of usuarios) {
            const fechaEstimadaStr = usuario.fecha_estimada; // Obtén la fecha estimada como cadena
            const [diaEstimado, mesEstimado, anioEstimado] = fechaEstimadaStr.split('/').map(Number); // Divide la cadena en día, mes y año y convierte a números

            // Verificar si los valores son válidos
            if (!isNaN(diaEstimado) && !isNaN(mesEstimado) && !isNaN(anioEstimado)) {
                // Crear el objeto Date con el formato "yyyy/mm/dd" para evitar confusiones
                const fechaEstimada = new Date(anioEstimado, mesEstimado - 1, diaEstimado); // Restamos 1 al mes porque en JavaScript los meses van de 0 a 11

                // Verificar si la fecha estimada es válida
                if (!isNaN(fechaEstimada.getTime())) {
                    // Calcular los días restantes solo si la fecha estimada es válida
                    const tiempoRestanteMillis = fechaEstimada - hoy;
                    const diasRestantes = Math.ceil(tiempoRestanteMillis / (1000 * 60 * 60 * 24));

                    // Formatear la fecha estimada en el formato d/m/yyyy
                    const fechaEstimadaFormateada = `${diaEstimado}/${mesEstimado}/${anioEstimado}`;

                    const mensaje = `Faltan ${diasRestantes} días para la fecha de entrega (${fechaEstimadaFormateada}).`;

                    console.log(mensaje);

                    if (diasRestantes === 7) {
                        const mensaje = ` Hola ${usuario.asignacion[0].asesor.nombre}. Te escribimos de parte de AMDDI para recordarte que faltan ${diasRestantes} días para la fecha de entrega. La fecha de entrega es: ${fechaEstimadaFormateada}. \n\n Saludos cordiales, \n AMDDI`;

                        const mailOptions = {
                            from: process.env.EMAIL,
                            to: usuario.asignacion[0].asesor.email,
                            // to: 'a20132578@gmail.com',
                            subject: 'Recordatorio de entrega de trabajo AMDDI',
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
                    }
                    if (diasRestantes === 3) {
                        const mensaje = ` Hola ${usuario.asignacion[0].asesor.nombre}. Te escribimos de parte de AMDDI para recordarte que faltan ${diasRestantes} días para la fecha de entrega. La fecha de entrega es: ${fechaEstimadaFormateada}. \n\n Saludos cordiales, \n AMDDI`;

                        const mailOptions = {
                            from: process.env.EMAIL,
                            to: usuario.asignacion[0].asesor.email,
                            // to: 'a20132578@gmail.com',
                            subject: 'Recordatorio de entrega de trabajo AMDDI',
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
                    }
                    if (diasRestantes === 0) {
                        const mensaje = ` Hola ${usuario.asignacion[0].asesor.nombre}. Te escribimos de parte de AMDDI para recordarte que hoy es la entrega del proyecto del usuario con id: ${usuario.id_amddi}. \n\n Saludos cordiales, \n AMDDI`;

                        const mailOptions = {
                            from: process.env.EMAIL,
                            to: usuario.asignacion[0].asesor.email,
                            // to: 'a20132578@gmail.com',
                            subject: 'Recordatorio de entrega de trabajo AMDDI',
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
                    }


                    // Luego puedes enviar el correo electrónico aquí si lo deseas
                } else {
                    console.log(`La fecha estimada para el usuario ID ${usuario.id} no es válida.`);
                }
            } else {
                console.log(`El formato de fecha estimada para el usuario ID ${usuario.id} es incorrecto.`);
            }
        }


    } catch (error) {
        console.error('Error al obtener usuarios:', error);
    }
}

// Ejecutar la función cada día
// setInterval(enviarNotificaciones, 24 * 60 * 60 * 1000);
// enviarNotificaciones();
