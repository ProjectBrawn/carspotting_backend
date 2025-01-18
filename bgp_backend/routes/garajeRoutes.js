const express = require('express');
const router = express.Router();
const Users = require('../modelos/users');
const { autenticarToken, SECRET_KEY } = require('../middleware/auth');

// Agregar un coche al garaje principal (usando PUT)
router.put('/', autenticarToken, async (req, res) => {
    const { username, postId } = req.body; // username y postId en el body
    if (!username || !postId) {
      return res.status(400).json({
        code: 400,
        status: 'error',
        message: 'Se deben proporcionar username y postId'
      });
    }
  
    try {
      // Obtener al usuario que tiene el garaje usando el username o el email
      const usuario = await Users.findById(username);
      if (!usuario) {
        return res.status(404).json({
          code: 404,
          status: 'error',
          message: 'Usuario no encontrado'
        });
      }
  
      // Verificar si el garaje tiene espacio
      if (usuario.garaje_principal.length >= 5) {
        return res.status(400).json({
          code: 400,
          status: 'error',
          message: 'El garaje principal ya está lleno'
        });
      }
  
      // Verificar si el coche ya está en el garaje principal
      if (usuario.garaje_principal.includes(postId)) {
        return res.status(400).json({
          code: 400,
          status: 'error',
          message: 'El coche ya está en el garaje principal'
        });
      }
  
      // Agregar el coche al garaje principal
      usuario.garaje_principal.push(postId);
  
      // Guardar los cambios en el usuario
      await usuario.save();
  
      return res.status(200).json({
        code: 200,
        status: 'success',
        message: 'Coche agregado correctamente al garaje principal'
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        code: 500,
        status: 'error',
        message: 'Error al agregar el coche al garaje principal'
      });
    }
  });

  
  // Eliminar un coche del garaje principal (usando DELETE)
router.delete('/', autenticarToken, async (req, res) => {
    const { username, postId } = req.body; // username y postId en el body
    if (!username || !postId) {
      return res.status(400).json({
        code: 400,
        status: 'error',
        message: 'Se deben proporcionar username y postId'
      });
    }
  
    try {
      // Obtener al usuario que tiene el garaje usando el username
      const usuario = await Users.findById(username);
      if (!usuario) {
        return res.status(404).json({
          code: 404,
          status: 'error',
          message: 'Usuario no encontrado'
        });
      }
  
      // Verificar si el coche está en el garaje principal
      if (!usuario.garaje_principal.includes(postId)) {
        return res.status(400).json({
          code: 400,
          status: 'error',
          message: 'El coche no está en el garaje principal'
        });
      }
  
      // Eliminar el coche del garaje principal
      usuario.garaje_principal = usuario.garaje_principal.filter(coche => coche.toString() !== postId);
  
      // Guardar los cambios en el usuario
      await usuario.save();
  
      return res.status(200).json({
        code: 200,
        status: 'success',
        message: 'Coche eliminado correctamente del garaje principal'
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        code: 500,
        status: 'error',
        message: 'Error al eliminar el coche del garaje principal'
      });
    }
  });
  
  
module.exports = router;