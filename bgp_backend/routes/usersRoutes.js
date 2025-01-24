const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Users = require('../modelos/users');
const Token = require('../modelos/token');
const Posts = require('../modelos/posts');
const Report = require('../modelos/report');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { autenticarToken, SECRET_KEY } = require('../middleware/auth');
const validator = require('validator');
const xss = require('xss');

router.get('/', autenticarToken, async (req, res) => {
  const users = await Users.find();
  res.send(users);
});

router.get('/:username', autenticarToken, async (req, res) => {
  const user = await Users.findOne({ $or: [{ username: req.params.username }, { email: req.params.username }] });
  console.log(user);
  if (!user) {
    return res.status(404).send('Usuario no encontrado');
  } else {
    return res.status(200).send(user);
  }
});


// Actualizar info de un usuario
router.put('/:username', autenticarToken, async (req, res) => {
  const { username: newUsername, descripcion, imageUrl } = req.body;

  console.log("Voy a actualizar a un usuario");
  console.log(req.params.username);

  try {
    // Buscar el usuario por el parámetro de ruta
    const user = await Users.findOne({ $or: [{ username: req.params.username }, { email: req.params.username }] });

    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }

    // Validar y sanitizar bio (descripcion)
    if (descripcion && typeof descripcion !== 'string') {
      return res.status(400).send('La bio debe ser un texto válido.');
    }
    // Sanitizar la descripcion para evitar XSS
    const sanitizedDescripcion = descripcion ? xss(descripcion) : null;

    // Validar la longitud de la descripcion (máximo 500 caracteres, por ejemplo)
    if (sanitizedDescripcion && sanitizedDescripcion.length > 500) {
      return res.status(400).send('La bio no debe exceder los 500 caracteres.');
    }

    // Validar y sanitizar username
    if (newUsername && typeof newUsername !== 'string') {
      return res.status(400).send('El nombre de usuario debe ser un texto válido.');
    }
    // Sanitizar el nuevo username (solo letras, números y guiones bajos)
    const sanitizedUsername = newUsername ? newUsername.replace(/[^\w-]/g, '') : null;

    // Validar URL de imagen
    if (imageUrl && typeof imageUrl !== 'string') {
      return res.status(400).send('La URL de la imagen debe ser un texto válido.');
    }
    // Validar si la URL de la imagen es una URL válida
    const isValidImageUrl = imageUrl ? validator.isURL(imageUrl) : true;

    if (!isValidImageUrl) {
      return res.status(400).send('La URL de la imagen no es válida.');
    }

    // Verificar si el nuevo username ya está en uso
    if (sanitizedUsername && sanitizedUsername !== user.username) {
      const existingUser = await Users.findOne({ $or: [{ username: sanitizedUsername }, { email: sanitizedUsername }] });
      if (existingUser) {
        return res.status(400).send('El nombre de usuario ya está en uso.');
      }
    }

    const oldUsername = user.username;

    // Actualizar los campos
    if (sanitizedUsername) user.username = sanitizedUsername;
    if (imageUrl) user.fotoPerfil = imageUrl;
    user.descripcion = sanitizedDescripcion;

    await user.save();

    // Actualizar seguidores y seguidos
    if (sanitizedUsername) {
      await Users.updateMany(
        { siguiendo: oldUsername },
        { $set: { "siguiendo.$[elem]": sanitizedUsername } },
        { arrayFilters: [{ "elem": oldUsername }] }
      );
      await Users.updateMany(
        { seguidores: oldUsername },
        { $set: { "seguidores.$[elem]": sanitizedUsername } },
        { arrayFilters: [{ "elem": oldUsername }] }
      );

      // Actualizar username en los posts creados por el usuario
      await Posts.updateMany(
        { username: oldUsername },
        { $set: { username: sanitizedUsername } }
      );

      // Actualizar username en los comentarios realizados por el usuario
      await Posts.updateMany(
        { "comentarios.usuario": oldUsername },
        { $set: { "comentarios.$[elem].usuario": sanitizedUsername } },
        { arrayFilters: [{ "elem.usuario": oldUsername }] }
      );

      // Actualizar username en la tabla de reportes
      await Report.updateMany(
        { username: oldUsername },
        { $set: { username: sanitizedUsername } }
      );
    }

    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

// Crear un nuevo usuario
router.post('/createUser', async (req, res) => {
  const { username, email, sexo, anyo_nacimiento, pais, password, origin } = req.body;

  // Validaciones básicas
  if (!email || !password || !username || !sexo || !anyo_nacimiento || !pais || !origin) {
    return res.status(400).send({ status: 'failed', message: "Todos campos deben ser completados" });
  }

  // Validar formato del email
  if (!validator.isEmail(email)) {
    return res.status(400).send({ status: 'failed', message: "El email no es válido" });
  }

  // Validar longitud del username (máximo 30 caracteres)
  if (username.length > 30) {
    return res.status(400).send({ status: 'failed', message: "El nombre de usuario no puede exceder los 30 caracteres" });
  }

  // Validar longitud de la contraseña (mínimo 8 caracteres)
  if (password.length < 8) {
    return res.status(400).send({ status: 'failed', message: "La contraseña debe tener al menos 8 caracteres" });
  }

  try {
    // Verificar si el email o el username ya existen en la base de datos
    const existingUser = await Users.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).send({ status: 'failed', message: "El email o el username ya están en uso" });
    }

    // Encriptar la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = new Users({
      username: xss(username),  // Sanitizar el username
      email: xss(email),  // Sanitizar el email
      sexo: xss(sexo),  // Sanitizar el sexo
      anyo_nacimiento,
      pais: xss(pais),  // Sanitizar el pais
      origin: xss(origin),  // Sanitizar el origen
      password: hashedPassword,
      siguiendo: [username]
    });

    await user.save();
    res.status(200).send({ status: 'success', message: "Usuario creado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'failed', message: "Error al crear usuario" });
  }
});

// Crear un nuevo usuario con Google
router.post('/createUserGoogle', async (req, res) => {
  const { username, email, sexo, anyo_nacimiento, pais, password, origin, fotoPerfil } = req.body;

  // Validaciones básicas
  if (!email || !password || !username || !sexo || !anyo_nacimiento || !pais || !origin) {
    return res.status(400).send({ status: 'failed', message: "Todos campos deben ser completados" });
  }

  // Validar formato del email
  if (!validator.isEmail(email)) {
    return res.status(400).send({ status: 'failed', message: "El email no es válido" });
  }

  // Validar longitud del username (máximo 30 caracteres)
  if (username.length > 30) {
    return res.status(400).send({ status: 'failed', message: "El nombre de usuario no puede exceder los 30 caracteres" });
  }

  // Validar longitud de la contraseña (mínimo 8 caracteres)
  if (password.length < 8) {
    return res.status(400).send({ status: 'failed', message: "La contraseña debe tener al menos 8 caracteres" });
  }

  try {
    // Verificar si el email o el username ya existen en la base de datos
    const existingUser = await Users.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).send({ status: 'failed', message: "El email o el username ya están en uso" });
    }

    // Encriptar la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = new Users({
      username: xss(username),  // Sanitizar el username
      email: xss(email),  // Sanitizar el email
      sexo: xss(sexo),  // Sanitizar el sexo
      anyo_nacimiento,
      pais: xss(pais),  // Sanitizar el pais
      origin: xss(origin),  // Sanitizar el origen
      password: hashedPassword,
      siguiendo: [username],
      fotoPerfil: fotoPerfil ? validator.isURL(fotoPerfil) ? fotoPerfil : null : null  // Validar URL de la foto de perfil
    });

    await user.save();
    res.status(200).send({ status: 'success', message: "Usuario creado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'failed', message: "Error al crear usuario" });
  }
});

// Login del usuario
router.post('/login', async (req, res) => {
  console.log("Voy a iniciar sesion");
  const { emailOrUsername, password } = req.body;

  // Verifica si ambos campos están presentes
  if (!emailOrUsername || !password) {
    return res.status(400).send('Por favor, proporciona email o username y contraseña');
  }

  try {
    // Busca al usuario por su email o username
    const user = await Users.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
    if (!user) {
      return res.status(400).send({ status: 'failed', token: "" });
    }

    // Compara la contraseña proporcionada con la almacenada en la base de datos
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send({ status: 'failed', token: "" });
    }

    // Genera un token JWT si las credenciales son correctas
    const token = jwt.sign({ userId: user._id, username: user.username }, "pruebas");

    // Guarda el token en el esquema de Token
    const tokenDocument = new Token({
      token,
      userId: user._id,
    });

    await tokenDocument.save();
    user.sesion_activa = true;
    await user.save();
    res.status(200).send({ status: 'success', token });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: 'failed', token: "" });
  }
});

// Login con Google
router.post('/loginGoogle', async (req, res) => {
  console.log("Voy a iniciar sesion con google");
  const { emailOrUsername } = req.body;

  // Verifica si ambos campos están presentes
  if (!emailOrUsername) {
    return res.status(400).send('Por favor, proporciona email o username');
  }

  try {
    // Busca al usuario por su email o username
    const user = await Users.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
    if (!user) {
      return res.status(400).send({ status: 'failed', token: "" });
    }

    // Genera un token JWT si las credenciales son correctas
    const token = jwt.sign({ userId: user._id, username: user.username }, "pruebas");

    // Guarda el token en el esquema de Token
    const tokenDocument = new Token({
      token,
      userId: user._id,
    });

    await tokenDocument.save();
    user.sesion_activa = true;
    await user.save();
    res.status(200).send({ status: 'success', token, username: user.username });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: 'failed', token: "" });
  }
});


router.post('/cerrarSesion', async (req, res) => {
  const { emailOrUsername } = req.body;

  // Verifica si ambos campos están presentes
  if (!emailOrUsername) {
    return res.status(400).send('Por favor, proporciona email o username y contraseña');
  }

  try {
    // Busca al usuario por su email o username
    const user = await Users.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
    //POner el campo sesion activa a true
    if (!user) {
      return res.status(400).send({ status: 'failed', token: "" });
    }
    user.sesion_activa = false;
    await user.save();
    res.status(200).send({ status: 'success'});
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: 'failed'});
  }
});

// Elimina un usuario específico por username 
router.delete('/deleteUser/:username', autenticarToken, async (req, res) => {
  await Users.findByIdAndDelete(req.params.username);
  res.send('Usuario eliminado');
});

// Agregar un amigo
router.post('/follow', autenticarToken, async (req, res) => {
  const { usernameOrigin, usernameDestiny } = req.body; // Ambos usernames en el body
  if (!usernameOrigin || !usernameDestiny) {
    return res.status(400).send('Se deben proporcionar ambos nombres de usuario');
  }

  try {
    // Obtener al usuario que hace la solicitud
    const usuario = await Users.findOne({ $or: [{ username: usernameOrigin }, { email: usernameOrigin }] });
    
    
    if (!usuario) {
      return res.status(404).send('Usuario no encontrado');
    }

    // Obtener al usuario que se quiere agregar como amigo
    const amigo = await Users.findOne({ $or: [{ username: usernameDestiny }, { email: usernameDestiny }] });
    if (!amigo) {
      return res.status(404).send('Amigo no encontrado');
    }

    // Verificar si ya son amigos
    if (usuario.siguiendo.includes(usernameDestiny)) {
      return res.status(400).send('Ya eres amigo de este usuario');
    }

    // Agregar el amigo a la lista de amigos de ambos usuarios
    usuario.siguiendo.push(usernameDestiny);
    //Agregar el usuario a la lista de seguidores del amigo
    amigo.seguidores.push(usernameOrigin);

    // Guardar los cambios en ambos usuarios
    await usuario.save();
    await amigo.save();

    res.status(200).send('Amigos agregados correctamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar amigo');
  }
});


// Eliminar un amigo
router.delete('/unfollow', autenticarToken, async (req, res) => {
  const { usernameOrigin, usernameDestiny } = req.body;

  if (!usernameOrigin || !usernameDestiny) {
    return res.status(400).send('Se deben proporcionar los nombres de usuario de origen y destino');
  }

  try {
    // Obtener al usuario que hace la solicitud
    const usuario = await Users.findOne({ $or: [{ username: usernameOrigin }, { email: usernameOrigin }] });
    if (!usuario) {
      return res.status(404).send('Usuario origen no encontrado');
    }

    // Obtener al usuario que se quiere dejar de seguir
    const amigo = await Users.findOne({ $or: [{ username: usernameOrigin }, { email: usernameOrigin }] });
    if (!amigo) {
      return res.status(404).send('Usuario destino no encontrado');
    }

    // Verificar si el usuario origen está siguiendo al destino
    if (!usuario.siguiendo.includes(usernameDestiny)) {
      return res.status(400).send('No estás siguiendo a este usuario');
    }

    // Eliminar al destino de la lista de "siguiendo" del usuario origen
    usuario.siguiendo = usuario.siguiendo.filter(amigo => amigo !== usernameDestiny);

    // Eliminar al origen de la lista de "seguidores" del usuario destino
    amigo.seguidores = amigo.seguidores.filter(seguidor => seguidor !== usernameOrigin);

    // Guardar los cambios en ambos usuarios
    await usuario.save();
    await amigo.save();

    res.status(200).send('Usuario dejado de seguir correctamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al procesar la solicitud');
  }
});


// Comprobar si dos usuarios son amigos
router.post('/comprobarAmistad', autenticarToken, async (req, res) => {
  const { username, amigoUsername } = req.body; // Ambos nombres de usuario desde el body

  if (!username || !amigoUsername) {
    return res.status(400).send('Se deben proporcionar ambos nombres de usuario');
  }

  try {
    // Obtener al usuario que hace la solicitud
    const usuario = await Users.findOne({ $or: [{ username }, { email: username }] });
    if (!usuario) {
      return res.status(404).send('Usuario no encontrado');
    }

    // Obtener al amigo que se quiere comprobar
    const amigo = await Users.findOne({ $or: [{ username:amigoUsername }, { email: amigoUsername }] });
    if (!amigo) {
      return res.status(404).send('Amigo no encontrado');
    }

    // Comprobar si son amigos
    if (usuario.siguiendo.includes(amigoUsername)) {
      return res.status(200).send({ 'result': "true" });
    } else {
      return res.status(200).send({ 'result': "false" })
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al comprobar la amistad');
  }
});

router.post('/follow', async (req, res) => {
  const { usernameOrigin, usernameDestiny } = req.body;

  try {
    // Verificar que ambos usuarios existan
    const userOrigin = await Users.findOne({ $or: [{ username: usernameOrigin }, { email: usernameOrigin }] });
    const userDestiny =  await Users.findOne({ $or: [{ username: usernameDestiny }, { email: usernameDestiny }] });

    if (!userOrigin || !userDestiny) {
      return res.status(404).json({
        status: 'error',
        message: 'Uno o ambos usuarios no existen',
      });
    }

    // Evitar seguir al mismo usuario más de una vez
    if (userDestiny.seguidores.includes(userOrigin._id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Ya sigues a este usuario',
      });
    }

    // Agregar el ID del usuario que sigue al arreglo de "seguidores"
    userDestiny.seguidores.push(usernameOrigin);
    await userDestiny.save();

    return res.status(200).json({
      status: 'success',
      message: 'Has comenzado a seguir a este usuario',
    });
  } catch (error) {
    console.error('Error al seguir al usuario:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Ocurrió un error al intentar seguir al usuario',
    });
  }
});

// Endpoint para ver si un usuario existe
router.post('/comprobarUsuario', async (req, res) => {
  const { emailOrUsername } = req.body;

  try {
    // Supongamos que tienes un modelo llamado "Usuario"
    const usuario = await Users.findOne({
      $or: [{ username: emailOrUsername }, { email: emailOrUsername }]
    });

    if (usuario) {
      return res.status(200).json({ existe: true, mensaje: 'El usuario existe.' });
    } else {
      return res.status(404).json({ existe: false, mensaje: 'El usuario no existe.' });
    }
  } catch (error) {
    console.error('Error al comprobar usuario:', error);
    return res.status(500).json({ mensaje: 'Error en el servidor.', error: error.message });
  }
});

router.delete('/deleteUser', autenticarToken, async (req, res) => {
  console.log("Voy a eliminar el usuario");
  try {
    // Obtener el userId del token
    const userId = req.user.userId;
    console.log("El userId es: " + userId);

    // Validar que el ID es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'ID de usuario no válido' });
    }

    // Buscar al usuario por ID
    const usuario = await Users.findById(userId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const username = usuario.username;

    // Actualizar seguidores y seguidos de otros usuarios
    await Users.updateMany(
      { siguiendo: username },
      { $pull: { siguiendo: username } }
    );
    await Users.updateMany(
      { seguidores: username },
      { $pull: { seguidores: username } }
    );

    // Eliminar los posts creados por el usuario
    await Posts.deleteMany({ username });

    // Eliminar los comentarios realizados por el usuario en los posts de otros usuarios
    await Posts.updateMany(
      { "comentarios.usuario": username },
      { $pull: { comentarios: { usuario: username } } }
    );

    // Eliminar tokens asociados al usuario
    await Token.deleteMany({ userId });

    // Eliminar al usuario
    await Users.findByIdAndDelete(userId);

    return res.status(200).json({ message: 'Usuario y referencias eliminados correctamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      detalles: error.message
    });
  }
});


module.exports = router;

