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
const emailRoutes = require('./routes/emailRoutes');
const reportRoutes = require('./routes/reportRoutes');
const blockRoutes = require('./routes/blockRoutes');
const unblockRoutes = require('./routes/unblockRoutes');
const reportUserRoutes = require('./routes/reportUserRoutes');

//const carLogosRoutes = require('./routes/carLogosRoutes');


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
app.use('/email', emailRoutes);
app.use('/report', reportRoutes);
app.use('/reportUser', reportUserRoutes);
app.use('/blockUser', blockRoutes);
app.use('/unblockUser', unblockRoutes);

//app.use('/logos', carLogosRoutes);




