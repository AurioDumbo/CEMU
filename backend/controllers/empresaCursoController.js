const db = require('../config/db');

// CREATE: Inserir uma nova relação Empresa_Curso
exports.createEmpresaCurso = async (req, res) => {
    const { Empresa_ID, Curso_ID } = req.body;

    // Validações
    if (!Empresa_ID || !Curso_ID) {
        return res.status(400).json({ error: 'Os campos Empresa_ID e Curso_ID são obrigatórios!' });
    }

    try {
        const sql = 'INSERT INTO Empresa_Curso (Empresa_ID, Curso_ID) VALUES (?, ?)';
        const [result] = await db.execute(sql, [Empresa_ID, Curso_ID]);
        res.status(201).json({ message: 'Relação Empresa_Curso criada com sucesso!', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// READ: Listar todas as relações Empresa_Curso
exports.getAllEmpresaCurso = async (req, res) => {
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


exports.getEmpresaCursoById = async (req, res) => {
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


exports.updateEmpresaCurso = async (req, res) => {
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


exports.deleteEmpresaCurso = async (req, res) => {
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