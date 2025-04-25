const db = require('../config/db');

const createCurso = async (req, res) => {
    const { Nome, Faculdade_ID } = req.body;
    if (!Nome || !Faculdade_ID) {
        return res.status(400).json({ error: 'Os campos Nome e Faculdade_ID são obrigatórios!' });
    }
    try {
        const sql = 'INSERT INTO Curso (Nome, Faculdade_ID) VALUES (?, ?)';
        const [result] = await db.execute(sql, [Nome, Faculdade_ID]);
        res.status(201).json({ message: 'Curso criado com sucesso!', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllCursos = async (req, res) => {
    try {
        const sql = `
            SELECT 
                c.ID as curso_id,
                c.Nome as curso_nome,
                f.ID as faculdade_id,
                f.Nome as faculdade_nome
            FROM Curso c
            LEFT JOIN Faculdade f ON c.Faculdade_ID = f.ID
            ORDER BY c.Nome
        `;
        const [rows] = await db.execute(sql);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCursoById = async (req, res) => {
    const { id } = req.params;

    try {
        const sql = `
            SELECT 
                c.ID as curso_id,
                c.Nome as curso_nome,
                f.ID as faculdade_id,
                f.Nome as faculdade_nome
            FROM Curso c
            LEFT JOIN Faculdade f ON c.Faculdade_ID = f.ID
            WHERE c.ID = ?
        `;
        const [rows] = await db.execute(sql, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Curso não encontrado!' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCurso = async (req, res) => {
    const { id } = req.params;
    const { Nome, Faculdade_ID } = req.body;

    if (!Nome || !Faculdade_ID) {
        return res.status(400).json({ error: 'Os campos Nome e Faculdade_ID são obrigatórios!' });
    }

    try {
        const sql = 'UPDATE Curso SET Nome = ?, Faculdade_ID = ? WHERE ID = ?';
        const [result] = await db.execute(sql, [Nome, Faculdade_ID, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Curso não encontrado!' });
        }

        res.json({ message: 'Curso atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteCurso = async (req, res) => {
    const { id } = req.params;

    try {
        const sql = 'DELETE FROM Curso WHERE ID = ?';
        const [result] = await db.execute(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Curso não encontrado!' });
        }

        res.json({ message: 'Curso removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createCurso,
    getAllCursos,
    getCursoById,
    updateCurso,
    deleteCurso,
};