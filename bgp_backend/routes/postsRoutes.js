const express = require('express');
const router = express.Router();
const Token = require('../modelos/token');
const Posts = require('../modelos/posts');
const {obtenerTodosCoches } = require('../middleware/posts');

const { autenticarToken, SECRET_KEY } = require('../middleware/auth');

router.get('/', autenticarToken, async (req, res) => {
    //Recupera todos los coches
    const posts = await Posts.find();
    res.send(posts);
});

// router.post('/createCar', autenticarToken, async (req, res) => {
//     const { marca, modelo, generacion, año, url_imagen, tipoCarroceria } = req.body;
  
//     if (!marca || !modelo || !generacion || !año) {
//       return res.status(400).send('Los campos marca, modelo, generacion y año son obligatorios');
//     }
  
//     try {
//       const nuevoCoche = new Posts({
//         marca,
//         modelo,
//         generacion,
//         año,
//         url_imagen,     // Campo opcional
//         tipoCarroceria  // Campo opcional
//       });
  
//       // Guardar el coche en la base de datos
//       await nuevoCoche.save();
  
//       // Responder con el coche creado
//       res.status(201).send({ mensaje: 'Coche creado correctamente', coche: nuevoCoche });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Error al crear el coche');
//     }
//   });

// Obtiene el feed de coches de amigos del usuario actual
router.get('/all_cars', autenticarToken, async (req, res) => {
  try {
      const fechaLimite = req.query.fechaLimite ? new Date(req.query.fechaLimite) : null;
      const posts = await obtenerTodosCoches(fechaLimite);
      res.status(200).json(posts);
  } catch (error) {
      console.error('Detailed error al obtener todos los coches:', error);
      res.status(500).json({ 
          error: 'Error al obtener todos los posts',
          details: error.message 
      });
  }
});


router.post('/addComment', autenticarToken, async (req, res) => {
  try {
      const { id, texto, username } = req.body; // ID del objeto y texto del comentario
      console.log(id);
      console.log(texto);
      console.log(username);

      // Verificar que se pasaron los datos necesarios
      if (!id || !texto || !username) {
          return res.status(400).json({ error: 'Se requiere el ID del objeto, el texto del comentario y el usuario' });
      }

      // Buscar el objeto en la base de datos
      const post = await Posts.findById(id);
      if (!post) {
          return res.status(404).json({ error: 'Post no encontrado' });
      }

      // Agregar el nuevo comentario
      const nuevoComentario = {
          usuario: username,
          texto:texto
      };
      console.log(post.comentarios);

      post.comentarios.push(nuevoComentario); // Agrega el comentario al array
      await post.save(); // Guarda los cambios

      return res.status(200).json({ message: 'Comentario agregado con éxito', comentario: nuevoComentario });
  } catch (error) {
      console.error('Error al agregar comentario:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
  }
});
module.exports = router;

