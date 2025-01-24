const mongoose = require('mongoose');
require('dotenv').config();


//DEPLOYMENT
mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((error) => console.error('Error al conectar a MongoDB', error));

//LOCAL
// mongoose.connect(process.env.CONNECTION_STRING_LOCAL)
//   .then(() => console.log('Conectado a MongoDB'))
//   .catch((error) => console.error('Error al conectar a MongoDB', error));