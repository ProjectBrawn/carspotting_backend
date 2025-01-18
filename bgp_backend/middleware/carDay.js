const mongoose = require('mongoose');
const { CarDay } = require('./daily_car'); // Modelo de coche diario

async function getCarOfTheDay() {
    try {
        // Obtén la fecha actual en formato YYYY-MM-DD
        const currentDate = new Date().toISOString().split('T')[0];

        // Obtén el número total de coches
        const totalCars = await CarDay.countDocuments();

        if (totalCars === 0) {
            return;
        }

        // Calcula el índice del coche basado en la fecha
        const carIndex = Math.abs(currentDate.split('-').join('')) % totalCars;

        // Encuentra el coche correspondiente al índice
        const carOfTheDay = await CarDay.findOne().skip(carIndex);

        if (carOfTheDay) {
            console.log('Coche del día:', carOfTheDay);
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
