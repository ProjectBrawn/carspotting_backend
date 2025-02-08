const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();
const { CarDay, CarDayIndex } = require('./modelos/daily_car');  // Importa los modelos de coches e índice


async function populateCars() {
    try {
        // Conexión a la base de datos (ajusta la URL según tu configuración)
        //Deployment
        //await mongoose.connect(process.env.CONNECTION_STRING);

        //Local
        await mongoose.connect('mongodb://127.0.0.1:27017/brawngpapp');

        // Datos de ejemplo para poblar la colección `cars`
        fs.readFile('carday.json', 'utf8', async (err, data) => {
            if (err) {
                console.error('Error al leer el archivo carday.json:', err);
                return;
            }

            // Convertir el contenido del archivo JSON a un objeto de JavaScript
            const carsData = JSON.parse(data);

            // Insertar los coches en la base de datos
            const result = await CarDay.insertMany(carsData);
        });

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
