
const express = require('express');
const router = express.Router();
const db = require('../db/db'); 

// CREATE: Inserir um novo estudante
router.post('/', async (req, res) => {
    const { Nome, Sobrenome, Curso, Telefone, Email } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO Estudante (Nome, Sobrenome, Curso, Telefone, Email) VALUES (?, ?, ?, ?, ?)',
            [Nome, Sobrenome, Curso, Telefone, Email]
        );
        res.status(201).json({ message: 'Estudante criado com sucesso!', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Estudante');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Estudante WHERE ID = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Estudante não encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE: Atualizar um estudante
router.put('/:id', async (req, res) => {
    const { Nome, Sobrenome, Curso, Telefone, Email } = req.body;
    try {
        const [result] = await db.execute(
            'UPDATE Estudante SET Nome = ?, Sobrenome = ?, Curso = ?, Telefone = ?, Email = ? WHERE ID = ?',
            [Nome, Sobrenome, Curso, Telefone, Email, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Estudante não encontrado' });
        }
        res.json({ message: 'Estudante atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE: Remover um estudante
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM Estudante WHERE ID = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Estudante não encontrado' });
        }
        res.json({ message: 'Estudante removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
