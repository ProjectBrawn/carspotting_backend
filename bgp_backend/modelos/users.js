const mongoose = require('mongoose');

// Modelo de Usuario
const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    descripcion: { 
        type: String, 
        default: 'Apasionado del motor usando GTSpotters!' 
    },
    fotoPerfil: { 
        type: String, 
        default: 'https://i.ibb.co/TxGYdq50/profile-Pic.webp' 
    },
    sexo: {
        type: String,
        required: false,
    },
    anyo_nacimiento: {
        type: String,
        required: false,
    },
    pais: {
        type: String,
        required: false,
    },
    puntos_experiencia: { 
        type: Number, 
        default: 0 
    },
    garaje_principal: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coche'
        }],
        validate: {
            validator: function(v) {
                return v.length <= 5; // Valida el tamanyo del array completo
            },
            message: 'El garaje principal puede tener máximo 5 coches'
        }
    },    
    spots: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coche'
        }]
    },    
    siguiendo: [{
        type: String,
    }],
    seguidores: [{
        type: String,
    }],
    bloqueados: [{
        type: String,
    }],
    sesion_activa: {
        type: Boolean,
        default: false
    },
    // estado_cuenta: {
    //     type: String,
    //     enum: ['activa', 'suspendida', 'eliminada'],
    //     default: 'activa'
    // },
    fecha_creacion: {
        type: Date,
        default: Date.now
    },
    origin: {
        type: String,
        default: 'app'
    }
});

module.exports = mongoose.model('User', userSchema);