const mongoose = require('mongoose');

const denunciaSchema = new mongoose.Schema({
    coche: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coche',
        required: true
    },
    usuario_denuncia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    razon: {
        type: String,
        enum: ['contenido_inapropiado', 'coche_falso', 'captura_pantalla'],
        required: true
    },
    descripcion: { 
        type: String 
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: String,
        enum: ['pendiente', 'revisado', 'resuelto'],
        default: 'pendiente'
    }
});

module.exports = mongoose.model('complaintSchema', complaintSchema);
