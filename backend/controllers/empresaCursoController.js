const db = require('../config/db');


const createEmpresaCurso = async (req, res) => {
    const { empresa_id, cursos } = req.body;

    if (!empresa_id || !cursos || !Array.isArray(cursos)) {
        return res.status(400).json({ error: 'Os campos empresa_id e cursos são obrigatórios!' });
    }

    try {

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


const updateCursosInteresseEmpresa = async (req, res) => {
    const { empresaId } = req.params;
    const { cursos } = req.body;

    if (!empresaId || !Array.isArray(cursos)) {
        return res.status(400).json({ error: 'Empresa e lista de cursos são obrigatórios.' });
    }

    try {
 
        await db.execute('DELETE FROM Empresa_Curso WHERE Empresa_ID = ?', [empresaId]);

        for (const cursoId of cursos) {
            await db.execute('INSERT INTO Empresa_Curso (Empresa_ID, Curso_ID) VALUES (?, ?)', [empresaId, cursoId]);
        }
        res.json({ message: 'Cursos de interesse atualizados com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getCursosInteresseEmpresa = async (req, res) => {
    console.log('=== INICIO getCursosInteresseEmpresa ===');
    console.log('Request params:', req.params);
    
    const { empresaId } = req.params;
    if (!empresaId) {
        console.error('empresaId não fornecido');
        return res.status(400).json({ error: 'ID da empresa é obrigatório' });
    }

    try {
        const id = parseInt(empresaId);
        if (isNaN(id)) {
            console.error('ID inválido:', empresaId);
            return res.status(400).json({ error: 'ID da empresa inválido' });
        }

        const [empresa] = await db.execute(
            'SELECT ID FROM Empresa WHERE ID = ?',
            [id]
        );

        if (!empresa || empresa.length === 0) {
            return res.status(404).json({ error: 'Empresa não encontrada' });
        }


        const [rows] = await db.execute(
            'SELECT Curso_ID FROM Empresa_Curso WHERE Empresa_ID = ?',
            [id]
        );
        
        console.log('Resultado da query:', rows);
        

        const cursoIds = rows.map(row => row.Curso_ID);
        console.log('IDs dos cursos encontrados:', cursoIds);
        
        return res.json(cursoIds);
    } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        return res.status(500).json({ 
            error: 'Erro ao buscar cursos de interesse',
            details: error.message 
        });
    }
};


const getAllCursos = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT ID as curso_id, Nome as curso_nome FROM Curso');
        res.json(rows);
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
    updateCursosInteresseEmpresa,
    getCursosInteresseEmpresa,
    getAllCursos,
};

