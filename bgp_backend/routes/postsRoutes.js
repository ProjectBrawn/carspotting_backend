const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Token = require('../modelos/token');
const Posts = require('../modelos/posts');
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


// router.post('/createCar', autenticarToken, async (req, res) => {
//     const { marca, modelo, generacion, anyo, url_imagen, tipoCarroceria } = req.body;
  
//     if (!marca || !modelo || !generacion || !anyo) {
//       return res.status(400).send('Los campos marca, modelo, generacion y anyo son obligatorios');
//     }
  
//     try {
//       const nuevoCoche = new Posts({
//         marca,
//         modelo,
//         generacion,
//         anyo,
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

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Asegúrate de que esta carpeta existe
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

// Modifica tu ruta para usar multer
router.post('/postCars', autenticarToken, upload.single('imagen'), async (req, res) => {
    console.log("Datos recibidos:");
    console.log("Body:", req.body);
    console.log("File:", req.file);
    
    try {
        const {
            marca,
            modelo,
            anyo,
            generacion,
            ubicacion,
            descripcion,
            username,
            medallas
        } = req.body;
        console.log("hasta aqui0") 
        console.log(marca)
        console.log(modelo)
        console.log(anyo)
        console.log(username)
        console.log(req.file)
        // Validar los campos obligatorios
        if (!marca || !modelo || !anyo || !username || !req.file) {
            return res.status(400).json({
                error: 'Los campos marca, modelo, anyo, imagen y username son obligatorios.'
            });
        }
        console.log("hasta aqui1")
        // Crear un nuevo post
        const nuevoPost = new Posts({
            marca,
            modelo,
            anyo,
            generacion,
            ubicacion,
            descripcion,
            imagen: req.file.path, // Guarda la ruta del archivo
            username,
            medallas: medallas ? JSON.parse(medallas) : [],
        });
        
        // Guardar en la base de datos
        await nuevoPost.save();
        console.log("hasta aqui2")
        res.status(201).json({
            mensaje: 'Coche publicado correctamente',
            post: nuevoPost
        });
        console.log("hasta aqui3")
    } catch (error) {
        console.error('Error al publicar el coche:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            detalles: error.message
        });
    }
});

module.exports = router;

