const express = require('express');
const router = express.Router();
const { autenticarToken } = require('../middleware/auth');
const { obtenerFeedCoches, obtenerFeedCochesPaginad, obtenerTodosCoches } = require('../middleware/feed');

// Obtiene el feed de coches de amigos del usuario actual
router.get('/:user', autenticarToken, async (req, res) => {
    // Extraer el nombre de usuario desde los parámetros de consulta
    const  username  = req.params.user;
    // const usuarioId = req.user.userId; // ID del usuario autenticado extraído del token (opcional)


    // Extraer la fecha límite y el límite desde los parámetros de consulta
    const { fechaLimite, limite } = req.query;

    try {
        // Llamar a la función para obtener el feed de coches
        const coches = await obtenerFeedCoches(
            username, 
            fechaLimite ? new Date(fechaLimite) : null, 
            parseInt(limite) || 20
        );
        res.status(200).send(coches);
    } catch (error) {
        console.error('Error al obtener el feed de coches:', error);
        res.status(500).send({ error: 'Error al obtener el feed de coches' });
    }
});




// Obtiene el feed de coches de amigos con paginación
router.get('/paginado', autenticarToken, async (req, res) => {
    const usuarioId = req.user.userId; // ID del usuario autenticado extraído del token
    const { ultimaFecha, limite } = req.query; // Última fecha y límite opcionales

    try {
        const coches = await obtenerFeedCochesPaginado(usuarioId, ultimaFecha ? new Date(ultimaFecha) : null, parseInt(limite) || 20);
        res.status(200).send(coches);
    } catch (error) {
        console.error('Error en la paginación del feed de coches:', error);
        res.status(500).send({ error: 'Error en la paginación del feed de coches' });
    }
});

module.exports = router;
