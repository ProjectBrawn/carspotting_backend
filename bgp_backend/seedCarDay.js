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
            { name: 'Toyota Supra', image: 'https://example.com/toyota-supra.jpg' },
            { name: 'Ford Mustang', image: 'https://example.com/ford-mustang.jpg' },
            { name: 'Chevrolet Camaro', image: 'https://example.com/chevrolet-camaro.jpg' },
            { name: 'Nissan GT-R', image: 'https://example.com/nissan-gtr.jpg' },
            { name: 'Porsche 911', image: 'https://example.com/porsche-911.jpg' },
            { name: 'Audi R8', image: 'https://example.com/audi-r8.jpg' },
            { name: 'BMW M3', image: 'https://example.com/bmw-m3.jpg' },
            { name: 'Mercedes-Benz AMG GT', image: 'https://example.com/mercedes-amg-gt.jpg' },
            { name: 'Lamborghini Aventador', image: 'https://example.com/lamborghini-aventador.jpg' },
            { name: 'Ferrari 488', image: 'https://example.com/ferrari-488.jpg' }
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
