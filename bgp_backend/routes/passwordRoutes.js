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
    console.log(email);

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
        subject: '"Ey, olvidaste tu contraseña?"',
        text: `Tu código de verificación es: ${code}`,
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