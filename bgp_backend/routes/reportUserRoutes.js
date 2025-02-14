const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ReportUser = require('../modelos/reportUser');
const User = require('../modelos/users');
const { autenticarToken } = require('../middleware/auth');
const validator = require('validator');
const xss = require('xss');

// Crear un reporte
router.post('/', autenticarToken, async (req, res) => {
    console.log("Entramos aquí");
    try {
        const { username, usernameDestiny, tipoReporte, comentario } = req.body;

        // Validar si todos los campos requeridos están presentes
        if (!username || !usernameDestiny || !tipoReporte) {
            return res.status(400).json({ message: "Todos los campos requeridos deben estar completos." });
        }

        // Validar tipo de reporte
        const tiposValidos = ['wrong_car', 'inappropriate', 'spam', 'fraud', 'harassment', 'impersonation'];
        if (!tiposValidos.includes(tipoReporte)) {
            return res.status(400).json({ message: "Tipo de reporte no válido." });
        }

        // Verificar si ya existe un reporte igual en la base de datos
        const reporteExistente = await ReportUser.findOne({ username, usernameDestiny, tipoReporte });

        if (reporteExistente) {
            return res.status(409).json({ message: "Ya has reportado a este usuario por el mismo motivo." });
        }

        // Crear nuevo reporte
        const nuevoReporte = new ReportUser({
            username,
            usernameDestiny,
            tipoReporte,
            comentario
        });

        // Guardar en la base de datos
        await nuevoReporte.save();
        console.log("Guardado el reporte");

        res.status(200).json({ message: "Reporte creado con éxito.", reporte: nuevoReporte });

    } catch (error) {
        console.error("Error al crear el reporte:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});


module.exports = router;
