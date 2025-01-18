const User = require('../modelos/users');
const Post = require('../modelos/posts');
const Medalla = require('../modelos/achievements');

async function obtenerTodosCoches(fechaLimite = null) {
    try {
        const query = {};

        // Si se proporciona una fecha límite, añadimos condición de fecha
        if (fechaLimite) {
            query.fecha_captura = { $lte: fechaLimite };
        }

        // Buscamos los coches de todos los usuarios
        const posts = await Post.find(query)
            .sort({ fecha_captura: -1 })

        return posts;
    } catch (error) {
        console.error('Error al obtener feed de posts:', error);
        throw error;
    }
}


// Método para obtener el feed de coches de siguiendo por username
async function obtenerFeedCoches(username, fechaLimite = null, limite = 20) {
    try {
        // Primero, encontramos el usuario por su objectId
        const usuario = await User.findById(username).select('siguiendo');
        // const usuario = await User.findOne({ $or: [{ username }, { email: username }] }).select('siguiendo');

        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        // Construimos el query base
        const query = {
            _id: { $in: usuario.siguiendo }
        };

        // Si se proporciona una fecha límite, añadimos condición de fecha
        if (fechaLimite) {
            query.fecha_captura = { $lte: fechaLimite };
        }


        // Buscamos los coches
        const posts = await Post.find(query)
            .sort({ fecha_captura: -1 }) // Ordenar de más reciente a más antiguo
            .limit(limite) // Limitar número de resultados
        // .populate('usuario_captura', 'nombre username fotoPerfil') // Poblar detalles del usuario
        // .populate('medallas') // Opcional: poblar medallas si las necesitas
        // .lean(); // Convierte a objeto plano para mejor rendimiento

        return posts;
    } catch (error) {
        console.error('Error al obtener feed de coches:', error);
        throw error;
    }
}


module.exports = {
    obtenerTodosCoches,
    obtenerFeedCoches
};

