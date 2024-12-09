const mongoose = require('mongoose');

const carDay = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

const CarDay = mongoose.model('CarDay', carDay);

// Crear un índice global que solo usaremos para guardar el índice del coche del día
const carDayIndex = new mongoose.Schema({
  carIndex: {
    type: Number,
    default: 0,  // El primer coche será el coche del día inicial
    required: true
  }
});

const CarDayIndex = mongoose.model('CarDayIndex', carDayIndex);

module.exports = { CarDay, CarDayIndex };
