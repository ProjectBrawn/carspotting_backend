const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Report = require('../modelos/report');
const User = require('../modelos/users');
const { autenticarToken } = require('../middleware/auth');

// Crear un reporte
router.post('/', autenticarToken, async (req, res) => {
    console.log('Creando reporte...');
    try {
        const { tipoReporte, contenido, carId} = req.body;

        // Verificar que el tipo de reporte es válido
        if (!tipoReporte) {
            return res.status(400).json({ error: 'El tipo de reporte es requerido' });
        }

        // Crear el reporte
        const nuevoReporte = new Report({
            username: req.user.username,
            carId,
            tipoReporte,
            contenido: contenido || null
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
