const db = require('../config/db');

const createEmpresaCurso = async (req, res) => {
    const { empresa_id, cursos } = req.body;

    if (!empresa_id || !cursos || !Array.isArray(cursos)) {
        return res.status(400).json({ error: 'Os campos empresa_id e cursos são obrigatórios!' });
    }

    try {
        // Inserir cada curso individualmente
        for (const curso_id of cursos) {
            const sql = 'INSERT INTO Empresa_Curso (Empresa_ID, Curso_ID) VALUES (?, ?)';
            await db.execute(sql, [empresa_id, curso_id]);
        }
        
        res.status(201).json({ message: 'Relações Empresa_Curso criadas com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllEmpresaCurso = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT Empresa_Curso.*, Empresa.Nome AS EmpresaNome, Curso.Nome AS CursoNome
            FROM Empresa_Curso
            INNER JOIN Empresa ON Empresa_Curso.Empresa_ID = Empresa.ID
            INNER JOIN Curso ON Empresa_Curso.Curso_ID = Curso.ID
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getEmpresaCursoById = async (req, res) => {
    const { empresaId, cursoId } = req.params;

    try {
        const sql = `
            SELECT Empresa_Curso.*, Empresa.Nome AS EmpresaNome, Curso.Nome AS CursoNome
            FROM Empresa_Curso
            INNER JOIN Empresa ON Empresa_Curso.Empresa_ID = Empresa.ID
            INNER JOIN Curso ON Empresa_Curso.Curso_ID = Curso.ID
            WHERE Empresa_Curso.Empresa_ID = ? AND Empresa_Curso.Curso_ID = ?
        `;
        const [rows] = await db.execute(sql, [empresaId, cursoId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Relação Empresa_Curso não encontrada!' });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateEmpresaCurso = async (req, res) => {
    const { empresaId, cursoId } = req.params;
    const { NovoCurso_ID } = req.body;

    if (!NovoCurso_ID) {
        return res.status(400).json({ error: 'O campo NovoCurso_ID é obrigatório!' });
    }

    try {
        const sql = 'UPDATE Empresa_Curso SET Curso_ID = ? WHERE Empresa_ID = ? AND Curso_ID = ?';
        const [result] = await db.execute(sql, [NovoCurso_ID, empresaId, cursoId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Relação Empresa_Curso não encontrada!' });
        }

        res.json({ message: 'Relação Empresa_Curso atualizada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteEmpresaCurso = async (req, res) => {
    const { empresaId, cursoId } = req.params;

    try {
        const sql = 'DELETE FROM Empresa_Curso WHERE Empresa_ID = ? AND Curso_ID = ?';
        const [result] = await db.execute(sql, [empresaId, cursoId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Relação Empresa_Curso não encontrada!' });
        }

        res.json({ message: 'Relação Empresa_Curso removida com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createEmpresaCurso,
    getAllEmpresaCurso,
    getEmpresaCursoById,
    updateEmpresaCurso,
    deleteEmpresaCurso,
};