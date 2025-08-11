const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// Imprimir todos os usuários
router.get('/', function (req, res) {
    db.query('SELECT * FROM users', function (err, results) {
        if (err) {
            console.error('Erro na query users:', err);
            return res.status(500).json({ error: 'Erro ao buscar usuários' });
        }
        res.json(results);
    });
});

// Criar novo usuário
const saltRounds = 10;
router.post('/', function (req, res) {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }
    bcrypt.hash(senha, saltRounds, function(err, hash) {
        if (err) {
            console.error('Erro ao criar hash da senha:', err);
            return res.status(500).json({ error: 'Erro interno' });
        }
        db.query(
          'INSERT INTO users (nome, email, senha, criado_em, atualizado_em) VALUES (?, ?, ?, NOW(), NOW())', 
          [nome, email, hash], 
          function (err, result) {
            if (err) {
              console.error('Erro ao criar usuário:', err);
              return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Usuário criado com sucesso', id: result.insertId });
        });
    });
});


// Atualizar usuário
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email, senha } = req.body;
    if (!nome && !email && !senha) {
        return res.status(400).json({ error: 'Informe ao menos um campo para atualizar.' });
    }
    let fields = [];
    let values = [];
    if (nome) { fields.push('nome = ?'); values.push(nome); }
    if (email) { fields.push('email = ?'); values.push(email); }
    if (senha) {
        // Atualiza senha criptografada
        const saltRounds = 10;
        bcrypt.hash(senha, saltRounds, function(err, hash) {
            if (err) {
                console.error('Erro ao criar hash da senha:', err);
                return res.status(500).json({ error: 'Erro interno' });
            }
            fields.push('senha = ?');
            values.push(hash);
            values.push(id);
            const sql = `UPDATE users SET ${fields.join(', ')}, atualizado_em = NOW() WHERE id = ?`;
            db.query(sql, values, (err, result) => {
                if (err) return res.status(500).json({ error: 'Erro ao atualizar usuário' });
                if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
                res.json({ message: 'Usuário atualizado com sucesso' });
            });
        });
        return;
    }
    values.push(id);
    const sql = `UPDATE users SET ${fields.join(', ')}, atualizado_em = NOW() WHERE id = ?`;
    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar usuário' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
        res.json({ message: 'Usuário atualizado com sucesso' });
    });
});

// Deletar usuário
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao deletar usuário' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
        res.json({ message: 'Usuário deletado com sucesso' });
    });
});

module.exports = router;