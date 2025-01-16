const Posts = require('../modelos/achievements');
const Medalla = require('../modelos/achievements');
const { CarDay } = require('../modelos/daily_car');

const axios = require('axios');

async function obtenerCocheDelDia() {
    try {
        // Obtén la fecha actual en formato YYYY-MM-DD
        const currentDate = new Date().toISOString().split('T')[0];

        // Obtén el número total de coches
        const totalCars = await CarDay.countDocuments();

        if (totalCars === 0) {
            return null; // Si no hay coches, retorna null
        }

        // Calcula el índice del coche basado en la fecha
        const carIndex = Math.abs(currentDate.split('-').join('')) % totalCars;

        // Encuentra el coche correspondiente al índice
        const carOfTheDay = await CarDay.findOne().skip(carIndex);

        if (carOfTheDay) {
            return carOfTheDay; // Retorna el coche del día
        } else {
            return null; // Si no se encuentra, retorna null
        }
    } catch (error) {
        console.error('Error al obtener el coche del día:', error);
        return null;
    }
}


async function asignarMedallas(coche) {
    const medallas = [];
    const cocheDelDia = await obtenerCocheDelDia(); // Obtener el coche del día

    // Comprobamos si el coche del día coincide con el coche publicado (marca y modelo)
    // Comprobamos si el nombre del coche del día está contenido en la concatenación de coche.marca + coche.modelo
    const eyyy = (`${coche.marca.toLowerCase()} ${coche.modelo.toLowerCase()}`.trim().includes(cocheDelDia?.name?.toLowerCase().trim()))
    console.log('eyyy');
    console.log(eyyy);
    console.log("coches, normal y del dia");
    console.log(`${coche.marca.toLowerCase()} ${coche.modelo.toLowerCase()}`.trim())
    console.log(cocheDelDia?.name?.toLowerCase().trim())
    if (`${coche.marca.toLowerCase()} ${coche.modelo.toLowerCase()}`.trim().includes(cocheDelDia?.name?.toLowerCase().trim()))        {
        const medallaCocheDelDia = await Medalla.findOne({ nombre: 'Car of the Day' });
        if (medallaCocheDelDia) {
            medallas.push(medallaCocheDelDia._id);
        }
    }


    // Medalla: Holly Trinity (McLaren P1, Porsche 918, LaFerrari)
    const trinityModels = ['mclaren p1', 'porsche 918', 'la ferrari'];
    if (trinityModels.includes(coche.marca.toLowerCase() + " " + coche.modelo.toLowerCase())) {
        const hollyTrinity = await Medalla.findOne({ nombre: 'Holly Trinity' });
        if (hollyTrinity) medallas.push(hollyTrinity._id);
    }

    // Medalla: American Icon (Modelos de coches americanos)
    const americanIcons = ['mustang', 'camaro', 'challenger', 'bronco', 'corvette', 'f-150', 'belair', 'vipper', 'impala', 'ford gt'];
    if (americanIcons.includes(coche.modelo.toLowerCase())) {
        const americanIcon = await Medalla.findOne({ nombre: 'American Icon' });
        if (americanIcon) medallas.push(americanIcon._id);
    }

    // Medalla: JDM Empire (Modelos JDM)
    const jdmEmpire = ['rx7', 'rx8', 'supra', 'r34', 'r33', '2000gt', 'mx5'];
    if (jdmEmpire.includes(coche.modelo.toLowerCase())) {
        const jdmMedal = await Medalla.findOne({ nombre: 'JDM Empire' });
        if (jdmMedal) medallas.push(jdmMedal._id);
    }

    // Medalla: Swedish Host (Marca Koenigsegg)
    if (coche.marca.toLowerCase() === 'koenigsegg') {
        const swedishHost = await Medalla.findOne({ nombre: 'Swedish Host' });
        if (swedishHost) medallas.push(swedishHost._id);
    }

    // Medalla: Neck Breaker (Modelos de coches de alto rendimiento)
    const neckBreakerModels = [
        '488', 'huracán', '720s', '911', 'r8', 'amg gt', 'gt-r', 'corvette', 'f-type', 'm4', 'm2', 'rs5', 'rs3',
        'cayman', 'boxster', 'tt', 'z4', 'giulia', 'rc f', 'is', 'q60', 's3', 's4', 's5', 'elise', 'exige', 'evora',
        'a110', 'granturismo', 'db11', 'vantage', 'sf90', 'roma', 'portofino', 'f8', 'aventador', 'urus', 'bentayga',
        'flying spur', 'continental gt', 'cullinan', 'phantom', 'ghost', 'wraith', 'dawn', 'm850i', '8 series', 'z8',
        '7 series', 'x6', 'x5', 'x7', 'i8', 'm5', 'm6', '718', 'pista', '570s', '600lt', 'dbs', 'vantage roadster',
        'granturismo mc', 'gtc4lusso', 'panamera', 'taycan', 'cayenne', 'maca'
    ];
    if (neckBreakerModels.includes(coche.modelo.toLowerCase())) {
        const neckBreaker = await Medalla.findOne({ nombre: 'Neck Breaker' });
        if (neckBreaker) medallas.push(neckBreaker._id);
    }

    // Medalla: Martini Vodka (Aston Martin)
    if (coche.marca.toLowerCase() === 'aston martin') {
        const martiniVodka = await Medalla.findOne({ nombre: 'Martini Vodka' });
        if (martiniVodka) medallas.push(martiniVodka._id);
    }

    // Medalla: No Path Needed (Modelos de vehículos todoterreno)
    const noPathNeeded = [
        'land rover defender', 'land rover range rover', 'land rover discovery', 'jeep wrangler', 'jeep grand cherokee',
        'toyota land cruiser', 'toyota 4runner', 'toyota hilux', 'ford bronco', 'ford f-150 raptor', 'ford ranger',
        'mercedes-benz g-class', 'mercedes-benz g-wagon', 'mitsubishi pajero', 'mitsubishi montero', 'nissan patrol',
        'nissan frontier', 'nissan navara', 'suzuki jimny', 'suzuki vitara', 'bmw x5', 'bmw x6', 'bmw x7', 'audi q7',
        'audi q8', 'audi sq5', 'ram 1500', 'ram 2500', 'ram power wagon', 'subaru outback', 'subaru forester',
        'subaru crosstrek', 'honda passport', 'honda pilot', 'lexus gx', 'lexus lx', 'chevrolet tahoe', 'chevrolet silverado',
        'chevrolet colorado', 'volkswagen amarok', 'volkswagen touareg', 'isuzu d-max', 'isuzu mu-x', 'kia sorento',
        'kia sportage', 'dodge ram 1500', 'dodge ram 2500', 'hummer h1', 'hummer h2', 'hummer h3', 'peugeot 3008',
        'peugeot 5008', 'renault koleos', 'renault alaskan', 'tata safari', 'tata harrier', 'mahindra thar', 'mahindra scorpio',
        'gmc sierra', 'gmc canyon', 'gmc yukon'
    ];
    if (noPathNeeded.includes(coche.marca.toLowerCase() + " " + coche.modelo.toLowerCase())) {
        const noPathMedal = await Medalla.findOne({ nombre: 'No Path Needed' });
        if (noPathMedal) medallas.push(noPathMedal._id);
    }

    // Medalla: Washing Machine (Tesla)
    if (coche.marca.toLowerCase() === 'tesla') {
        const washingMachine = await Medalla.findOne({ nombre: 'Washing Machine' });
        if (washingMachine) medallas.push(washingMachine._id);
    }

    // Medalla: Silent Luxury (Rolls Royce, Bentley, Mercedes Maybach)
    const silentLuxuryBrands = ['rolls royce', 'bentley', 'maybach'];
    if (silentLuxuryBrands.includes(coche.marca.toLowerCase())) {
        const silentLuxury = await Medalla.findOne({ nombre: 'Silent Luxury' });
        if (silentLuxury) medallas.push(silentLuxury._id);
    }

    // Medalla: Everyone's Favorite (911 GT3RS)
    if (coche.marca.toLowerCase() === 'porsche' && coche.modelo.toLowerCase() === '911 gt3rs') {
        const favoriteMedal = await Medalla.findOne({ nombre: 'Everyones Favorite' });
        if (favoriteMedal) medallas.push(favoriteMedal._id);
    }

    // Medalla: Ferrari Repoker (Ferrari F40, LaFerrari, Enzo, 288 GTO, F50)
    const ferrariRepokerModels = ['f40', 'laferrari', 'enzo', '288 gto', 'f50'];
    if (ferrariRepokerModels.includes(coche.modelo.toLowerCase())) {
        const ferrariRepoker = await Medalla.findOne({ nombre: 'Ferrari Repoker' });
        if (ferrariRepoker) medallas.push(ferrariRepoker._id);
    }

    // Medalla: German Engineer (Mercedes, BMW, Audi)
    const germanEngineers = ['mercedes', 'bmw', 'audi'];
    if (germanEngineers.includes(coche.marca.toLowerCase())) {
        const germanEngineer = await Medalla.findOne({ nombre: 'German Engineer' });
        if (germanEngineer) medallas.push(germanEngineer._id);
    }

    console.log('medallas');
    console.log(medallas);


    return medallas;

}



module.exports = {
    asignarMedallas
};

