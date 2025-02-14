const mongoose = require('mongoose');

// Modelo de Reporte
const reportUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    usernameDestiny: {
        type: String,
        required: true
    },
    tipoReporte: {
        type: String,
        required: true,
        enum: ['wrong_car', 'inappropriate', 'spam', 'fraud', 'harassment', 'impersonation']
    },
    comentario: {
        type: String,
        default: null
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ReportUser', reportUserSchema);
