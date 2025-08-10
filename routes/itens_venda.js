const express = require('express');
const router = express.Router();
const db = require('../db');


// Listar todos os itens de venda
router.get('/', (req, res) => {
    db.query('SELECT * FROM itens_venda', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao buscar itens de venda' });
        }
        res.json(results);
    });
});

// Buscar item de venda por ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM itens_venda WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao buscar item de venda' });
        }
        if (results.length === 0) return res.status(404).json({ error: 'Item de venda não encontrado' });
        res.json(results[0]);
    });
});

// Criar novo item de venda
router.post('/', (req, res) => {
    const { venda_id, produto_id, quantidade, preco_unitario } = req.body;
    if (!venda_id || !produto_id || !quantidade || !preco_unitario) {
        return res.status(400).json({ error: 'venda_id, produto_id, quantidade e preco_unitario são obrigatórios' });
    }
    db.query(
        'INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario, criado_em) VALUES (?, ?, ?, ?, NOW())',
        [venda_id, produto_id, quantidade, preco_unitario],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao criar item de venda' });
            }
            res.status(201).json({ message: 'Item de venda criado com sucesso', id: result.insertId });
        }
    );
});

// Atualizar item de venda
router.put('/:id', (req, res) => {
    const { venda_id, produto_id, quantidade, preco_unitario } = req.body;
    if (!venda_id && !produto_id && !quantidade && !preco_unitario) {
        return res.status(400).json({ error: 'Informe ao menos um campo para atualizar.' });
    }
    let fields = [];
    let values = [];
    if (venda_id) { fields.push('venda_id = ?'); values.push(venda_id); }
    if (produto_id) { fields.push('produto_id = ?'); values.push(produto_id); }
    if (quantidade) { fields.push('quantidade = ?'); values.push(quantidade); }
    if (preco_unitario) { fields.push('preco_unitario = ?'); values.push(preco_unitario); }
    values.push(req.params.id);
    const sql = `UPDATE itens_venda SET ${fields.join(', ')} WHERE id = ?`;
    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar item de venda' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Item de venda não encontrado' });
        res.json({ message: 'Item de venda atualizado com sucesso' });
    });
});

// Deletar item de venda
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM itens_venda WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao deletar item de venda' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Item de venda não encontrado' });
        res.json({ message: 'Item de venda deletado com sucesso' });
    });
});

module.exports = router;
