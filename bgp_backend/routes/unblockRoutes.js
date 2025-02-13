const express = require('express');
const router = express.Router();
const User = require('../modelos/users');
const { autenticarToken } = require('../middleware/auth');


// Desbloquea un usuario en la lista de bloqueados
router.put('/', autenticarToken, async (req, res) => {
  try {
    const { username, usernameUnblocker } = req.body;

    if (!username) {
      return res.status(400).json({ mensaje: 'El nombre de usuario es obligatorio.' });
    }

    // Buscar al usuario autenticado en la base de datos
    const usuarioAutenticado = await User.findOne({ username: usernameUnblocker });
    if (!usuarioAutenticado) {
      return res.status(404).json({ mensaje: 'Usuario autenticado no encontrado.' });
    }

    // Buscar al usuario que se quiere desbloquear por el nombre de usuario
    const usuarioABloquear = await User.findOne({ username: username });
    if (!usuarioABloquear) {
      return res.status(404).json({ mensaje: 'Usuario a desbloquear no encontrado.' });
    }

    // Verificar que el usuario no intente desbloquearse a sí mismo
    if (usuarioAutenticado.username === usuarioABloquear.username) {
      return res.status(400).json({ mensaje: 'No puedes desbloquearte a ti mismo.' });
    }

    // Verificar si el usuario está bloqueado
    if (!usuarioAutenticado.bloqueados.includes(usuarioABloquear.username)) {
      return res.status(400).json({ mensaje: 'Este usuario no está bloqueado.' });
    }

    // Eliminar el usuario de la lista de bloqueados
    usuarioAutenticado.bloqueados = usuarioAutenticado.bloqueados.filter(user => user !== usuarioABloquear.username);
    await usuarioAutenticado.save();

    // Responder con éxito
    return res.status(200).json({ mensaje: 'Usuario desbloqueado correctamente.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error al desbloquear al usuario.' });
  }
});


module.exports = router;
