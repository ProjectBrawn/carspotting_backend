const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./modelos/users.js');
const Post = require('./modelos/posts.js');
const Medalla = require('./modelos/achievements.js');

// Función para generar contraseña hasheada
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

// Función principal de seed
async function seedDatabase() {
    try {
        // Conexión a la base de datos (ajusta la URL según tu configuración)
        await mongoose.connect('mongodb://127.0.0.1:27017/brawngpapp', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Limpiar base de datos
        await User.deleteMany({});
        await Post.deleteMany({});
        await Medalla.deleteMany({});
        await Medalla.deleteMany({});

        // Crear algunas medallas de ejemplo
        const medallas = await Medalla.create([
            {
                nombre: 'Primer Spoteo',
                descripcion: 'Primera foto de coche capturada',
                puntos: 10
            },
            {
                nombre: 'Coleccionista',
                descripcion: 'Captura 10 coches diferentes',
                puntos: 50
            }
        ]);

        // Crear usuarios
        const usuarios = await User.create([
            {
                nombre: 'Juan Pérez',
                apellidos: 'apellido',
                username: 'juanspotter',
                email: 'juan@example.com',
                password: await hashPassword('password123'),
                descripcion: 'Amante de los coches clásicos',
                fotoPerfil: 'https://randomuser.me/api/portraits/men/1.jpg',
                puntos_experiencia: 0,
                garaje_principal: []
            },
            {
                nombre: 'María López',
                apellidos: 'apellido',
                username: 'mariaspotter',
                email: 'maria@example.com',
                password: await hashPassword('password456'),
                descripcion: 'Fan de los deportivos',
                fotoPerfil: 'https://randomuser.me/api/portraits/women/1.jpg',
                puntos_experiencia: 0,
                garaje_principal: []
            },
            {
                nombre: 'Carlos Ruiz',
                apellidos: 'apellido',
                username: 'carlosspotter',
                email: 'carlos@example.com',
                password: await hashPassword('password789'),
                descripcion: 'Coleccionista de autos japoneses',
                fotoPerfil: 'https://randomuser.me/api/portraits/men/2.jpg',
                puntos_experiencia: 0,
                garaje_principal: []
            },
            {
                nombre: 'Ayrton Senna',
                apellidos: 'apellido',
                username: 'ayrton1',
                email: 'ayrton@example.com',
                password: await hashPassword('password789'),
                descripcion: 'Best f1 driver ever',
                fotoPerfil: 'https://randomuser.me/api/portraits/men/5.jpg',
                puntos_experiencia: 0,
                garaje_principal: []
            }
        ]);

        // Añadir amigos
        usuarios[0].amigos = [usuarios[1].username, usuarios[2].username];
        usuarios[1].amigos = [usuarios[0].username];
        usuarios[2].amigos = [usuarios[0].username];
        await Promise.all(usuarios.map(usuario => usuario.save()));

        console.log('Usuarios creados con éxito');

        // Crear coches
        const posts = await Post.create([
            {
                marca: 'Toyota',
                modelo: 'Supra MK4',
                año: 1997,
                generacion: 'A80',
                ubicacion: {
                    latitud: 40.7128,
                    longitud: -74.0060,
                    direccion: 'New York, NY'
                },
                imagen: 'https://pbs.twimg.com/media/EbbZkhZWAAAa8iC.jpg:large',
                username: usuarios[0].username,
                medallas: [medallas[0]._id],
                comentarios: [
                    {
                        usuario: usuarios[1].username,
                        texto: '¡Qué máquina!'
                    }
                ]
            },
            {
                marca: 'Nissan',
                modelo: 'GTR R34',
                año: 2002,
                generacion: 'BNR34',
                ubicacion: {
                    latitud: 35.6762,
                    longitud: 139.6503,
                    direccion: 'Tokyo, Japan'
                },
                imagen: 'http://www.jmautomocion.com/pics_fotosproductos/1495/big_full_1.jpg',
                username: usuarios[1].username,
                medallas: [medallas[1]._id],
                comentarios: [
                    {
                        usuario: usuarios[0].username,
                        texto: 'Legendario!'
                    }
                ]
            },
            {
                marca: 'Mazda',
                modelo: 'RX-7',
                año: 1995,
                generacion: 'FD3S',
                ubicacion: {
                    latitud: 34.0522,
                    longitud: -118.2437,
                    direccion: 'Los Angeles, CA'
                },
                imagen: 'https://i.ytimg.com/vi/nn9t_NaH2vo/maxresdefault.jpg',
                username: usuarios[2].username,
                comentarios: [
                    {
                        usuario: usuarios[0].username,
                        texto: 'Motor rotativo increíble'
                    }
                ]
            },

            {
                marca: 'Porsche',
                modelo: '911 GT3',
                año: 2022, // Ajusta el año al modelo específico si es necesario
                generacion: '992', // Añade la generación del modelo, si la conoces
                ubicacion: {
                    latitud: 40.4168,
                    longitud: -3.7038,
                    direccion: 'Madrid, Spain'
                },
                imagen: 'https://philipireland.com/_userfiles/thumbs/_userfiles-pages-images-cars-992_gt3rs/porsche_992_gt3rs_12_2000x1335-jpg/62e48ebf8900efabf56fab20f3a367d0/porsche_992_gt3rs_12_2000x1335.jpg', // Añade una URL de imagen adecuada
                username: usuarios[1].username,
                comentarios: [
                    {
                        usuario: usuarios[2].username,
                        texto: '¡Increíble diseño!'
                    }
                ]
            },

            {
                marca: 'Mclaren',
                modelo: 'MP4/8A',
                año: 1982, // Ajusta el año al modelo específico si es necesario
                generacion: '992', // Añade la generación del modelo, si la conoces
                ubicacion: {
                    latitud: 40.5168,
                    longitud: -3.7038,
                    direccion: 'Madrid, Spain'
                },
                imagen: 'https://img.remediosdigitales.com/47c725/mclaren-f1-senna-9/1366_2000.jpg', // Añade una URL de imagen adecuada
                username: usuarios[3].username,
                comentarios: [
                ]
            }
        ]);

        // // Actualizar garajes principales
        // usuarios[0].garaje_principal = [posts[0]._id];
        // // usuarios[0].garaje_principal = [posts[1]._id];
        usuarios[0].garaje_principal = [posts[0]._id, posts[1]._id]; // IDs de los coches que deseas añadir
        await usuarios[0].save();
        await Promise.all(usuarios.map(usuario => usuario.save()));

        console.log('Base de datos poblada con éxito');

        // Cerrar conexión
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error al poblar la base de datos:', error);
        await mongoose.connection.close();
    }
}

// Ejecutar seed
seedDatabase();

module.exports = seedDatabase;