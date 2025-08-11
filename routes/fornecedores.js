const express = require('express');
const router = express.Router();
const db = require('../db');

// listar
router.get('/', (req, res) => {
  db.query('SELECT * FROM fornecedores', (err, results) => {
    if (err) { console.error(err); return res.status(500).json({ error: 'Erro ao buscar fornecedores' }); }
    res.json(results);
  });
});

// buscar
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM fornecedores WHERE id = ?', [req.params.id], (err, results) => {
    if (err) { console.error(err); return res.status(500).json({ error: 'Erro ao buscar fornecedor' }); }
    if (!results.length) return res.status(404).json({ error: 'Fornecedor não encontrado' });
    res.json(results[0]);
  });
});

// criar
router.post('/', (req, res) => {
  const { cnpj, nome, contato } = req.body;
  if (!cnpj || !nome) return res.status(400).json({ error: 'cnpj e nome são obrigatórios' });

  db.query('INSERT INTO fornecedores (cnpj, nome, contato, criado_em) VALUES (?, ?, ?, NOW())', [cnpj, nome, contato || null], (err, result) => {
    if (err) { console.error(err); return res.status(500).json({ error: 'Erro ao criar fornecedor' }); }
    res.status(201).json({ id: result.insertId, cnpj, nome });
  });
});

// atualizar
router.put('/:id', (req, res) => {
  const { cnpj, nome, contato } = req.body;
  db.query('UPDATE fornecedores SET cnpj = ?, nome = ?, contato = ?, atualizado_em = NOW() WHERE id = ?', [cnpj, nome, contato, req.params.id], (err, result) => {
    if (err) { console.error(err); return res.status(500).json({ error: 'Erro ao atualizar fornecedor' }); }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Fornecedor não encontrado' });
    res.json({ message: 'Fornecedor atualizado' });
  });
});

// deletar
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM fornecedores WHERE id = ?', [req.params.id], (err, result) => {
    if (err) { console.error(err); return res.status(500).json({ error: 'Erro ao deletar fornecedor' }); }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Fornecedor não encontrado' });
    res.json({ message: 'Fornecedor deletado' });
  });
});

module.exports = router;
