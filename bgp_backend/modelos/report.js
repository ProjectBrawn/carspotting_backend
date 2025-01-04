const mongoose = require('mongoose');

// Modelo de Reporte
const reportSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    carId: { 
        type: String, 
        required: true 
    },
    tipoReporte: { 
        type: String, 
        required: true, 
        enum: ['wrong_car', 'inappropriate'] // Ejemplo de tipos de reporte
    },
    contenido: { 
        type: String, 
        default: null 
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Report', reportSchema);
