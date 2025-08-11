const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// Tentativa de login
router.post('/', (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Erro na query de login:', err);
      return res.status(500).json({ error: 'Erro interno' });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos' });
    }
    const user = results[0];
    bcrypt.compare(senha, user.senha, (err, resultado) => {
      if (err) {
        console.error('Erro ao comparar senha:', err);
        return res.status(500).json({ error: 'Erro interno' });
      }
      if (!resultado) {
        return res.status(401).json({ error: 'Usuário ou senha incorretos' });
      }
      res.json({ message: 'Login realizado com sucesso', userId: user.id, nome: user.nome });
    });
  });
});

module.exports = router;