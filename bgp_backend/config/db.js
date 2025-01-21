const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/brawngpapp')
  .then(() => console.log('Conectado a MongoDB'))
  .catch((error) => console.error('Error al conectar a MongoDB', error));