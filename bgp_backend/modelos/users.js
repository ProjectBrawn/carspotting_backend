const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    email: String,
    password: String,
    biografia: String,
    foto: String,
    username: String,
});

module.exports = mongoose.model('users', usersSchema);