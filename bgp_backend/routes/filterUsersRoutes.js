const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const User = require('../modelos/users'); // Importa el modelo de Usuario
const { autenticarToken } = require('../middleware/auth'); // Importa el middleware para autenticar el token

// Ruta para buscar un usuario por su username
router.get('/', autenticarToken, async (req, res) => {
    console.log("Buscando usuario por username...");
    try {
        // Recoger el username de la consulta (query)
        const { username } = req.query;

        // Validar la entrada del username
        if (!username) {
            return res.status(400).json({ 
                error: 'El parámetro "username" es requerido' 
            });
        }

        // Verificar que la longitud del username no sea excesiva
        if (username.length > 50) {  // Evita cadenas extremadamente largas
            return res.status(400).json({
                error: 'El parámetro "username" no debe superar los 50 caracteres'
            });
        }

        // Validar que no contenga caracteres no permitidos (sólo letras, números, guiones y guiones bajos)
        const usernameRegex = /^[a-zA-Z0-9_-]+$/;
        if (!usernameRegex.test(username)) {
            return res.status(400).json({
                error: 'El parámetro "username" contiene caracteres no válidos. Sólo se permiten letras, números, guiones y guiones bajos.'
            });
        }

        // Buscar el usuario en la base de datos por un username que contenga el término (insensible a mayúsculas/minúsculas)
        const usuarios = await User.find({
            username: { $regex: username, $options: 'i' }  // Búsqueda parcial y sin sensibilidad a mayúsculas
        });

        // Si no se encuentra ningún usuario, devolver un mensaje adecuado
        if (usuarios.length === 0) {
            return res.status(404).json({ 
                error: 'No se encontraron usuarios que coincidan con el término de búsqueda' 
            });
        }

        // Si se encuentran usuarios, devolver los resultados
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Error al buscar los usuarios:', error);
        // Si ocurre un error, devolver un mensaje de error con un estado 500
        res.status(500).json({ 
            error: 'Error al buscar los usuarios',
            details: error.message 
        });
    }
});

module.exports = router;
