const express = require('express');
const router = express.Router();
const Users = require('../modelos/users');
const Codes = require('../modelos/codsVerificacion');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

router.post('/sendWelcomeEmail', async (req, res) => {
    const { email, username } = req.body;

    //Generar un codigo aleatorio de 6 digitos
    const code = Math.floor(100000 + Math.random() * 900000);

    //Ahora hay que enviar el mail

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'projectbrawn@gmail.com',
            pass: 'lpgt uuqs blpo fwgd',
        },
    });

    // Opciones del correo
    const mailOptions = {
        from: 'projectbrawn@gmail.com',
        to: email,
        subject: '¡Bienvenido a GTSpotters!',
        html: `
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                            text-align: center;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background-color: #007BFF;
                            padding: 40px 20px;
                            color: white;
                            text-align: center;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 36px;
                        }
                        .content {
                            padding: 20px;
                            color: #333;
                        }
                        .content p {
                            font-size: 16px;
                            line-height: 1.6;
                        }
                        .highlight {
                            font-size: 18px;
                            font-weight: bold;
                            color: #007BFF;
                        }
                        .footer {
                            background-color: #f9f9f9;
                            padding: 20px;
                            font-size: 14px;
                            color: #888;
                        }
                        .footer p {
                            margin: 10px 0 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>¡Bienvenido a GTSpotters!</h1>
                        </div>
                        <div class="content">
                            <p>¡Hola <span class="highlight">${username}</span>!</p>
                            <p>Nos complace darte la bienvenida a <strong>GTSpotters</strong>, una comunidad llena de entusiastas de los coches y sus avistamientos. Estamos emocionados de que te hayas unido a nosotros.</p>
                            <p>Explora, comparte tus pasiones y disfruta de la mejor experiencia en el mundo del automovilismo. ¡Tu viaje comienza ahora!</p>
                            <p>Estamos aquí para ayudarte en todo lo que necesites. Si tienes alguna pregunta o sugerencia, no dudes en ponerte en contacto con nosotros.</p>
                        </div>
                        <div class="footer">
                            <p>Gracias por unirte a GTSpotters. ¡Esperamos que disfrutes mucho esta nueva aventura!</p>
                            <p>&copy; ${new Date().getFullYear()} GTSpotters. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </body>
            </html>
        `,
    };

    try {
        // Enviar el correo
        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: 'Correo enviado correctamente', code });

        //Ahora metemos el codigo en la base de datos de codes
        const newCode = new Codes({ email, code });
        await newCode.save();

    } catch (error) {
        res.status(500).send({ message: 'Error al enviar el correo' });
    }


});


module.exports = router;