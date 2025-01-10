const Posts = require('../modelos/posts');

async function obtenerTodosCoches(fechaLimite = null) {
    try {
        // Construimos el query base
        const query = {};

        if (fechaLimite) {
            // Convertimos fechaLimite a un objeto Date
            const fechaLimiteDate = new Date(fechaLimite);

            // Validamos que sea una fecha válida
            if (isNaN(fechaLimiteDate)) {
                throw new Error('El formato de fecha es inválido');
            }

            // Calculamos el rango de 24 horas antes

            // Agregamos la condición al query para el rango de fechas
            //quitar el menos 7  para una semana
            const fechaInicio = new Date(fechaLimiteDate.getTime() - 7*24 * 60 * 60 * 1000);
            console.log('Fecha de inicio:', fechaInicio);
            console.log('Fecha límite:', fechaLimiteDate);

            query.fecha_captura = { 
                $gte: fechaInicio, // Fecha mínima: 24 horas antes
                $lte: fechaLimiteDate // Fecha máxima: fechaLimite
            };
            
        }

        // Buscamos los coches dentro del rango
        const coches = await Posts.find(query)
            .sort({ fecha_captura: -1 }); // Ordenar de más reciente a más antiguo
        console.log('coches:', coches);
        return coches;
    } catch (error) {
        console.error('Error al obtener coches:', error);
        throw error;
    }
}

module.exports = {
    obtenerTodosCoches
};

