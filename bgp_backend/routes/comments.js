const express = require('express');
const router = express.Router();
const { autenticarToken } = require('../middleware/auth');
const Car = require('../models/Car'); // Asegúrate de importar el modelo de Car
const xss = require('xss'); // Para sanitizar entradas de texto

// Ruta para postear un comentario en un coche específico
router.post('/:carId/comentario', autenticarToken, async (req, res) => {
    try {
        const carId = req.params.carId;
        const usuarioId = req.user.userId; // ID del usuario autenticado extraído del token
        let { texto } = req.body;

        // Validar que el texto del comentario no esté vacío
        if (!texto || texto.trim() === '') {
            return res.status(400).json({ error: 'El comentario no puede estar vacío' });
        }

        // Sanitizar el texto para prevenir XSS
        texto = xss(texto.trim());

        // Buscar el coche por su ID
        const coche = await Car.findById(carId);

        if (!coche) {
            return res.status(404).json({ error: 'Coche no encontrado' });
        }

        // Crear el nuevo comentario
        const nuevoComentario = {
            usuario: usuarioId,
            texto: texto,
            fecha: new Date(),
            username: req.user.username, // Asumo que el token también incluye el username
            usuario_imagen: req.user.imagen // Asumo que el token también incluye la imagen de usuario
        };

        // Agregar el comentario al array de comentarios
        coche.comentarios.push(nuevoComentario);

        // Guardar los cambios en la base de datos
        const cocheActualizado = await coche.save();

        // Devolver el comentario recién creado
        const comentarioCreado = cocheActualizado.comentarios[cocheActualizado.comentarios.length - 1];

        res.status(201).json({
            mensaje: 'Comentario posteado exitosamente',
            comentario: comentarioCreado
        });

    } catch (error) {
        console.error('Error al postear comentario:', error);
        res.status(500).json({ 
            error: 'Error al postear comentario',
            details: error.message 
        });
    }
});

module.exports = router;
