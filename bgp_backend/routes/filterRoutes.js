const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Token = require('../modelos/token');
const Posts = require('../modelos/posts');
const {obtenerTodosCoches } = require('../middleware/posts');

const { autenticarToken, SECRET_KEY } = require('../middleware/auth');

router.get('/', autenticarToken, async (req, res) => {
    console.log("tamos dentrooooooo");
    try {
      // Recoger los parámetros de la consulta (query) de la solicitud
      const { marca, modelo, generacion, anyo, ubicacion } = req.query;
  
      // Crear un objeto de filtro vacío
      const filtro = {};
  
      // Si se proporciona una marca, agregarla al filtro
      if (marca) filtro.marca = { $regex: marca, $options: 'i' };  // Filtrado insensible a mayúsculas/minúsculas
  
      // Si se proporciona un modelo, agregarlo al filtro
      if (modelo) filtro.modelo = { $regex: modelo, $options: 'i' };
  
      // Si se proporciona una generación, agregarla al filtro
      if (generacion) filtro.generacion = { $regex: generacion, $options: 'i' };
  
      // Si se proporciona un año, agregarlo al filtro
      if (anyo) filtro.anyo = parseInt(anyo);  // Asegurarse de que el año es un número
  
      // Si se proporciona una ubicación (dirección), agregarla al filtro
      if (ubicacion) filtro['ubicacion.direccion'] = { $regex: ubicacion, $options: 'i' };  // Filtrado insensible a mayúsculas/minúsculas
  
      // Realizar la consulta en la base de datos utilizando el filtro
      const coches = await Posts.find(filtro);
  
      // Si se encuentran coches, devolverlos con un estado 200
      res.status(200).json(coches);
    } catch (error) {
      console.error('Error al filtrar los coches:', error);
      // Si ocurre un error, devolver un mensaje de error con un estado 500
      res.status(500).json({ 
        error: 'Error al filtrar los coches',
        details: error.message 
      });
    }
  });
  

module.exports = router;

