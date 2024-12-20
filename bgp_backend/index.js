const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db');
const usersRoutes = require('./routes/usersRoutes');
const postsRoutes = require('./routes/postsRoutes');
const feedRoutes = require('./routes/feedRoutes');
const carDayRoutes = require('./routes/carDayRoutes');
const garajeRoutes = require('./routes/garajeRoutes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/users', usersRoutes);
app.use('/posts', postsRoutes);
// app.use('/postCars', postsRoutes);
app.use('/feed', feedRoutes);
app.use('/carDay', carDayRoutes);
app.use('/garaje', garajeRoutes);



app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});