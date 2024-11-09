const express = require('express');
const router = express.Router();
const Token = require('../modelos/token');
const Cars = require('../modelos/cars');

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

module.exports = router;
