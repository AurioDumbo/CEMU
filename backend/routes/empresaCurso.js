const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Importa o pool de conexões

// CREATE: Inserir uma nova relação Empresa_Curso
router.post('/', async (req, res) => {
    const { Empresa_ID, Curso } = req.body;
    try {
        const sql = 'INSERT INTO Empresa_Curso (Empresa_ID, Curso) VALUES (?, ?)';
        await db.execute(sql, [Empresa_ID, Curso]);
        res.status(201).json({ message: 'Relação Empresa_Curso criada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ: Listar todas as relações
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Empresa_Curso');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ: Obter uma relação específica por Empresa_ID e Curso
router.get('/:empresaId/:curso', async (req, res) => {
    const { empresaId, curso } = req.params;
    try {
        const sql = 'SELECT * FROM Empresa_Curso WHERE Empresa_ID = ? AND Curso = ?';
        const [rows] = await db.execute(sql, [empresaId, curso]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Relação não encontrada' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE: Atualizar a relação (por exemplo, alterar o nome do curso vinculado a uma empresa)
// Note: Alterar a chave primária diretamente não é comum. Aqui, usamos um campo 'NovoCurso' para substituir o valor atual.
router.put('/:empresaId/:curso', async (req, res) => {
    const { empresaId, curso } = req.params;
    const { NovoCurso } = req.body;
    try {
        const sql = 'UPDATE Empresa_Curso SET Curso = ? WHERE Empresa_ID = ? AND Curso = ?';
        const [result] = await db.execute(sql, [NovoCurso, empresaId, curso]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Relação não encontrada' });
        }
        res.json({ message: 'Relação atualizada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE: Remover uma relação
router.delete('/:empresaId/:curso', async (req, res) => {
    const { empresaId, curso } = req.params;
    try {
        const sql = 'DELETE FROM Empresa_Curso WHERE Empresa_ID = ? AND Curso = ?';
        const [result] = await db.execute(sql, [empresaId, curso]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Relação não encontrada' });
        }
        res.json({ message: 'Relação removida com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
