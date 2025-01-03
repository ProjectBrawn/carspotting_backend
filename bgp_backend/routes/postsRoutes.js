const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Token = require('../modelos/token');
const Posts = require('../modelos/posts');
const Users = require('../modelos/users');
const {obtenerTodosCoches } = require('../middleware/posts');

const { autenticarToken, SECRET_KEY } = require('../middleware/auth');

router.get('/:id', autenticarToken, async (req, res) => {
    try {
        // Asegúrate de que el ID proporcionado sea un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).send('ID no válido');
        }

        // Busca el post por su ObjectId
        const post = await Posts.findById(req.params.id);
        if (!post) {
            return res.status(404).send('Post no encontrado');
        }

        return res.status(200).send(post);

    } catch (error) {
        return res.status(500).send('Error en el servidor');
    }
});


// Obtiene el feed de coches de amigos del usuario actual
router.get('/', autenticarToken, async (req, res) => {
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

      post.comentarios.push(nuevoComentario); // Agrega el comentario al array
      await post.save(); // Guarda los cambios

      return res.status(200).json({ message: 'Comentario agregado con éxito', comentario: nuevoComentario });
  } catch (error) {
      console.error('Error al agregar comentario:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/:id/comments', autenticarToken, async (req, res) => {
    console.log("la llammooooo")
    try {
        console.log("dentroooo")
        
        // Validar que el ID es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).send('ID no válido');
        }

        // Buscar el post por su ID
        const post = await Posts.findById(req.params.id);
        console.log("el postt")
        console.log(post)
        if (!post) {
            return res.status(404).send('Post no encontrado');
        }

        // Devolver los comentarios del post
        return res.status(200).json({ comentarios: post.comentarios });
    } catch (error) {
        console.error('Error al obtener los comentarios:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Modifica tu ruta para usar multer
router.post('/postCars', autenticarToken, async (req, res) => {    
    try {
        const {
            marca,
            modelo,
            year,
            //descripcion,
            location,
            username,
            imageUrl
        } = req.body;
        // Validar los campos obligatorios
        if (!marca || !modelo || !year || !location || !username || !imageUrl) {
            return res.status(400).json({ error: 'Se requieren todos los campos' });
        }
        // Crear un nuevo post
        const nuevoPost = new Posts({
            marca,
            modelo,
            anyo: year,
            //generacion: req.body.generacion,
            //descripcion,
            //ubicacion: location,
            username,
            imagen:imageUrl, // Guarda la ruta del archivo
            //medallas: medallas ? JSON.parse(medallas) : [],
        });
        
        // Guardar en la base de datos
        await nuevoPost.save();
        //Ahora quiero saber cual era el objectid del post que acabo de guardar
        //Actualizar el campo posts del usuario
        const user = await Users.findOne({ username: username });
        user.spots.push(nuevoPost._id);
        await user.save();
    
        res.status(201).json({
            mensaje: 'Coche publicado correctamente',
            post: nuevoPost
        });
    } catch (error) {
        console.error('Error al publicar el coche:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            detalles: error.message
        });
    }
});


module.exports = router;

