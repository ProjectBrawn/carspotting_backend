const express = require('express');
const router = express.Router();
const { CarDay } = require('../modelos/daily_car');
const { autenticarToken } = require('../middleware/auth');

// Ruta para obtener el coche del día
router.get('/', autenticarToken, async (req, res) => {
  console.log("dentro del back")
    try {
        // Obtén la fecha actual en formato YYYY-MM-DD
        const currentDate = new Date().toISOString().split('T')[0];

        // Obtén el número total de coches
        const totalCars = await CarDay.countDocuments();

        if (totalCars === 0) {
            return res.status(404).json({ message: 'No hay coches disponibles.' });
        }

        // Calcula el índice del coche basado en la fecha
        const carIndex = Math.abs(currentDate.split('-').join('')) % totalCars;

        // Encuentra el coche correspondiente al índice
        const carOfTheDay = await CarDay.findOne().skip(carIndex);
        console.log("dentro del back2")
        if (carOfTheDay) {
            // Responde con la información del coche del día
            console.log("dentro del back3")
            res.json({
                name: carOfTheDay.name,
                image: carOfTheDay.image,
                assignedDate: currentDate // Fecha de asignación
            });
        } else {
            res.status(404).json({ message: 'Coche no encontrado.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el coche del día', error });
    }
});

module.exports = router;
