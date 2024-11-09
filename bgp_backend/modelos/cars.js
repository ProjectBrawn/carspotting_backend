const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    marca: {
        type: String,
        required: true
    },
    modelo: {
        type: String,
        required: true
    },
    generacion: {
        type: String,
        required: true
    },
    año: {
        type: Number,
        required: true
    },
    url_imagen: {
        type: String,
        required: false // Campo opcional
    },
    tipoCarroceria: {
        type: String,
        required: false // Campo opcional
    }
});

module.exports = mongoose.model('Car', carSchema);