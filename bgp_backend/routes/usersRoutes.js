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
  const user = await Users.findById(req.params.username);
  res.send(user);
});

router.post('/createUser', async (req, res) => {
  const { nombre, apellido, email, password, fechaNacimiento, biografia, foto, username } = req.body;

  // Validaciones básicas
  if (!nombre || !apellido || !email || !password || !username) {
    return res.status(400).send('Todos los campos obligatorios deben completarse');
  }

  try {
    // Verificar si el email o el username ya existen en la base de datos
    const existingUser = await Users.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).send('El usuario o email ya están en uso');
    }

    // Encriptar la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = new Users({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      biografia,
      foto,
      username,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id, username: user.username }, "pruebas");

    res.status(201).send({ mensaje: 'Usuario creado correctamente', token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear el usuario');
  }
});

// Endpoint de Login (email o username)
router.post('/login', async (req, res) => {
  console.log("Me meto al login")
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