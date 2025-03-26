// backend/routes/empresas.js
const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Importa o pool de conexões

// CREATE: Inserir uma nova empresa
router.post('/', async (req, res) => {
    const { NIF, Nome, Provincia, Telefone, Email, Status } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO Empresa (NIF, Nome, Provincia, Telefone, Email, Status) VALUES (?, ?, ?, ?, ?, ?)',
            [NIF, Nome, Provincia, Telefone, Email, Status || 'Pendente']
        );
        res.status(201).json({ message: 'Empresa criada com sucesso!', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ: Obter todas as empresas
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Empresa');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ: Obter uma empresa por ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Empresa WHERE ID = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Empresa não encontrada' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE: Atualizar uma empresa
router.put('/:id', async (req, res) => {
    const { NIF, Nome, Provincia, Telefone, Email, Status } = req.body;
    try {
        const [result] = await db.execute(
            'UPDATE Empresa SET NIF = ?, Nome = ?, Provincia = ?, Telefone = ?, Email = ?, Status = ? WHERE ID = ?',
            [NIF, Nome, Provincia, Telefone, Email, Status, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Empresa não encontrada' });
        }
        res.json({ message: 'Empresa atualizada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE: Remover uma empresa
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM Empresa WHERE ID = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Empresa não encontrada' });
        }
        res.json({ message: 'Empresa removida com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
