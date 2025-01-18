const express = require('express');
const router = express.Router();
const { autenticarToken } = require('../middleware/auth');
const { obtenerFeedCoches, obtenerFeedCochesPaginad, obtenerTodosCoches } = require('../middleware/feed');

// Obtiene el feed de coches de amigos del usuario actual
router.get('/:user', autenticarToken, async (req, res) => {
    // Extraer el nombre de usuario desde los parámetros de consulta
    const userId  = req.params.user;


    // Extraer la fecha límite y el límite desde los parámetros de consulta
    const { fechaLimite, limite } = req.query;

    try {
        // Llamar a la función para obtener el feed de coches
        const posts = await obtenerFeedCoches(
            userId, 
            fechaLimite ? new Date(fechaLimite) : null, 
            parseInt(limite) || 20
        );
        res.status(200).send(posts);
    } catch (error) {
        console.error('Error al obtener el feed de coches:', error);
        res.status(500).send({ error: 'Error al obtener el feed de coches' });
    }
});


module.exports = router;
