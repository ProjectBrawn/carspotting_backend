const express = require('express');
const router = express.Router();
const { autenticarToken } = require('../middleware/auth');
const Medalla = require('../modelos/achievements'); // Asegúrate de que la ruta sea correcta
const mongoose = require('mongoose');

// Obtiene una medalla por su ID
router.get('/:id', autenticarToken, async (req, res) => {
    console.log("dentrode medalll")
    const medallaId = req.params.id;

    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(medallaId)) {
        return res.status(400).send({ error: 'ID de medalla inválido' });
    }

    try {
        const medalla = await Medalla.findById(medallaId);
        
        if (!medalla) {
            return res.status(404).send({ error: 'Medalla no encontrada' });
        }

        res.status(200).send(medalla);
    } catch (error) {
        console.error('Error al obtener la medalla:', error);
        res.status(500).send({ error: 'Error al obtener la medalla' });
    }
});

// Obtiene todas las medallas (con opciones de filtrado)
router.get('/', autenticarToken, async (req, res) => {
    console.log("dentrode medalll1")
    const { nombre, puntos_min, fecha_desde } = req.query;
    
    try {
        let query = {};

        // Aplicar filtros si se proporcionan
        if (nombre) {
            query.nombre = { $regex: nombre, $options: 'i' }; // Búsqueda case-insensitive
        }
        if (puntos_min) {
            query.puntos = { $gte: parseInt(puntos_min) };
        }
        if (fecha_desde) {
            query.fecha_creacion = { $gte: new Date(fecha_desde) };
        }

        const medallas = await Medalla.find(query);
        res.status(200).send(medallas);
    } catch (error) {
        console.error('Error al obtener las medallas:', error);
        res.status(500).send({ error: 'Error al obtener las medallas' });
    }
});

module.exports = router;