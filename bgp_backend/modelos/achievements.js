const mongoose = require('mongoose');

const medallaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String
    },
    icono: {
        type: String
    },
    fecha_creacion: { 
        type: Date, default: Date.now 
    },
});

module.exports = mongoose.model('Medalla', medallaSchema);
