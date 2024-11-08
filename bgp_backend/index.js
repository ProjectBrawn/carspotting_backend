const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db');
const usersRoutes = require('./routes/usersRoutes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/users', usersRoutes);

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});