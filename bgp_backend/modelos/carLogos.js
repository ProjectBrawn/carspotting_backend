const mongoose = require('mongoose');

const carLogoSchema = new mongoose.Schema({
    marca: {
        type: String,
        required: true
    },
    urlLogo: {
        type: String
    }
});

module.exports = mongoose.model('CarLogo', carLogoSchema);
