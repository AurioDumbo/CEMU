const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Importa o pool de conexões

// CREATE: Inserir um novo feedback para um estágio
// CREATE: Inserir um novo feedback para um estágio
router.post('/', async (req, res) => {
    const { Estagio_ID, Estudante_ID, Empresa_ID, Feedback, Comentario } = req.body;
    // Substituir undefined por null para Comentario
    const comentarioValue = (typeof Comentario === 'undefined') ? null : Comentario;

    try {
        const sql = `
            INSERT INTO FeedbackEstagio (Estagio_ID, Estudante_ID, Empresa_ID, Feedback, Comentario)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(sql, [Estagio_ID, Estudante_ID, Empresa_ID, Feedback, comentarioValue]);
        res.status(201).json({ message: 'Feedback criado com sucesso!', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// READ: Obter todos os feedbacks
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM FeedbackEstagio');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ: Obter um feedback específico por ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM FeedbackEstagio WHERE ID = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Feedback não encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE: Atualizar um feedback existente
router.put('/:id', async (req, res) => {
    const { Estagio_ID, Estudante_ID, Empresa_ID, Feedback, Comentario } = req.body;
    try {
        const sql = `
            UPDATE FeedbackEstagio 
            SET Estagio_ID = ?, Estudante_ID = ?, Empresa_ID = ?, Feedback = ?, Comentario = ? 
            WHERE ID = ?
        `;
        const [result] = await db.execute(sql, [Estagio_ID, Estudante_ID, Empresa_ID, Feedback, Comentario, req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Feedback não encontrado' });
        }
        res.json({ message: 'Feedback atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE: Remover um feedback
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM FeedbackEstagio WHERE ID = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Feedback não encontrado' });
        }
        res.json({ message: 'Feedback excluído com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
