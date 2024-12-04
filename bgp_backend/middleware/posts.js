const Posts = require('../modelos/posts');

async function obtenerTodosCoches(fechaLimite = null) {
    try {
        // Primero, encontramos el usuario por su username
        // const usuario = await User.findOne({ username }).select('amigos');

        // if (!usuario) {
        //     throw new Error('Usuario no encontrado');
        // }

        // Construimos el query base
        const query = {};

        // Si se proporciona una fecha límite, añadimos condición de fecha
        if (fechaLimite) {
            query.fecha_captura = { $lte: fechaLimite };
        }

        // Buscamos los coches de todos los usuarios
        const coches = await Posts.find(query)
            .sort({ fecha_captura: -1 }) // Ordenar de más reciente a más antiguo
            // .populate('usuario_captura', 'nombre username fotoPerfil') // Poblar detalles del usuario
            // .lean(); // Convierte a objeto plano para mejor rendimiento

        return coches;
    } catch (error) {
        console.error('Error al obtener feed de posts:', error);
        throw error;
    }
}

module.exports = {
    obtenerTodosCoches
};

