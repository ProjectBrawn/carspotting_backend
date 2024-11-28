const mongoose = require('mongoose');

// Modelo de Usuario
const userSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    apellidos: { 
        type: String, 
        required: true 
    },
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
        default: '' 
    },
    fotoPerfil: { 
        type: String, 
        default: 'default-profile.jpg' 
    },
    puntos_experiencia: { 
        type: Number, 
        default: 0 
    },
    garaje_principal: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coche',
        validate: {
            validator: function(v) {
                return v.length <= 5;
            },
            message: 'El garaje principal puede tener máximo 5 coches'
        }
    }],
    amigos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    seguidores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // sesion_activa: {
    //     type: Boolean,
    //     default: false
    // },
    // estado_cuenta: {
    //     type: String,
    //     enum: ['activa', 'suspendida', 'eliminada'],
    //     default: 'activa'
    // },
    fecha_creacion: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);