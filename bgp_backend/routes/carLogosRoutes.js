const Logos = require('../modelos/carLogos');
const express = require('express');
const { autenticarToken } = require('../middleware/auth');

const router = express.Router();

// Obtiene todas los logos 
router.get('/', autenticarToken, async (req, res) => {
    console.log("Recupero todos logos")
        try {

        const logos = await Logos.find();
        res.status(200).send(logos);
    } catch (error) {
        console.error('Error al obtener los logos:', error);
        res.status(500).send({ error: 'Error al obtener los logos' });
    }
});


router.get('/:marca', autenticarToken, async (req, res) => {
    console.log("Recupero logo de marca");
    let marca = req.params.marca;

    // Normalizamos el parámetro y si viene un - le ponemos un espacio
    marca = marca.replace(/-/g, ' ');
    
    try {
        // Buscamos documentos donde el campo 'marca' contenga el parámetro o el parámetro contenga la marca
        const logo = await Logos.findOne({
            $or: [
                { marca: { $regex: '.*' + marca + '.*', $options: 'i' } },  
                { marca: { $regex: marca, $options: 'i' } }                   
            ]
        });

        if (logo == null) {
            res.status(404).send({ error: 'No se ha encontrado el logo' });
            return;
        }

        res.status(200).send({ "url": logo["urlLogo"] });
    } catch (error) {
        console.error('Error al obtener la url del logo:', error);
        res.status(500).send({ error: 'Error al obtener la url del logo' });
    }
});


module.exports = router;


