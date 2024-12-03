const mongoose = require('mongoose');

// Modelo de Coche
const carSchema = new mongoose.Schema({
    marca: { 
        type: String, 
        required: true 
    },
    modelo: { 
        type: String, 
        required: true 
    },
    año: { 
        type: Number, 
        required: true 
    },
    generacion: { 
        type: String 
    },
    ubicacion: {
        latitud: Number,
        longitud: Number,
        direccion: String
    },
    descripcion: { 
        type: String, 
        default: '' 
    },
    openai_pid: { // creo que se refiere a un id artificail sinmas, pero se lo ha puesto asi
        type: String 
    },
    imagen: { 
        type: String, 
        required: true 
    },
    usuario_captura: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    usuario_imagen: {
        type: String,
        ref: 'User',
        required: true
    },
    usuario_name: {
        type: String,
        ref: 'User',
        required: true
    },
    medallas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medalla'
    }],
    comentarios: [{
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        texto: String,
        fecha: {
            type: Date,
            default: Date.now
        }
    }],
    fecha_captura: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Car', carSchema);