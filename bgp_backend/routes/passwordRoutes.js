const express = require('express');
const router = express.Router();
const Users = require('../modelos/users');
const Codes = require('../modelos/codsVerificacion');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');


//Funcion para ver si existe un usuario
async function userExists(username) {
    //Username puede ser username o email
    const user = await Users.findOne({ $or: [{ username }, { email: username }] });
    if (user) {
        return true;
    } else {
        return false;
    }
}
router.post('/existUser', async (req, res) => {
    const { username } = req.body;
    const exists = await userExists(username);
    res.json({ "exists": exists });
});

router.get('/getEmail', async (req, res) => {
    const { username } = req.query;  // Obtener 'username' de los parámetros de la URL

    if (!username) {
        // Si no se pasa el nombre de usuario, devolver un error
        return res.status(400).json({ message: 'El campo username es obligatorio' });
    }

    try {
        const user = await Users.findOne({ $or: [{ username }, { email: username }] });
        return res.json({ email: user.email });

    } catch (error) {
        // Manejo de errores si algo sale mal
        console.error('Error al verificar el usuario:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});


router.post('/sendEmail', async (req, res) => {
    const { email } = req.body;

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
        to: "sergiohrn99@gmail.com",
        subject: '¡Ey, olvidaste tu contraseña?',
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
                            background-color: #FF7043;
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
                            color: #FF7043;
                        }
                        .code-box {
                            margin: 20px 0;
                            padding: 15px;
                            background-color: #f1f1f1;
                            border: 1px solid #FF7043;
                            font-size: 24px;
                            font-weight: bold;
                            color: #FF7043;
                            display: inline-block;
                            border-radius: 5px;
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
                            <h1>¿Olvidaste tu contraseña?</h1>
                        </div>
                        <div class="content">
                            <p>¡Hola!</p>
                            <p>Recibimos una solicitud para restablecer tu contraseña en <strong>GTSpotters</strong>. Si no fuiste tú quien solicitó el cambio, por favor ignora este mensaje.</p>
                            <p>Si eres tú, aquí tienes tu código de verificación:</p>
                            <div class="code-box">${code}</div>
                            <p>Usa este código para restablecer tu contraseña. Si tienes problemas, no dudes en contactarnos.</p>
                        </div>
                        <div class="footer">
                            <p>Gracias por ser parte de GTSpotters. Si necesitas ayuda, estamos aquí para ti.</p>
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

router.post('/sendConfirmationEmail', async (req, res) => {
    const { email } = req.body;

    // Configurar el transporte de correo
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
        to: "sergiohrn99@gmail.com",
        subject: '¡Tu contraseña ha sido actualizada con éxito!',
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
                            background-color: #4CAF50;
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
                            <h1>¡Contraseña actualizada!</h1>
                        </div>
                        <div class="content">
                            <p>¡Hola!</p>
                            <p>Queremos confirmarte que tu contraseña en <strong>GTSpotters</strong> ha sido actualizada correctamente.</p>
                            <p>Si no fuiste tú quien realizó este cambio, por favor contáctanos de inmediato para proteger tu cuenta.</p>
                            <p>Gracias por mantener tu cuenta segura.</p>
                        </div>
                        <div class="footer">
                            <p>Gracias por ser parte de GTSpotters. Si necesitas ayuda, estamos aquí para ti.</p>
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
        res.status(200).send({ message: 'Correo de confirmación enviado correctamente' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).send({ message: 'Error al enviar el correo de confirmación' });
    }
});

router.post('/verificarCodigo', async (req, res) => {
    const { email, code } = req.body;  // Recuperamos el correo y el código desde el cuerpo de la solicitud

    if (!email || !code) {
        return res.status(400).json({ success: false, message: 'Faltan datos. Por favor, ingrese el correo y el código.' });
    }

    try {
        // Buscar el código de verificación por correo electrónico y código
        const verificationCode = await Codes.findOne({ email, code });

        if (!verificationCode) {
            return res.status(400).json({ success: false, message: 'Código incorrecto o no encontrado' });
        }

        // Verificar si el código ha expirado
        if (verificationCode.isExpired()) {
            return res.status(400).json({ success: false, message: 'El código ha expirado. Solicite uno nuevo' });
        }

        // Si el código es válido
        return res.status(200).json({ success: true, message: 'Código verificado exitosamente' });

    } catch (err) {
        // En caso de error al procesar la solicitud
        return res.status(500).json({ success: false, message: 'Error al verificar el código', error: err.message });
    }
});

router.post('/changePassword', async (req, res) => {
    const { email, newPassword } = req.body;  // Recuperamos el correo y la nueva contraseña desde el cuerpo de la solicitud

    // Validamos que se reciban todos los datos
    if (!email || !newPassword) {
        return res.status(400).json({ success: false, message: 'Faltan datos. Por favor, ingrese el correo y la nueva contraseña.' });
    }

    try {
        // Buscar el usuario por email
        const user = await Users.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Actualizar la contraseña del usuario
        user.password = await bcrypt.hash(newPassword, 10);
        ; // Aquí deberías encriptar la contraseña en un caso real
        await user.save(); // Guardar los cambios   
        // Enviar respuesta de éxito
        return res.status(200).json({ success: true, message: 'Contraseña cambiada con éxito' });

    } catch (err) {
        // En caso de error al procesar la solicitud
        return res.status(500).json({ success: false, message: 'Error al cambiar la contraseña', error: err.message });
    }
});


module.exports = router;