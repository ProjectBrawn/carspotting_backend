const express = require('express');
const router = express.Router();
const User = require('../modelos/users');
const { autenticarToken } = require('../middleware/auth');


// Mete un usuario en la lista de bloqueados
router.put('/', autenticarToken, async (req, res) => {
    try {
      // Obtén el nombre de usuario desde el cuerpo de la solicitud
      const { username, usernameBlocker } = req.body;
  
      if (!username) {
        return res.status(400).json({ mensaje: 'El nombre de usuario es obligatorio.' });
      }
  
      // Buscar al usuario autenticado en la base de datos
      const usuarioAutenticado = await User.findOne({username:usernameBlocker});
      if (!usuarioAutenticado) {
        return res.status(404).json({ mensaje: 'Usuario autenticado no encontrado.' });
      }
  
      // Buscar al usuario que se quiere bloquear por el nombre de usuario
      const usuarioABloquear = await User.findOne({ username: username });
      if (!usuarioABloquear) {
        return res.status(404).json({ mensaje: 'Usuario a bloquear no encontrado.' });
      }
  
      // Verificar que el usuario no se bloquee a sí mismo
      if (usuarioAutenticado.username === usuarioABloquear.username) {
        return res.status(400).json({ mensaje: 'No puedes bloquearte a ti mismo.' });
      }
  
      // Verificar si el usuario ya está bloqueado
      if (usuarioAutenticado.bloqueados.includes(usuarioABloquear.username)) {
        return res.status(400).json({ mensaje: 'Este usuario ya está bloqueado.' });
      }
  
      // Agregar el usuario a la lista de bloqueados
      usuarioAutenticado.bloqueados.push(username);
      await usuarioAutenticado.save();
  
      // Responder con éxito
      return res.status(200).json({ mensaje: 'Usuario bloqueado correctamente.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ mensaje: 'Error al bloquear al usuario.' });
    }
  });

module.exports = router;
