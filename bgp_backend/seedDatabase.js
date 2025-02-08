const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./modelos/users.js');
const Post = require('./modelos/posts.js');
const Medalla = require('./modelos/achievements.js');
const Logos = require('./modelos/carLogos.js');
require('dotenv').config();

// Función para generar contraseña hasheada
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

// Función principal de seed
async function seedDatabase() {
    try {
        // Conexión a la base de datos (ajusta la URL según tu configuración)

        //Deployment
        //await mongoose.connect(process.env.CONNECTION_STRING);

        //Local
        await mongoose.connect('mongodb://127.0.0.1:27017/brawngpapp');

        // Limpiar base de datos
        await User.deleteMany({});
        await Post.deleteMany({});
        await Medalla.deleteMany({});

        // Crear algunas medallas de ejemplo
        const medallas = await Medalla.create([
            {
                nombre: 'Holly Trinity',
                descripcion: 'McLaren P1, Porsche 918, and LaFerrari, the holy trinity of hypercars that define an era.',
            },
            {
                nombre: 'American Icon',
                descripcion: 'Mustang, Camaro, Challenger, and other iconic American models.',
            },
            {
                nombre: 'JDM Empire',
                descripcion: 'Legendary Japanese models like RX7, RX8, Supra, and more.',
            },
            {
                nombre: 'Swedish Host',
                descripcion: 'Koenigsegg cars, the Swedish supercar brand.',
            },
            {
                nombre: 'Neck Breaker',
                descripcion: 'Cars that awe with their speed, like Ferrari 488, Lamborghini Huracán, Porsche 911, and many more.',
            },
            {
                nombre: 'Martini Vodka',
                descripcion: '007, Aston Martin, British luxury.',
            },
            {
                nombre: 'No Path Needed',
                descripcion: 'Off-road and 4x4 vehicles that dominate any terrain, like the Jeep Wrangler, Toyota Land Cruiser, and Land Rover.',
            },
            {
                nombre: 'Washing Machine',
                descripcion: 'Tesla, the electric cars revolutionizing the industry.',
            },
            {
                nombre: 'Silent Luxury',
                descripcion: 'Rolls Royce, Bentley, and Mercedes Maybach, luxury cars with low profile.',
            },
            {
                nombre: 'Everyones Favorite',
                descripcion: 'Porsche 911 GT3RS, a fan favorite in the world of high-performance cars.',
            },
            {
                nombre: 'Ferrari Repoker',
                descripcion: 'No word needed, Ferrari is Ferrari.',
            },
            {
                nombre: 'German Engineer',
                descripcion: 'Mercedes, BMW, and Audi, German brands known for precision engineering.',
            },
            {
                nombre: 'Car of the Day',
                descripcion: 'Get the car of the day and show your spotting skills.',
            },
        ]);

        // Crear usuarios
        const usuarios = await User.create([
            {
                username: 'juanspotter',
                email: 'juan@example.com',
                sexo: 'Hombre',
                anyo_nacimiento: '1990',
                pais: 'España',
                password: await hashPassword('password123'),
                descripcion: 'Amante de los coches clásicos',
                fotoPerfil: 'https://i.etsystatic.com/35372836/r/il/70df1f/5861902788/il_fullxfull.5861902788_odt2.jpg',
                puntos_experiencia: 0,
                garaje_principal: [],
                spots: [] // Añadido el campo 'spots'
            },
            {
                username: 'mariaspotter',
                email: 'maria@example.com',
                sexo: 'Mujer',
                anyo_nacimiento: '1995',
                pais: 'España',
                password: await hashPassword('password456'),
                descripcion: 'Fan de los deportivos',
                fotoPerfil: 'https://randomuser.me/api/portraits/women/1.jpg',
                puntos_experiencia: 0,
                garaje_principal: [],
                spots: [] // Añadido el campo 'spots'
            },
            {
                username: 'carlosspotter',
                email: 'carlos@example.com',
                sexo: 'Hombre',
                anyo_nacimiento: '1985',
                pais: 'España',
                password: await hashPassword('password789'),
                descripcion: 'Coleccionista de autos japoneses',
                fotoPerfil: 'https://randomuser.me/api/portraits/men/2.jpg',
                puntos_experiencia: 0,
                garaje_principal: [],
                spots: [] // Añadido el campo 'spots'
            },
            {
                username: 'ayrton1',
                email: 'ayrton@example.com',
                sexo: 'Hombre',
                anyo_nacimiento: '1960',
                pais: 'Brasil',
                password: await hashPassword('password789'),
                descripcion: 'Best f1 driver ever',
                fotoPerfil: 'https://randomuser.me/api/portraits/men/5.jpg',
                puntos_experiencia: 0,
                garaje_principal: [],
                spots: [] // Añadido el campo 'spots'
            }
        ]);

        // Añadir siguiendo y seguidores
        usuarios[0].siguiendo.push(usuarios[0].username, usuarios[1].username, usuarios[2].username);
        usuarios[0].seguidores.push(usuarios[0].username); // Se sigue a sí mismo
        usuarios[1].seguidores.push(usuarios[0].username);
        usuarios[2].seguidores.push(usuarios[0].username);
        
        usuarios[1].siguiendo.push(usuarios[0].username);
        usuarios[0].seguidores.push(usuarios[1].username);
        
        usuarios[2].siguiendo.push(usuarios[0].username);
        usuarios[0].seguidores.push(usuarios[2].username);
        
        await Promise.all(usuarios.map(usuario => usuario.save()));


        // Crear coches
        const posts = await Post.create([
            {
                marca: 'Toyota',
                modelo: 'Supra MK4',
                anyo: 1997,
                generacion: 'A80',
                nacionalidad: 'Japon',
                ubicacion: {
                    latitud: 40.7128,
                    longitud: -74.0060,
                    direccion: 'New York, NY'
                },
                imagen: 'https://pbs.twimg.com/media/EbbZkhZWAAAa8iC.jpg:large',
                username: usuarios[2].username,
                medallas: [medallas[0]._id],
                comentarios: [
                    {
                        usuario: usuarios[1].username,
                        texto: '¡Qué máquina!'
                    }
                ],
                urlLogo: "https://i.ibb.co/n7bN76H/toyota.png"
            },
            {
                marca: 'Nissan',
                modelo: 'GTR R34',
                anyo: 2002,
                generacion: 'BNR34',
                nacionalidad: 'Japon',
                ubicacion: {
                    latitud: 35.6762,
                    longitud: 139.6503,
                    direccion: 'Tokyo, Japan'
                },
                imagen: 'http://www.jmautomocion.com/pics_fotosproductos/1495/big_full_1.jpg',
                username: usuarios[0].username,
                medallas: [medallas[1]._id],
                comentarios: [
                    {
                        usuario: usuarios[0].username,
                        texto: 'Legendario!'
                    }
                ],
                urlLogo: "https://i.ibb.co/Q9HvssS/nissan.png"

            },
            {
                marca: 'Mazda',
                modelo: 'RX-7',
                anyo: 1995,
                generacion: 'FD3S',
                nacionalidad: 'Japon',
                ubicacion: {
                    latitud: 34.0522,
                    longitud: -118.2437,
                    direccion: 'Los Angeles, CA'
                },
                imagen: 'https://i.ytimg.com/vi/nn9t_NaH2vo/maxresdefault.jpg',
                username: usuarios[3].username,
                comentarios: [
                    {
                        usuario: usuarios[0].username,
                        texto: 'Motor rotativo increíble'
                    }
                ],
                urlLogo: "https://i.ibb.co/PQ7mqr9/mazda.png"

            },

            {
                marca: 'Porsche',
                modelo: '911 GT3',
                anyo: 2022,
                nacionalidad: 'Alemania',
                generacion: '992',
                ubicacion: {
                    latitud: 40.4168,
                    longitud: -3.7038,
                    direccion: 'Madrid, Spain'
                },
                imagen: 'https://philipireland.com/_userfiles/thumbs/_userfiles-pages-images-cars-992_gt3rs/porsche_992_gt3rs_12_2000x1335-jpg/62e48ebf8900efabf56fab20f3a367d0/porsche_992_gt3rs_12_2000x1335.jpg',
                username: usuarios[1].username,
                comentarios: [
                    {
                        usuario: usuarios[2].username,
                        texto: '¡Increíble diseño!'
                    }
                ],
                urlLogo: "https://i.ibb.co/TYSCCC0/porsche.png"

            },

            {
                marca: 'Mclaren',
                modelo: 'MP4/8A',
                anyo: 1982,
                nacionalidad: 'Reino Unido',
                generacion: '992',
                ubicacion: {
                    latitud: 40.5168,
                    longitud: -3.7038,
                    direccion: 'Madrid, Spain'
                },
                imagen: 'https://img.remediosdigitales.com/47c725/mclaren-f1-senna-9/1366_2000.jpg',
                username: usuarios[1].username,
                comentarios: [
                ],
                urlLogo: "https://i.ibb.co/YQrJc3R/mclaren.png"

            },
            {
                marca: 'Lamborghini',
                modelo: 'Aventador',
                anyo: 2005,
                nacionalidad: 'Italia',
                generacion: 'LP740',
                ubicacion: {
                    latitud: 41.7128,
                    longitud: -74.0060,
                    direccion: 'New York, NY'
                },
                imagen: 'https://cdn.businessinsider.es/sites/navi.axelspringer.es/public/media/image/2019/09/say-hello-lamborghini-aventador-svj-rosso-mimir-matte-red-paint-job.jpg?tf=3840x.jpg:large',
                username: usuarios[0].username,
                medallas: [medallas[0]._id],
                comentarios: [
                    {
                        usuario: usuarios[1].username,
                        texto: '¡Qué máquina!'
                    }
                ],
                urlLogo: "https://i.ibb.co/JKxPjvB/lamborghini.png"

            },
        ]);

        // Asignar coches a 'garaje_principal' de los usuarios
        usuarios[0].garaje_principal = [posts[1]._id]; // Juan tiene estos coches en su garaje
        usuarios[1].garaje_principal = [posts[3]._id]; // María tiene estos coches en su garaje
        usuarios[2].garaje_principal = [posts[0]._id]; // Carlos tiene este coche en su garaje
        usuarios[3].garaje_principal = []; // Ayrton tiene este coche en su garaje

        // Asignar coches a 'spots' de los usuarios
        usuarios[0].spots = [posts[1]._id, posts[5]._id]; // Juan tiene estos coches en spots
        usuarios[1].spots = [posts[3]._id, posts[4]._id]; // María tiene estos coches en spots
        usuarios[2].spots = [posts[0]._id]; // Carlos tiene este coche en spots
        usuarios[3].spots = [posts[2]._id]; // Ayrton tiene este coche en spots

        // Guardar usuarios con sus coches en garaje y spots
        await Promise.all(usuarios.map(usuario => usuario.save()));

        //Insertamos los logos

        const logosData = [
            { "marca": "9ff", "urlLogo": "https://i.ibb.co/frxdZLj/9ff.png" },
            { "marca": "Abarth", "urlLogo": "https://i.ibb.co/DfRLwnG/abarth.png" },
            { "marca": "Abt", "urlLogo": "https://i.ibb.co/FwMs9xK/abt.png" },
            { "marca": "Ac", "urlLogo": "https://i.ibb.co/9Y8vdJT/ac.png" },
            { "marca": "Acura", "urlLogo": "https://i.ibb.co/j5mvD66/acura.png" },
            { "marca": "Aixam", "urlLogo": "https://i.ibb.co/jbTHVjy/aixam.png" },
            { "marca": "Alfa Romeo", "urlLogo": "https://i.ibb.co/4pkN40y/alfa-romeo.png" },
            { "marca": "Alpina", "urlLogo": "https://i.ibb.co/1qPPRNs/alpina.png" },
            { "marca": "Alpine", "urlLogo": "https://i.ibb.co/jfZXXwJ/alpine.png" },
            { "marca": "Apollo", "urlLogo": "https://i.ibb.co/wpLc9Dz/apollo.png" },
            { "marca": "Arcfox", "urlLogo": "https://i.ibb.co/WBrQcfr/arcfox.png" },
            { "marca": "Ariel", "urlLogo": "https://i.ibb.co/tMm14ny/ariel.png" },
            { "marca": "Ascari", "urlLogo": "https://i.ibb.co/7Rq8WFf/ascari.png" },
            { "marca": "Aspark", "urlLogo": "https://i.ibb.co/47Knvcv/aspark.png" },
            { "marca": "Aston Martin", "urlLogo": "https://i.ibb.co/34QLcGd/aston-martin.png" },
            { "marca": "Audi", "urlLogo": "https://i.ibb.co/44Pf9dG/audi.png" },
            { "marca": "Austin", "urlLogo": "https://i.ibb.co/mC2xXbq/austin.png" },
            { "marca": "Autobianchi", "urlLogo": "https://i.ibb.co/tD9n3Ws/autobianchi.png" },
            { "marca": "Bac", "urlLogo": "https://i.ibb.co/CJLDYwc/bac.png" },
            { "marca": "Bentley", "urlLogo": "https://i.ibb.co/gjL9Tjw/bentley.png" },
            { "marca": "Bmw", "urlLogo": "https://i.ibb.co/v1qf49K/bmw.png" },
            { "marca": "Brabus", "urlLogo": "https://i.ibb.co/cTvBHcb/brabus.png" },
            { "marca": "Bugatti", "urlLogo": "https://i.ibb.co/gR0x1fK/bugatti.png" },
            { "marca": "Chrysler", "urlLogo": "https://i.ibb.co/9nQDWTW/chrysler.png" },
            { "marca": "Citroen", "urlLogo": "https://i.ibb.co/hL5Lv1H/citroen.png" },
            { "marca": "Dacia", "urlLogo": "https://i.ibb.co/VN0g8hF/dacia.png" },
            { "marca": "Daewoo", "urlLogo": "https://i.ibb.co/C2bRJG7/daewoo.png" },
            { "marca": "David Brown", "urlLogo": "https://i.ibb.co/Fb0KPSV/david-brown.png" },
            { "marca": "Delage", "urlLogo": "https://i.ibb.co/fCRRhYf/delage.png" },
            { "marca": "De Tomaso", "urlLogo": "https://i.ibb.co/74Vt412/de-tomaso.png" },
            { "marca": "Dmc", "urlLogo": "https://i.ibb.co/mF8pxsP/dmc.png" },
            { "marca": "Dodge", "urlLogo": "https://i.ibb.co/3C7BJRX/dodge.png" },
            { "marca": "Ds", "urlLogo": "https://i.ibb.co/TRpy9Zr/ds.png" },
            { "marca": "Ferrari", "urlLogo": "https://i.ibb.co/MyHyGyS/ferrari.png" },
            { "marca": "Fiat", "urlLogo": "https://i.ibb.co/mtJrrqx/fiat.png" },
            { "marca": "Fioravanti", "urlLogo": "https://i.ibb.co/YQnKpLJ/fioravanti.png" },
            { "marca": "Fisker", "urlLogo": "https://i.ibb.co/6mn96LJ/fisker.png" },
            { "marca": "Ford", "urlLogo": "https://i.ibb.co/QN3xC76/ford.png" },
            { "marca": "Genesis", "urlLogo": "https://i.ibb.co/cc4QdMr/genesis.png" },
            { "marca": "Ginetta", "urlLogo": "https://i.ibb.co/xqhhcjr/ginetta.png" },
            { "marca": "Gmc", "urlLogo": "https://i.ibb.co/yqVN64J/gmc.png" },
            { "marca": "Hennessey", "urlLogo": "https://i.ibb.co/Qbs72qY/hennessey.png" },
            { "marca": "Honda", "urlLogo": "https://i.ibb.co/HqN0k8N/honda.png" },
            { "marca": "Hummer", "urlLogo": "https://i.ibb.co/ZSnP4Ty/hummer.png" },
            { "marca": "Hyundai", "urlLogo": "https://i.ibb.co/dMMd8j4/hyundai.png" },
            { "marca": "Infiniti", "urlLogo": "https://i.ibb.co/wJw2cnj/infiniti.png" },
            { "marca": "Jaguar", "urlLogo": "https://i.ibb.co/n06P0bg/jaguar.png" },
            { "marca": "Jba Motors", "urlLogo": "https://i.ibb.co/N9Ln9TX/jba-motors.png" },
            { "marca": "Jeep", "urlLogo": "https://i.ibb.co/B4gKSYQ/jeep.png" },
            { "marca": "Jetta", "urlLogo": "https://i.ibb.co/7bjcbTF/jetta.png" },
            { "marca": "Jmc", "urlLogo": "https://i.ibb.co/p25gzS1/jmc.png" },
            { "marca": "Kia", "urlLogo": "https://i.ibb.co/wwrzGFw/kia.png" },
            { "marca": "Koenigsegg", "urlLogo": "https://i.ibb.co/RQmQRq9/koenigsegg.png" },
            { "marca": "Ktm", "urlLogo": "https://i.ibb.co/JCSV9V1/ktm.png" },
            { "marca": "Lada", "urlLogo": "https://i.ibb.co/XtN390x/lada.png" },
            { "marca": "Lagonda", "urlLogo": "https://i.ibb.co/xCpJmbQ/lagonda.png" },
            { "marca": "Lamborghini", "urlLogo": "https://i.ibb.co/JKxPjvB/lamborghini.png" },
            { "marca": "Lancia", "urlLogo": "https://i.ibb.co/cvRnPWk/lancia.png" },
            { "marca": "Land Rover", "urlLogo": "https://i.ibb.co/Y0zNTxH/land-rover.png" },
            { "marca": "Lexus", "urlLogo": "https://i.ibb.co/9N7D6Ls/lexus.png" },
            { "marca": "Ligier", "urlLogo": "https://i.ibb.co/Jz9YFmd/ligier.png" },
            { "marca": "Lincoln", "urlLogo": "https://i.ibb.co/HhQ0VGC/lincoln.png" },
            { "marca": "Lotus", "urlLogo": "https://i.ibb.co/6Z5T05h/lotus.png" },
            { "marca": "Lucid", "urlLogo": "https://i.ibb.co/p30Cg3W/lucid.png" },
            { "marca": "Lynk And Co", "urlLogo": "https://i.ibb.co/5WcmFjq/lynk-and-co.png" },
            { "marca": "Mahindra", "urlLogo": "https://i.ibb.co/VDH2Cg9/mahindra.png" },
            { "marca": "Mansory", "urlLogo": "https://i.ibb.co/GkqsV2N/mansory.png" },
            { "marca": "Maserati", "urlLogo": "https://i.ibb.co/wWWHtBq/maserati.png" },
            { "marca": "Maybach", "urlLogo": "https://i.ibb.co/86y5D3d/maybach.png" },
            { "marca": "Mazda", "urlLogo": "https://i.ibb.co/PQ7mqr9/mazda.png" },
            { "marca": "Mclaren", "urlLogo": "https://i.ibb.co/YQrJc3R/mclaren.png" },
            { "marca": "Mercedes Benz", "urlLogo": "https://i.ibb.co/t2xvDg8/mercedes-benz.png" },
            { "marca": "Mg", "urlLogo": "https://i.ibb.co/j4MyNK2/mg.png" },
            { "marca": "Mini", "urlLogo": "https://i.ibb.co/MB4wy9T/mini.png" },
            { "marca": "Mitsubishi", "urlLogo": "https://i.ibb.co/KjsC6rD/mitsubishi.png" },
            { "marca": "Morgan", "urlLogo": "https://i.ibb.co/6Y6H1F7/morgan.png" },
            { "marca": "Morris", "urlLogo": "https://i.ibb.co/7pggQSM/morris.png" },
            { "marca": "Nikola", "urlLogo": "https://i.ibb.co/W6PZZvK/nikola.png" },
            { "marca": "Nio", "urlLogo": "https://i.ibb.co/4SH8S4x/nio.png" },
            { "marca": "Nissan", "urlLogo": "https://i.ibb.co/Q9HvssS/nissan.png" },
            { "marca": "Oldsmobile", "urlLogo": "https://i.ibb.co/M12MxWp/oldsmobile.png" },
            { "marca": "Opel", "urlLogo": "https://i.ibb.co/kybVS9K/opel.png" },
            { "marca": "Packard", "urlLogo": "https://i.ibb.co/3BvyFrb/packard.png" },
            { "marca": "Pagani", "urlLogo": "https://i.ibb.co/TMfCkv8/pagani.png" },
            { "marca": "Peugeot", "urlLogo": "https://i.ibb.co/5nKX3D8/peugeot.png" },
            { "marca": "Pininfarina", "urlLogo": "https://i.ibb.co/ZT7L0Xf/pininfarina.png" },
            { "marca": "Plymouth", "urlLogo": "https://i.ibb.co/W0r5BVF/plymouth.png" },
            { "marca": "Polestar", "urlLogo": "https://i.ibb.co/Wz4hwy3/polestar.png" },
            { "marca": "Pontiac", "urlLogo": "https://i.ibb.co/wC1DbJH/pontiac.png" },
            { "marca": "Porsche", "urlLogo": "https://i.ibb.co/TYSCCC0/porsche.png" },
            { "marca": "Praga", "urlLogo": "https://i.ibb.co/8KmbPqk/praga.png" },
            { "marca": "Radical", "urlLogo": "https://i.ibb.co/B4WyRkq/radical.png" },
            { "marca": "Ram", "urlLogo": "https://i.ibb.co/VSVCrzm/ram.png" },
            { "marca": "Renault", "urlLogo": "https://i.ibb.co/qMH9n7t/renault.png" },
            { "marca": "Rimac", "urlLogo": "https://i.ibb.co/8rPpGhZ/rimac.png" },
            { "marca": "Rinspeed", "urlLogo": "https://i.ibb.co/vw9hdwn/rinspeed.png" },
            { "marca": "Rivian", "urlLogo": "https://i.ibb.co/Wn49gJL/rivian.png" },
            { "marca": "Rolls Royce", "urlLogo": "https://i.ibb.co/NY9C7mx/rolls-royce.png" },
            { "marca": "Rossion", "urlLogo": "https://i.ibb.co/VSZFgct/rossion.png" },
            { "marca": "Rover", "urlLogo": "https://i.ibb.co/wy83JSy/rover.png" },
            { "marca": "Ruf", "urlLogo": "https://i.ibb.co/j5mpSP6/ruf.png" },
            { "marca": "Saab", "urlLogo": "https://i.ibb.co/ZGTBnHp/saab.png" },
            { "marca": "Saturn", "urlLogo": "https://i.ibb.co/HrJFNtD/saturn.png" },
            { "marca": "Scion", "urlLogo": "https://i.ibb.co/5sCwVsS/scion.png" },
            { "marca": "Seat", "urlLogo": "https://i.ibb.co/PrwMqWG/seat.png" },
            { "marca": "Skoda", "urlLogo": "https://i.ibb.co/fYjsSVm/skoda.png" },
            { "marca": "Smart", "urlLogo": "https://i.ibb.co/T1Xm8t9/smart.png" },
            { "marca": "Spania Gta", "urlLogo": "https://i.ibb.co/Nmr794n/spania-gta.png" },
            { "marca": "Ssangyong", "urlLogo": "https://i.ibb.co/5BLtXVX/ssangyong.png" },
            { "marca": "Subaru", "urlLogo": "https://i.ibb.co/6tGfCzz/subaru.png" },
            { "marca": "Suzuki", "urlLogo": "https://i.ibb.co/g7g0DYH/suzuki.png" },
            { "marca": "Talbot", "urlLogo": "https://i.ibb.co/zH39fZZ/talbot.png" },
            { "marca": "Tata", "urlLogo": "https://i.ibb.co/nMFt8jM/tata.png" },
            { "marca": "Techart", "urlLogo": "https://i.ibb.co/VvrXjfG/techart.png" },
            { "marca": "Tesla", "urlLogo": "https://i.ibb.co/hyQmc11/tesla.png" },
            { "marca": "Toyota", "urlLogo": "https://i.ibb.co/n7bN76H/toyota.png" },
            { "marca": "Trion", "urlLogo": "https://i.ibb.co/TTDCGkg/trion.png" },
            { "marca": "Triumph", "urlLogo": "https://i.ibb.co/s9C7t5V/triumph.png" },
            { "marca": "Tucker", "urlLogo": "https://i.ibb.co/rcfgQcB/tucker.png" },
            { "marca": "Vauxhall", "urlLogo": "https://i.ibb.co/tXybXGV/vauxhall.png" },
            { "marca": "Volkswagen", "urlLogo": "https://i.ibb.co/rsQtkfX/volkswagen.png" },
            { "marca": "Volvo", "urlLogo": "https://i.ibb.co/Z1VRgTm/volvo.png" }
          ]

        await Logos.insertMany(logosData);

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