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
        default: '' 
    },
    fotoPerfil: { 
        type: String, 
        // default: 'https://i.etsystatic.com/35372836/r/il/70df1f/5861902788/il_fullxfull.5861902788_odt2.jpg' 
    },
    sexo: {
        type: String,
        required: true,
    },
    anyo_nacimiento: {
        type: String,
        required: true,
    },
    pais: {
        type: String,
        required: true,
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