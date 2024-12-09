const mongoose = require('mongoose');
const { CarDay, CarDayIndex } = require('./daily_car');  // Importa los modelos de coches e índice


async function getCarOfTheDay() {
    try {
        // Obtén el índice actual del coche del día
        const indexDoc = await CarDayIndex.findOne();
        if (!indexDoc) {
            console.log('Índice no encontrado');
            return;
        }

        const carIndex = indexDoc.carIndex;

        // Encuentra el coche correspondiente al índice
        const carOfTheDay = await CarDay.findOne().skip(carIndex);

        if (carOfTheDay) {
            console.log('Coche del día:', carOfTheDay);

            // Actualiza el índice global para el siguiente día
            const nextIndex = (carIndex + 1) % 10; // Asumiendo que tienes 10 coches
            indexDoc.carIndex = nextIndex;
            await indexDoc.save();
            console.log(`Índice actualizado a: ${nextIndex}`);
        } else {
            console.log('No se encontró un coche para hoy.');
        }
    } catch (error) {
        console.error('Error al obtener el coche del día:', error);
    }
}

module.exports = {
    getCarOfTheDay
};
