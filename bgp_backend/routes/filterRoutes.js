const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Token = require('../modelos/token');
const Posts = require('../modelos/posts');
const { obtenerTodosCoches } = require('../middleware/posts');
const sanitizeHtml = require('sanitize-html'); // Para limpiar entradas HTML

const { autenticarToken, SECRET_KEY } = require('../middleware/auth');

router.get('/', autenticarToken, async (req, res) => {
    try {
        // Recoger los parámetros de la consulta (query) de la solicitud
        const { marca, modelo, generacion, anyo, ubicacion } = req.query;

        // Crear un objeto de filtro vacío
        const filtro = {};

        // Validar y filtrar los parámetros de consulta

        // Si se proporciona una marca, validar y agregarla al filtro
        if (marca) {
            if (typeof marca !== 'string' || marca.trim().length === 0) {
                return res.status(400).json({ error: 'La marca debe ser una cadena no vacía.' });
            }
            filtro.marca = { $regex: sanitizeInput(marca), $options: 'i' }; // Filtrado insensible a mayúsculas/minúsculas
        }

        // Si se proporciona un modelo, validar y agregarlo al filtro
        if (modelo) {
            if (typeof modelo !== 'string' || modelo.trim().length === 0) {
                return res.status(400).json({ error: 'El modelo debe ser una cadena no vacía.' });
            }
            filtro.modelo = { $regex: sanitizeInput(modelo), $options: 'i' };
        }

        // Si se proporciona una generación, validar y agregarla al filtro
        if (generacion) {
            if (typeof generacion !== 'string' || generacion.trim().length === 0) {
                return res.status(400).json({ error: 'La generación debe ser una cadena no vacía.' });
            }
            filtro.generacion = { $regex: sanitizeInput(generacion), $options: 'i' };
        }

        // Si se proporciona un año, validar y agregarlo al filtro
        if (anyo) {
            const parsedAnyo = parseInt(anyo, 10);
            if (isNaN(parsedAnyo) || parsedAnyo < 1886 || parsedAnyo > new Date().getFullYear()) {
                return res.status(400).json({ error: 'El año debe ser un número válido entre 1886 y el año actual.' });
            }
            filtro.anyo = parsedAnyo;
        }

        // Si se proporciona una ubicación, validar y agregarla al filtro
        if (ubicacion) {
            if (typeof ubicacion !== 'string' || ubicacion.trim().length === 0) {
                return res.status(400).json({ error: 'La ubicación debe ser una cadena no vacía.' });
            }
            filtro['ubicacion.direccion'] = { $regex: sanitizeInput(ubicacion), $options: 'i' };
        }

        // Realizar la consulta en la base de datos utilizando el filtro
        // y ordenar por fecha_captura descendente (más reciente primero)
        const coches = await Posts.find(filtro).sort({ fecha_captura: -1 }); // -1 para orden descendente

        // Si se encuentran coches, devolverlos con un estado 200
        res.status(200).json(coches);
    } catch (error) {
        console.error('Error al filtrar los coches:', error);
        // Si ocurre un error, devolver un mensaje de error con un estado 500
        res.status(500).json({
            error: 'Error al filtrar los coches',
            details: error.message
        });
    }
});

// Función auxiliar para limpiar entradas maliciosas
function sanitizeInput(input) {
    // Normalizar la cadena: eliminar tildes y convertir a minúsculas
    return input
        .normalize('NFD') // Descomponer caracteres acentuados
        .replace(/[\u0300-\u036f]/g, '') // Eliminar marcas de acento
        .toLowerCase() // Convertir a minúsculas
        .replace(/[\$<>]/g, ''); // Eliminar caracteres especiales que puedan usarse para inyecciones
}

module.exports = router;
