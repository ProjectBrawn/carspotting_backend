// modelos/codigosVerificacion.js
const mongoose = require('mongoose');

const VerificationCodesSchema = new mongoose.Schema({
    email: { type: String, required: true },
    code: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

// Agregar un método de instancia para verificar si el código ha expirado
VerificationCodesSchema.methods.isExpired = function() {
  const expirationTime = 5 * 60 * 1000; // 5 minutos en milisegundos
  return Date.now() - this.createdAt > expirationTime;
};

module.exports = mongoose.model('VerificationCodes', VerificationCodesSchema);  