const express = require('express');
const router = express.Router();
const db = require('../db');

// listar compras
router.get('/', (req, res) => {
  db.query('SELECT * FROM compras', (err, results) => {
    if (err) { console.error(err); return res.status(500).json({ error: 'Erro ao buscar compras' }); }
    res.json(results);
  });
});

// buscar por id
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM compras WHERE id = ?', [req.params.id], (err, results) => {
    if (err) { console.error(err); return res.status(500).json({ error: 'Erro ao buscar compra' }); }
    if (!results.length) return res.status(404).json({ error: 'Compra não encontrada' });
    res.json(results[0]);
  });
});

// criar compra simples (sem itens) — idealmente você criaria compra + itens em transação
router.post('/', (req, res) => {
  const { fornecedor_id, total, status_compra } = req.body;
  if (!fornecedor_id) return res.status(400).json({ error: 'fornecedor_id é obrigatório' });

  db.query('INSERT INTO compras (fornecedor_id, data_compra, total, status_compra, criado_em) VALUES (?, NOW(), ?, ?, NOW())', [fornecedor_id, total || 0, status_compra || 'pendente'], (err, result) => {
    if (err) { console.error(err); return res.status(500).json({ error: 'Erro ao criar compra' }); }
    res.status(201).json({ id: result.insertId });
  });
});

// atualizar compra
router.put('/:id', (req, res) => {
  const { fornecedor_id, total, status_compra } = req.body;
  db.query('UPDATE compras SET fornecedor_id = ?, total = ?, status_compra = ?, atualizado_em = NOW() WHERE id = ?', [fornecedor_id, total, status_compra, req.params.id], (err, result) => {
    if (err) { console.error(err); return res.status(500).json({ error: 'Erro ao atualizar compra' }); }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Compra não encontrada' });
    res.json({ message: 'Compra atualizada' });
  });
});

// deletar compra
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM compras WHERE id = ?', [req.params.id], (err, result) => {
    if (err) { console.error(err); return res.status(500).json({ error: 'Erro ao deletar compra' }); }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Compra não encontrada' });
    res.json({ message: 'Compra deletada' });
  });
});

module.exports = router;