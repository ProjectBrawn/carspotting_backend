const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Report = require('../modelos/report');
const User = require('../modelos/users');
const { autenticarToken } = require('../middleware/auth');
const validator = require('validator');
const xss = require('xss');

// Crear un reporte
router.post('/', autenticarToken, async (req, res) => {
    console.log('Creando reporte...');
    try {
        const { tipoReporte, contenido, carId } = req.body;

        // Verificar que el tipo de reporte es válido y no está vacío
        if (!tipoReporte || typeof tipoReporte !== 'string' || tipoReporte.length > 50) {
            return res.status(400).json({ error: 'El tipo de reporte es requerido y debe ser una cadena de texto válida (máximo 50 caracteres)' });
        }

        // Validar el campo contenido (opcional, pero si está presente debe ser texto válido)
        if (contenido && (typeof contenido !== 'string' || contenido.length > 500)) {
            return res.status(400).json({ error: 'El contenido debe ser un texto válido (máximo 500 caracteres)' });
        }

        // Sanitizar las entradas para prevenir inyección de scripts (XSS)
        const sanitizedTipoReporte = xss(tipoReporte);
        const sanitizedContenido = contenido ? xss(contenido) : null;

        // Crear el reporte
        const nuevoReporte = new Report({
            username: req.user.username,  // Usamos el nombre de usuario del token autenticado
            carId,
            tipoReporte: sanitizedTipoReporte,
            contenido: sanitizedContenido
        });

        // Guardar en la base de datos
        await nuevoReporte.save();
        res.status(201).json({ mensaje: 'Reporte creado con éxito', reporte: nuevoReporte });
    } catch (error) {
        console.error('Error al crear el reporte:', error);
        res.status(500).json({ error: 'Error interno del servidor', detalles: error.message });
    }
});

module.exports = router;
