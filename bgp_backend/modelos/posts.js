const mongoose = require('mongoose');

// Modelo de Coche
const postSchema = new mongoose.Schema({
    marca: { 
        type: String, 
        required: true 
    },
    modelo: { 
        type: String, 
        required: true 
    },
    anyo: { 
        type: String, 
        required: true 
    },
    generacion: { 
        type: String ,
        required: true
    },
    nacionalidad: {
        type: String,    
        required: true
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
    imagen: { 
        type: String, 
        required: true 
    },
    username: {
        type: String,
        required: true
    },
    medallas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medalla'
    }],
    comentarios: [{
        usuario: {
            type: String,
            required: true
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
    },
    urlLogo: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('Post', postSchema);