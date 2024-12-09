const express = require('express');
const router = express.Router();
const { CarDay, CarDayIndex } = require('./carModel');
const { autenticarToken } = require('../middleware/auth'); // Importa el middleware para autenticar el token

// Ruta para obtener el coche del día
router.get('/carDay', autenticarToken, async (req, res) => { // Se añade el middleware de autenticarToken
  print("ha entrado")
  try {
    // Busca el índice de los coches en la colección CarDayIndex
    const indexDoc = await CarDayIndex.findOne();
    if (!indexDoc) {
      return res.status(404).json({ message: 'Índice no encontrado' });
    }

    const carIndex = indexDoc.carIndex;

    // Obtiene el coche del día según el índice actual
    const carOfTheDay = await CarDay.findOne().skip(carIndex);

    if (carOfTheDay) {
      // Actualiza el índice para el siguiente coche (rotación circular)
      const nextIndex = (carIndex + 1) % 10; // Ajusta el índice para volver al inicio después del 9
      indexDoc.carIndex = nextIndex;
      await indexDoc.save(); // Guarda el nuevo índice

      // Responde con la información del coche del día
      res.json({
        name: carOfTheDay.name,
        image: carOfTheDay.image,
        assignedDate: new Date().toISOString().split('T')[0], // Fecha de asignación en formato YYYY-MM-DD
        nextIndex: nextIndex // Proporciona el siguiente índice para rotación
      });
    } else {
      res.status(404).json({ message: 'Coche no encontrado' });
    }
  } catch (error) {
    console.error(error); // Agrega un log para la depuración
    res.status(500).json({ message: 'Error al obtener el coche del día', error });
  }
});

module.exports = router;
