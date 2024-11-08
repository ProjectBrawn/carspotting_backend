// middlewares/auth.js
const jwt = require('jsonwebtoken');
const Token = require('../modelos/token');
const SECRET_KEY = 'pruebas';

async function autenticarToken(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).send('Acceso denegado. Token no proporcionado.');
  }

  try {
    // Verifica que el token esté en la base de datos
    const tokenDoc = await Token.findOne({ token });
    if (!tokenDoc) {
      return res.status(401).send('Token inválido o no autorizado.');
    }

    // Decodifica el token JWT
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Agrega el usuario decodificado a la solicitud
    next(); // Pasa al siguiente middleware o ruta
  } catch (error) {
    res.status(400).send('Token inválido.');
  }
}

module.exports = { autenticarToken };
