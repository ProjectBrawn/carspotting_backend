const User = require('../modelos/users');
const Post = require('../modelos/posts');
const Medalla = require('../modelos/achievements');

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
        const posts = await Post.find(query)
            .sort({ fecha_captura: -1 }) // Ordenar de más reciente a más antiguo
            // .populate('usuario_captura', 'nombre username fotoPerfil') // Poblar detalles del usuario
            // .lean(); // Convierte a objeto plano para mejor rendimiento

        return posts;
    } catch (error) {
        console.error('Error al obtener feed de posts:', error);
        throw error;
    }
}


// Método para obtener el feed de coches de amigos por username
async function obtenerFeedCoches(username, fechaLimite = null, limite = 20) {
    try {
        // Primero, encontramos el usuario por su username
        const usuario = await User.findOne({ username }).select('amigos');
        
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        // Construimos el query base
        const query = {
            username: { $in: usuario.amigos }
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


// Ejemplos de uso:
// 1. Obtener los últimos 20 coches de amigos
async function ejemploUso1() {
    const feedCoches = await obtenerFeedCoches('ID_DEL_USUARIO');
    console.log(feedCoches);
}

// 2. Obtener coches de amigos hasta una fecha específica
async function ejemploUso2() {
    const fechaLimite = new Date('2024-01-01');
    const feedCoches = await obtenerFeedCoches('ID_DEL_USUARIO', fechaLimite, 50);
    console.log(feedCoches);
}

// 3. Método para paginación (por si quieres cargar más coches)
async function obtenerFeedCochesPaginado(usuarioId, ultimaFecha = null, limite = 20) {
    try {
        const usuario = await User.findById(usuarioId).select('amigos');
        
        const query = {
            username: { $in: usuario.amigos }
        };

        // Si se proporciona la última fecha, busca coches anteriores a esa fecha
        if (ultimaFecha) {
            query.fecha_captura = { $lt: ultimaFecha };
        }

        const posts = await Post.find(query)
            .sort({ fecha_captura: -1 })
            .limit(limite)
            // .populate('usuario_captura', 'nombre username fotoPerfil')
            // .lean();

        return posts;
    } catch (error) {
        console.error('Error en paginación de feed:', error);
        throw error;
    }
}

// Ejemplo de uso de paginación
async function ejemploPaginacion() {
    let feedInicial = await obtenerFeedCochesPaginado('ID_DEL_USUARIO');
    console.log('Feed inicial:', feedInicial);

    // Si quieres cargar más, usas la fecha del último coche
    if (feedInicial.length > 0) {
        const ultimaFecha = feedInicial[feedInicial.length - 1].fecha_captura;
        let feedSiguiente = await obtenerFeedCochesPaginado('ID_DEL_USUARIO', ultimaFecha);
        console.log('Siguiente página:', feedSiguiente);
    }
}

module.exports = {
    obtenerTodosCoches,
    obtenerFeedCoches,
    obtenerFeedCochesPaginado
};

