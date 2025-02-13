const Posts = require('../modelos/posts');
const axios = require('axios');

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

            query.fecha_captura = { 
                $gte: fechaInicio, // Fecha mínima: 24 horas antes
                $lte: fechaLimiteDate // Fecha máxima: fechaLimite
            };
            
        }

        // Buscamos los coches dentro del rango
        const coches = await Posts.find(query)
            .sort({ fecha_captura: -1 }); // Ordenar de más reciente a más antiguo
        return coches;
    } catch (error) {
        console.error('Error al obtener coches:', error);
        throw error;
    }
}

async function getCityAndCountry(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/search.php?q=${lat},${lon}&format=jsonv2`;

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'GTSpotters/1.0 (projectbrawn@gmail.com)' // Cambia el correo a uno válido
            }
        });

        const data = response.data;

        if (data.length > 0) {
            // Nominatim devuelve un array de resultados, tomamos el primero.
            const result = data[0];
            const displayName = result.display_name || '';

            // Extraemos la ciudad y el país del campo "display_name"
            const parts = displayName.split(',');
            const country = parts[parts.length - 1]?.trim() || null;
            const city = parts[parts.length - 4]?.trim() || null;

            return { city, country };
        } else {
            throw new Error('No se encontraron resultados para las coordenadas proporcionadas.');
        }
    } catch (error) {
        console.error('Error al obtener ciudad y país:', error.message);
        throw error;
    }
}




module.exports = {
    obtenerTodosCoches,
    getCityAndCountry
};

