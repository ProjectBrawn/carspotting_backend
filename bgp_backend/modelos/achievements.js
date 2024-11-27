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
    puntos: {
        type: Number,
        default: 0
    },
    fecha_creacion: { 
        type: Date, default: Date.now 
    },
});

module.exports = mongoose.model('medallaSchema', medallaSchema);
