const mongoose = require('mongoose');


const cocheDiaSchema = new mongoose.Schema({
    coche: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coche',
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now,
        unique: true
    },
    puntos_extra: {
        type: Number,
        default: 5
    }
});

module.exports = mongoose.model('cocheDiaSchema', cocheDiaSchema);
