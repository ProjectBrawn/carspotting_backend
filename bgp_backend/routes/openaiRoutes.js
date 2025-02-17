const express = require('express');
const router = express.Router();
const Users = require('../modelos/users');
const Errors = require('../modelos/errors');
const { autenticarToken, SECRET_KEY } = require('../middleware/auth');
require('dotenv').config();
const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});

async function detectCarByUrl(url) {

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        "role": "system",
        "content": "Eres un profesional de la detección y el reconocimiento de coches (cásicos, deportivos y utilitarios, en todas sus carrocerías y modalidades) y la respuesta sobre qué coche es siempre la das en formato {\"error\": false, \"detect\": {\"marca\": \"marca\", \"modelo\": \"modelo\", \"generacion\": \"generacion\", \"anyo\": \"anyo\", \"nacionalidad\": \"nacionalidad\"}}. Ojo, fíjate porque puede haber submodelos, eso lo tienes que añadir al modelo. La generación puede ser pues mk1, mk2, e92, e46, e30 como los bmw, pero dámela para cualquier coche. En caso que no sepas qué coche es devuelve: {\"error\": true, \"detect\": {}}. No me des un intervalo de años, dame simplemente un año, y si no lo sabes, pon 'Desconocido'. pero no te lo inventes. La nacionalidad se refiere a de donde es originario el coche y me tienes que dar un pais, en caso que no lo sepas, pon 'Desconocido'. Si la generacion no la sabes, pon 'Desconocida', no te la inventes. \n Es importante que no me devuelvas en ningun campo caracteres especiales, es decir, las marcas o modelos que contengan dieresis, tildes, etc, me las devuelves sin ellas, como Citroën, me lo devuelves como Citroen."
      },
      {
        role: "user",
        content: [
          { type: "text", text: "¿Que coche es el de la imagen?" },
          {
            type: "image_url",
            image_url: {
              //"url": "https://www.citroen.es/content/dam/citroen/master/b2c/models/new-%C3%AB-berlingo---berlingo/s/%C3%8BBerlingo-HeroBanner-750x936.jpg",
              //"url": "https://spots.ag/2021/07/30/ferrari-f40lm-c493730072021201906_1.jpg?1627669164",
              "url": url,
            },
          },
        ],
      },
    ],
  });
  return completion.choices[0].message.content;
}

router.post('/', autenticarToken, async (req, res) => {
  const { url } = req.body;
  try {
    const result = await detectCarByUrl(url);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error });
  }

});

router.post('/errors', autenticarToken, async (req, res) => {
  const { url, username } = req.body;
  try {
    //Lo subimos a la base de datos de errors
    const error = new Errors({ url, username });
    await error.save();
    res.status(200).json({ error });
  } catch (error) {
    res.status(500).json({ error });
  }
});


module.exports = router;