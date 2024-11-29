const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./modelos/users.js');
const Coche = require('./modelos/cars.js');
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
        await Coche.deleteMany({});
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
                garaje_principal:[]
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
                garaje_principal:[]
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
                garaje_principal:[]
            }
        ]);

        // Añadir amigos
        usuarios[0].amigos = [usuarios[1]._id, usuarios[2]._id];
        usuarios[1].amigos = [usuarios[0]._id];
        usuarios[2].amigos = [usuarios[0]._id];
        await Promise.all(usuarios.map(usuario => usuario.save()));

        // Crear coches
        const coches = await Coche.create([
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
                imagen: 'https://m.media-amazon.com/images/I/71-I1pj+7KL._AC_SL1500_.jpg',
                usuario_captura: usuarios[0]._id,
                medallas: [medallas[0]._id],
                comentarios: [
                    {
                        usuario: usuarios[1]._id,
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
                imagen: 'https://spots.ag/2021/08/25/nissan-skyline-r34-gt-r-c945525082021233910_1.jpg?1629927579',
                usuario_captura: usuarios[1]._id,
                medallas: [medallas[1]._id],
                comentarios: [
                    {
                        usuario: usuarios[0]._id,
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
                imagen: 'https://www.ocasionplus.com/wp-content/uploads/2023/04/Mazda-RX-7-1.jpg',
                usuario_captura: usuarios[2]._id,
                comentarios: [
                    {
                        usuario: usuarios[0]._id,
                        texto: 'Motor rotativo increíble'
                    }
                ]
            }
        ]);

        // // Actualizar garajes principales
        // usuarios[0].garaje_principal = [coches[0]._id];
        // usuarios[1].garaje_principal = [coches[1]._id];
        // usuarios[2].garaje_principal = [coches[2]._id];
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