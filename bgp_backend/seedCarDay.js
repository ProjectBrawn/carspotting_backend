const mongoose = require('mongoose');
const { CarDay, CarDayIndex } = require('./modelos/daily_car');  // Importa los modelos de coches e índice


async function populateCars() {
    try {
        // Conexión a la base de datos (ajusta la URL según tu configuración)
        await mongoose.connect('mongodb://127.0.0.1:27017/brawngpapp', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Datos de ejemplo para poblar la colección `cars`
        const carsData = [
            { name: 'Toyota Supra', image: 'https://i.pinimg.com/736x/a0/f8/7f/a0f87f057abecfc7071b56a26cd398aa.jpg' },
            { name: 'Ford Mustang', image: 'https://spots.ag/2019/11/09/ford-mustang-gt-2018-c949009112019160350_1.jpg' },
            { name: 'Chevrolet Camaro', image: 'https://spots.ag/2024/08/15/thumbs/chevrolet-camaro-zl1-32a43-c368815082024082015_1.jpg?1723702834' },
            { name: 'Nissan GT-R', image: 'https://cdn.motor1.com/images/mgl/JJkj4/s1/nissan-gt-r-t-spec.jpg' },
            { name: 'Porsche 911', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYXtXga3tJIPE90eDuu1oGoE7kFGq2ul5Qdg&s' },
            { name: 'Audi R8', image: 'https://spots.ag/2024/11/27/audi-r8-v10-spyder-aca00-c664627112024054722_1.jpg' },
            { name: 'BMW M3', image: 'https://cdn.bmwblog.com/wp-content/uploads/2024/05/2025-bmw-m3-touring-facelift-02.jpg' },
            { name: 'Mercedes-Benz AMG GT', image: 'https://i.redd.it/spotted-a-mercedes-amg-gt-r-in-its-legendary-green-v0-13hcpdenc4jb1.jpg?width=2750&format=pjpg&auto=webp&s=e4531ac63247f57313478e2b80881f04770f4af5' },
            { name: 'Lamborghini Aventador', image: 'https://spots.ag/2022/06/27/lamborghini-aventador-lp750-4-superveloce-roadster-c666027062022145347_1.jpg?1656334441' },
            { name: 'Ferrari 488', image: 'https://i.redd.it/spotted-a-ferrari-488-pista-with-the-extremely-rare-specc-v0-xcf7hh5tbtx91.jpg?width=4032&format=pjpg&auto=webp&s=d25628c5f07b16f8f5adfdb45b3df10b474972cb' }
        ];

        // Insertar los coches en la base de datos
        const result = await CarDay.insertMany(carsData);

        // Si no existe, crear el índice global
        const existingIndex = await CarDayIndex.findOne();
        if (!existingIndex) {
            const index = new CarDayIndex({ carIndex: 0 });
            await index.save();
        }
        console.log("carDay poblado con exito")
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error al poblar la colección de coches:', error);
    } finally {
        await mongoose.connection.close();
    }
}

populateCars();
