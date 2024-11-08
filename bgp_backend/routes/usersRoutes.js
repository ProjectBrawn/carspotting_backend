const express = require('express');
const router = express.Router();
const Users = require('../modelos/users');

router.get('/', async (req, res) => {
  const users = await Users.find();
  res.send(users);
});

router.get('/:username', async (req, res) => {
  const user = await Users.findById(req.params.username);
  res.send(user);
});

router.post('/', async (req, res) => {
    const user = new Users(req.body);
    await user.save();
    res.send('Usuario creado');
});



router.delete('/:username', async (req, res) => {
  await Users.findByIdAndDelete(req.params.username);
  res.send('Usuario eliminado');
});

module.exports = router;