const express = require('express');
const router = express.Router();
const db = require('../db');

// listar vendas
router.get('/', (req, res) => {
  db.query('SELECT * FROM vendas', (err, results) => {
    if (err) { console.error(err); return res.status(500).json({ error: 'Erro ao buscar vendas' }); }
    res.json(results);
  });
});

// buscar venda
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM vendas WHERE id = ?', [req.params.id], (err, results) => {
    if (err) { console.error(err); return res.status(500).json({ error: 'Erro ao buscar venda' }); }
    if (!results.length) return res.status(404).json({ error: 'Venda não encontrada' });
    res.json(results[0]);
  });
});

// criar venda simples (sem itens)
router.post('/', (req, res) => {
  const { usuario_id, valor_total, status_venda } = req.body;
  if (!usuario_id) return res.status(400).json({ error: 'usuario_id é obrigatório' });

  db.query('INSERT INTO vendas (usuario_id, data_venda, valor_total, status_venda, criado_em) VALUES (?, NOW(), ?, ?, NOW())', [usuario_id, valor_total || 0, status_venda || 'pendente'], (err, result) => {
    if (err) { console.error(err); return res.status(500).json({ error: 'Erro ao criar venda' }); }
    res.status(201).json({ id: result.insertId });
  });
});

// atualizar venda
router.put('/:id', (req, res) => {
  const { usuario_id, valor_total, status_venda } = req.body;
  db.query('UPDATE vendas SET usuario_id = ?, valor_total = ?, status_venda = ?, atualizado_em = NOW() WHERE id = ?', [usuario_id, valor_total, status_venda, req.params.id], (err, result) => {
    if (err) { console.error(err); return res.status(500).json({ error: 'Erro ao atualizar venda' }); }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Venda não encontrada' });
    res.json({ message: 'Venda atualizada' });
  });
});

// deletar venda
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM vendas WHERE id = ?', [req.params.id], (err, result) => {
    if (err) { console.error(err); return res.status(500).json({ error: 'Erro ao deletar venda' }); }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Venda não encontrada' });
    res.json({ message: 'Venda deletada' });
  });
});

module.exports = router;