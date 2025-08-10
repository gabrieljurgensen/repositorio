
const express = require('express');
const router = express.Router();
const db = require('../db');

// Imprimir todos os produtos
router.get('/', function (req, res) {
    db.query('SELECT * FROM produto', function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao buscar produtos' });
        }
        res.json(results);
    });
});

// Atualizar um produto
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nome, preco_pago, descricao } = req.body;
    const sql = 'UPDATE produto SET nome = ?, preco_pago = ?, descricao = ? WHERE id = ?';
    db.query(sql, [nome, preco_pago, descricao, id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar produto' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Produto não encontrado' });
        res.json({ message: 'Produto atualizado com sucesso' });
    });
});

// Excluir um produto
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM produto WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao excluir produto' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Produto não encontrado' });
        res.json({ message: 'Produto excluído com sucesso' });
    });
});

// Cadastro de novos produtos
router.post('/', function (req, res) {
    const { nome, preco_pago, descricao, preco_vendido, id_categoria, status } = req.body;
    if (!nome || preco_pago === undefined || !id_categoria || status === undefined) {
        return res.status(400).json({ error: 'nome, preco_pago, id_categoria e status são obrigatórios' });
    }
    db.query(
        `INSERT INTO produto 
        (nome, preco_pago, descricao, preco_vendido, id_categoria, status, criado_em, atualizado_em) 
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [nome, preco_pago, descricao || '', preco_vendido || preco_pago, id_categoria, status],
        function (err, result) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao criar produto' });
            }
            res.status(201).json({ message: 'Produto criado com sucesso', id: result.insertId });
        }
    );
});

// Busca um produto pelo ID
router.get('/:id', function (req, res) {
    const { id } = req.params;
    db.query('SELECT * FROM produto WHERE id = ?', [id], function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao buscar produto' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json(results[0]);
    });
});

module.exports = router;