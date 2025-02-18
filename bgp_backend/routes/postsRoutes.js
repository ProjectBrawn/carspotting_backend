const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Token = require('../modelos/token');
const Posts = require('../modelos/posts');
const Users = require('../modelos/users');
const Logos = require('../modelos/carLogos');
const Medalla = require('../modelos/achievements.js');
const xss = require('xss');  // Para sanitizar entradas de texto

const sanitizeHtml = require('sanitize-html'); // Para limpiar entradas HTML

const { obtenerTodosCoches, getCityAndCountry } = require('../middleware/posts');
const { asignarMedallas } = require('../middleware/medalls');



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


// Obtiene todos los coches, no solo los del amigo 
router.get('/', autenticarToken, async (req, res) => {
    try {
        const fechaLimite = new Date(); // Hora actual
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

        // Validar longitud del texto
        if (texto.length > 200) {
            return res.status(400).json({ error: 'El comentario es demasiado largo. Máximo 200 caracteres.' });
        }

        // Filtrar texto para evitar inyecciones y cadenas maliciosas
        const sanitizedText = sanitizeHtml(texto, {
            allowedTags: [], // No se permiten etiquetas HTML
            allowedAttributes: {} // No se permiten atributos
        });

        if (sanitizedText.trim() === '') {
            return res.status(400).json({ error: 'El comentario no puede estar vacío o ser inválido.' });
        }

        // Validar el nombre de usuario si es necesario
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            return res.status(400).json({ error: 'El nombre de usuario contiene caracteres no permitidos.' });
        }

        // Buscar el objeto en la base de datos
        const post = await Posts.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }

        // Agregar el nuevo comentario
        const nuevoComentario = {
            usuario: username,
            texto: sanitizedText
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
    try {

        // Validar que el ID es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).send('ID no válido');
        }

        // Buscar el post por su ID
        const post = await Posts.findById(req.params.id);
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
            generacion,
            nacionalidad,
            location,
            username,
            imageUrl
        } = req.body;

        // Validar que todos los campos necesarios estén presentes
        if (!marca || !modelo || !year || !location || !username || !imageUrl || !nacionalidad || !generacion) {
            return res.status(400).json({ error: 'Se requieren todos los campos' });
        }

        // Validar y sanitizar el contenido
        var sanitizedMarca = xss(marca);
        const sanitizedModelo = xss(modelo);
        const sanitizedNacionalidad = xss(nacionalidad);
        const sanitizedGeneracion = xss(generacion);
        const sanitizedUsername = xss(username);

        // La ubicación se separa por latitud y longitud
        const locationArray = location.split(",");
        if (locationArray.length !== 2) {
            return res.status(400).json({ error: 'La ubicación no es válida. Debe tener formato "latitud,longitud".' });
        }

        const latitud = parseFloat(locationArray[0]);
        const longitud = parseFloat(locationArray[1]);

        // Verificar que la latitud y longitud sean válidas
        if (isNaN(latitud) || isNaN(longitud)) {
            return res.status(400).json({ error: 'La latitud o longitud no son válidas.' });
        }

        // Obtener la ciudad y el país de las coordenadas
        const locationData = await getCityAndCountry(latitud, longitud);
        if (!locationData || !locationData.city || !locationData.country) {
            return res.status(400).json({ error: 'No se pudo obtener la ubicación' });
        }

        const locationString = `${locationData.city}, ${locationData.country}`;

        const localizacion = {
            latitud: latitud,
            longitud: longitud,
            direccion: locationString
        };

        // Sanitizar imageUrl para prevenir XSS, incluso si es una URL.
        const sanitizedImageUrl = xss(imageUrl);
        //Reemplazamos los guiones por espacios
        sanitizedMarca = sanitizedMarca.replace(/-/g, ' ');
        console.log(sanitizedMarca);
        
        var urlLogo = {}
        // Obtener el logo de la marca del coche
        try{
            urlLogo = await Logos.findOne({
                $or: [
                    { marca: { $regex: '.*' + sanitizedMarca + '.*', $options: 'i' } },
                    { marca: { $regex: sanitizedMarca, $options: 'i' } }
                ]
            }).select('urlLogo');
        } catch (error) {
            urlLogo = { urlLogo: 'https://i.ibb.co/cKY6KzqR/logo-2.png' };
        }

        let urlInsertar = urlLogo?.urlLogo || 'https://i.ibb.co/cKY6KzqR/logo-2.png';

        // Crear un objeto con los datos del coche
        const coche = {
            marca: sanitizedMarca,
            modelo: sanitizedModelo,
            anyo: year,
            generacion: sanitizedGeneracion,
            nacionalidad: sanitizedNacionalidad,
            ubicacion: localizacion,
            username: sanitizedUsername,
            imagen: sanitizedImageUrl,
            urlLogo: urlInsertar
        };

        // Llamar a la función para asignar medallas
        const medallasAsignadas = await asignarMedallas(coche);
        const medallasNombres = await Medalla.find({
            '_id': { $in: medallasAsignadas }
        }).select('nombre');

        // medallasNombres será un array de objetos, para tener solo los nombres:
        const nombresArray = medallasNombres.map(medalla => medalla.nombre);

        // Crear un nuevo post con las medallas asignadas
        const nuevoPost = new Posts({
            ...coche,
            medallas: medallasAsignadas,
        });

        await nuevoPost.save();

        // Obtener el usuario y agregar el post al array de spots
        const user = await Users.findOne({ $or: [{ username: sanitizedUsername }, { email: sanitizedUsername }] });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        user.spots.push(nuevoPost._id);
        await user.save();

        res.status(201).json({
            mensaje: 'Coche publicado correctamente',
            post: nuevoPost,
            medallas: nombresArray // Incluir las medallas asignadas en la respuesta
        });
    } catch (error) {
        console.error('Error al publicar el coche:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            detalles: error.message
        });
    }
});

router.delete('/:id', autenticarToken, async (req, res) => {
    try {
        // Verificar que el ID es válido
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'ID no válido' });
        }

        // Buscar el post
        const post = await Posts.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }

        // Eliminar el post de la lista de spots del usuario
        await Users.updateOne(
            { username: post.username },
            { $pull: { spots: post._id } }
        );

        // Eliminar el post
        await Posts.findByIdAndDelete(req.params.id);

        return res.status(200).json({ message: 'Post eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el post:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;