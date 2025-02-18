// modelos/errors.js
const mongoose = require('mongoose');

const errorsSchema = new mongoose.Schema({
    username: { type: String, required: true },
    url: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Errors', errorsSchema);