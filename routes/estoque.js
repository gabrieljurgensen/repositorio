// routes/estoque.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// listar todo estoque
router.get('/', (req, res) => {
  db.query('SELECT * FROM estoque', (err, results) => {
    if (err) { console.error(err); return res.status(500).json({ error: 'Erro ao buscar estoque' }); }
    res.json(results);
  });
});

// buscar por produto_id
router.get('/:produto_id', (req, res) => {
  db.query('SELECT * FROM estoque WHERE produto_id = ?', [req.params.produto_id], (err, results) => {
    if (err) { console.error(err); return res.status(500).json({ error: 'Erro ao buscar estoque' }); }
    if (!results.length) return res.status(404).json({ error: 'Registro de estoque não encontrado' });
    res.json(results[0]);
  });
});

// criar/registrar estoque (inserção inicial)
router.post('/', (req, res) => {
  const { produto_id, qtd } = req.body;
  if (produto_id === undefined || qtd === undefined) return res.status(400).json({ error: 'produto_id e qtd obrigatórios' });

  db.query('INSERT INTO estoque (produto_id, qtd, data_atualizacao, criado_em) VALUES (?, ?, NOW(), NOW())', [produto_id, qtd], (err, result) => {
    if (err) { console.error(err); return res.status(500).json({ error: 'Erro ao criar registro de estoque' }); }
    res.status(201).json({ message: 'Estoque criado', produto_id });
  });
});

// atualizar quantidade
router.put('/:produto_id', (req, res) => {
  const { qtd } = req.body;
  if (qtd === undefined) return res.status(400).json({ error: 'qtd é obrigatória' });

  db.query('UPDATE estoque SET qtd = ?, data_atualizacao = NOW(), atualizado_em = NOW() WHERE produto_id = ?', [qtd, req.params.produto_id], (err, result) => {
    if (err) { console.error(err); return res.status(500).json({ error: 'Erro ao atualizar estoque' }); }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Registro de estoque não encontrado' });
    res.json({ message: 'Estoque atualizado' });
  });
});

// deletar registro de estoque
router.delete('/:produto_id', (req, res) => {
  db.query('DELETE FROM estoque WHERE produto_id = ?', [req.params.produto_id], (err, result) => {
    if (err) { console.error(err); return res.status(500).json({ error: 'Erro ao deletar estoque' }); }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Registro de estoque não encontrado' });
    res.json({ message: 'Registro de estoque deletado' });
  });
});

module.exports = router;
