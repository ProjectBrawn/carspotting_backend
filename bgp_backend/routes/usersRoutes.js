const express = require('express');
const router = express.Router();
const Users = require('../modelos/users');
const Token = require('../modelos/token');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { autenticarToken, SECRET_KEY } = require('../middleware/auth');

router.get('/',autenticarToken, async (req, res) => {
  const users = await Users.find();
  res.send(users);
});

// Obtén un usuario específico por username 
router.get('/:username', autenticarToken, async (req, res) => {
  const user = await Users.findOne({ username: req.params.username });
  if (!user) {
    return res.status(404).send('Usuario no encontrado');
  }else{
    return res.status(200).send(user);
  }
});

//Actualizar info de un usuario
router.put('/:username', autenticarToken, async (req, res) => {
  const { username: newUsername, descripcion } = req.body;

  try {
    // Buscar el usuario por el parámetro de ruta
    const user = await Users.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }

    // Validar bio y username
    if (descripcion && typeof descripcion !== 'string') {
      return res.status(400).send('La bio debe ser un texto válido.');
    }

    if (newUsername && typeof newUsername !== 'string') {
      return res.status(400).send('El nombre de usuario debe ser un texto válido.');
    }

    // Verificar si el nuevo username ya está en uso
    if (newUsername && newUsername !== user.username) {
      const existingUser = await Users.findOne({ username: newUsername });
      if (existingUser) {
        return res.status(400).send('El nombre de usuario ya está en uso.');
      }
    }

    // Actualizar los campos
    if (descripcion) user.descripcion = descripcion;
    if (newUsername) user.username = newUsername;

    // Guardar los cambios
    await user.save();

    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

router.post('/createUser', async (req, res) => {
  const { nombre, apellidos, username, email, password } = req.body;

  // Validaciones básicas
  if (!nombre || !apellidos || !email || !password || !username) {
    return res.status(400).send({ status: 'failed', message:"Todos campos deben ser completados" });
  }

  try {
    // Verificar si el email o el username ya existen en la base de datos
    const existingUser = await Users.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).send({ status: 'failed', message:"El email o el username ya están en uso" });
    }

    // Encriptar la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = new Users({
      nombre,
      apellidos,
      username,
      email,
      password: hashedPassword,
    });
    

    await user.save();

    res.status(200).send({ status: 'success', message:"Usuario creado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'failed', message:"Error al crear usuario" });
  }
});

// Endpoint de Login (email o username)
router.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;

  // Verifica si ambos campos están presentes
  if (!emailOrUsername || !password) {
    return res.status(400).send('Por favor, proporciona email o username y contraseña');
  }

  try {
    // Busca al usuario por su email o username
    const user = await Users.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
    if (!user) {
      return res.status(400).send({ status: 'failed', token:"" });
    }

    // Compara la contraseña proporcionada con la almacenada en la base de datos
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send({ status: 'failed', token:"" });
    }

    // Genera un token JWT si las credenciales son correctas
    const token = jwt.sign({ userId: user._id, username: user.username },"pruebas");

    // Guarda el token en el esquema de Token
    const tokenDocument = new Token({
      token,
      userId: user._id,
    });

    await tokenDocument.save();

    res.status(200).send({ status: 'success', token });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: 'failed', token:"" });
  }
});

// Elimina un usuario específico por username 
router.delete('/:username', autenticarToken, async (req, res) => {
  await Users.findByIdAndDelete(req.params.username);
  res.send('Usuario eliminado');
});
module.exports = router;