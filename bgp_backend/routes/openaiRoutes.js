const express = require('express');
const router = express.Router();
const Users = require('../modelos/users');
const Errors = require('../modelos/errors');
const { autenticarToken, SECRET_KEY } = require('../middleware/auth');
require('dotenv').config();
const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});

async function detectCarByUrl(url) {
  console.log("API Key:", process.env.OPENAI_API_KEY);
  console.log("denrto")
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        "role": "system",
        "content": "Eres un profesional de la detección y el reconocimiento de coches (cásicos, deportivos y utilitarios, en todas sus carrocerías y modalidades) y la respuesta sobre qué coche es siempre la das en formato {\"error\": false, \"detect\": {\"marca\": \"marca\", \"modelo\": \"modelo\", \"generacion\": \"generacion\", \"anyo\": \"anyo\"}}. Ojo, fíjate porque puede haber submodelos, eso lo tienes que añadir al modelo. La generación puede ser pues mk1, mk2, e92, e46, e30 como los bmw, pero dámela para cualquier coche. En caso que no sepas qué coche es devuelve: {\"error\": true, \"detect\": {}}. No me des un intervalo de años, dame simplemente un año."
      },
      {
        role: "user",
        content: [
          { type: "text", text: "¿Que coche es el de la imagen?" },
          {
            type: "image_url",
            image_url: {
              //  "url": "https://spots.ag/2021/07/30/ferrari-f40lm-c493730072021201906_1.jpg?1627669164",
              "url": url,
            },
          },
        ],
      },
    ],
  });
  console.log("algooo")
  console.log(completion)
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