const express = require('express');
const router = express.Router();
const db = require('../db');
const swaggerJSDoc = require('swagger-jsdoc');

// listar todas
router.get('/', (req, res) => {
  db.query('SELECT * FROM categoria', (err, results) => {
    if (err) { console.error(err); return res.status(500).json({ error: 'Erro ao buscar categoria' }); }
    res.json(results);
  });
});

// buscar por id
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM categoria WHERE id = ?', [req.params.id], (err, results) => {
    if (err) { console.error(err); return res.status(500).json({ error: 'Erro ao buscar categoria' }); }
    if (!results.length) return res.status(404).json({ error: 'Categoria não encontrada' });
    res.json(results[0]);
  });
});

// criar
router.post('/', (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: 'nome é obrigatório' });

  db.query('INSERT INTO categoria (nome, criado_em) VALUES (?, NOW())', [nome], (err, result) => {
    if (err) { console.error(err); return res.status(500).json({ error: 'Erro ao criar categoria' }); }
    res.status(201).json({ id: result.insertId, nome });
  });
});

// atualizar
router.put('/:id', (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: 'nome é obrigatório' });

  db.query('UPDATE categoria SET nome = ?, atualizado_em = NOW() WHERE id = ?', [nome, req.params.id], (err, result) => {
    if (err) { console.error(err); return res.status(500).json({ error: 'Erro ao atualizar categoria' }); }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Categoria não encontrada' });
    res.json({ message: 'Categoria atualizada' });
  });
});

// deletar
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM categoria WHERE id = ?', [req.params.id], (err, result) => {
    if (err) { console.error(err); return res.status(500).json({ error: 'Erro ao deletar categoria' }); }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Categoria não encontrada' });
    res.json({ message: 'Categoria deletada' });
  });
});

module.exports = router;