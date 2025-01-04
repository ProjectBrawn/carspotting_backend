const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db');
const usersRoutes = require('./routes/usersRoutes');
const postsRoutes = require('./routes/postsRoutes');
const feedRoutes = require('./routes/feedRoutes');
const carDayRoutes = require('./routes/carDayRoutes');
const filterRoutes = require('./routes/filterRoutes');
const filterUsersRoutes = require('./routes/filterUsersRoutes');
const medalsRoutes = require('./routes/medalsRoutes');
const garajeRoutes = require('./routes/garajeRoutes');
const openaiRoutes = require('./routes/openaiRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const reportRoutes = require('./routes/reportRoutes');


const app = express();

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/users', usersRoutes);
app.use('/posts', postsRoutes);
app.use('/filtrar', filterRoutes);
app.use('/filtrarUsuarios', filterUsersRoutes);
app.use('/feed', feedRoutes);
app.use('/carDay', carDayRoutes);
app.use('/medallas', medalsRoutes);
app.use('/garaje', garajeRoutes);
app.use('/detectCar', openaiRoutes);
app.use('/password', passwordRoutes);
app.use('/report', reportRoutes);




