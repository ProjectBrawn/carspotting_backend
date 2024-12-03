const Car = require('./models/Car'); // Asegúrate de que la ruta al modelo sea correcta

async function postComentario(carId, usuarioId, texto, username, usuarioImagen) {
    console.log("Me meto a meter un comentario");
    try {
        // Validar que todos los parámetros requeridos estén presentes
        if (!carId || !usuarioId || !texto || !username) {
            throw new Error('Faltan parámetros obligatorios');
        }

        // Buscar el coche por su ID
        const coche = await Car.findById(carId);

        if (!coche) {
            throw new Error('Coche no encontrado');
        }

        // Crear el objeto de comentario
        const nuevoComentario = {
            usuario: usuarioId,
            texto: texto,
            username: username,
            usuario_imagen: usuarioImagen,
            fecha: new Date()
        };

        // Agregar el comentario al array de comentarios
        coche.comentarios.push(nuevoComentario);

        // Guardar los cambios en la base de datos
        const cocheActualizado = await coche.save();
        

        return cocheActualizado;
    } catch (error) {
        console.error('Error al postear comentario:', error);
        throw error;
    }
}

module.exports = postComentario;