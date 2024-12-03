const express = require('express');
const router = express.Router();
const Token = require('../modelos/token');
const Cars = require('../modelos/cars');
const {obtenerTodosCoches } = require('../middleware/cars');

const { autenticarToken, SECRET_KEY } = require('../middleware/auth');

router.get('/', autenticarToken, async (req, res) => {
    //Recupera todos los coches
    const cars = await Cars.find();
    res.send(cars);
});

router.post('/createCar', autenticarToken, async (req, res) => {
    const { marca, modelo, generacion, año, url_imagen, tipoCarroceria } = req.body;
  
    if (!marca || !modelo || !generacion || !año) {
      return res.status(400).send('Los campos marca, modelo, generacion y año son obligatorios');
    }
  
    try {
      const nuevoCoche = new Cars({
        marca,
        modelo,
        generacion,
        año,
        url_imagen,     // Campo opcional
        tipoCarroceria  // Campo opcional
      });
  
      // Guardar el coche en la base de datos
      await nuevoCoche.save();
  
      // Responder con el coche creado
      res.status(201).send({ mensaje: 'Coche creado correctamente', coche: nuevoCoche });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al crear el coche');
    }
  });

// Obtiene el feed de coches de amigos del usuario actual
router.get('/all_cars', autenticarToken, async (req, res) => {
  console.log('All cars route accessed');
  console.log('Query params:', req.query);
  console.log('Headers:', req.headers);

  try {
      const fechaLimite = req.query.fechaLimite ? new Date(req.query.fechaLimite) : null;
      const coches = await obtenerTodosCoches(fechaLimite);
      res.status(200).json(coches);
  } catch (error) {
      console.error('Detailed error al obtener todos los coches:', error);
      res.status(500).json({ 
          error: 'Error al obtener todos los coches',
          details: error.message 
      });
  }
});

module.exports = router;

