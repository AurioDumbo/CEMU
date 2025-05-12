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

// Atualizar todos os cursos de interesse de uma empresa
const updateCursosInteresseEmpresa = async (req, res) => {
    const { empresaId } = req.params;
    const { cursos } = req.body;

    if (!empresaId || !Array.isArray(cursos)) {
        return res.status(400).json({ error: 'Empresa e lista de cursos são obrigatórios.' });
    }

    try {
        // Remove todos os cursos atuais da empresa
        await db.execute('DELETE FROM Empresa_Curso WHERE Empresa_ID = ?', [empresaId]);
        // Adiciona os novos cursos
        for (const cursoId of cursos) {
            await db.execute('INSERT INTO Empresa_Curso (Empresa_ID, Curso_ID) VALUES (?, ?)', [empresaId, cursoId]);
        }
        res.json({ message: 'Cursos de interesse atualizados com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Buscar todos os cursos de interesse de uma empresa
const getCursosInteresseEmpresa = async (req, res) => {
    const { empresaId } = req.params;
    
    // Verifica se empresaId é um número válido e positivo
    if (!empresaId || isNaN(empresaId) || parseInt(empresaId) <= 0) {
        return res.status(400).json({ error: 'ID da empresa inválido. Deve ser um número positivo.' });
    }

    const id = parseInt(empresaId);
    
    try {
        // Primeiro verifica se a empresa existe
        const [empresa] = await db.execute('SELECT ID FROM Empresa WHERE ID = ?', [id]);

        if (empresa.length === 0) {
            return res.status(404).json({ error: 'Empresa não encontrada' });
        }

        // Busca os cursos de interesse
        const [rows] = await db.execute(
            `SELECT 
                ec.Curso_ID,
                c.Nome as curso_nome
             FROM Empresa_Curso ec
             INNER JOIN Curso c ON ec.Curso_ID = c.ID
             WHERE ec.Empresa_ID = ?`,
            [id]
        );
        
        // Retorna um array com os IDs dos cursos e seus nomes
        res.json(rows.map(row => ({
            id: row.Curso_ID,
            nome: row.curso_nome
        })));
    } catch (error) {
        console.error('Erro completo:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createEmpresaCurso,
    getAllEmpresaCurso,
    getEmpresaCursoById,
    updateEmpresaCurso,
    deleteEmpresaCurso,
    updateCursosInteresseEmpresa,
    getCursosInteresseEmpresa,
};