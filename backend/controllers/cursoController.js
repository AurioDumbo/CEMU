const db = require('../config/db');

// CREATE: Inserir um novo curso
exports.createCurso = async (req, res) => {
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

// CREATE: Inserir um novo estudante
exports.createEstudante = async (req, res) => {
    const { Nome, Sobrenome, Curso, Telefone, Email, Faculdade_ID } = req.body;
    if (!Nome || !Sobrenome || !Curso) {
        return res.status(400).json({ error: 'Os campos Nome, Sobrenome e Curso são obrigatórios!' });
    }
    try {
        const sql = 'INSERT INTO Estudante (Nome, Sobrenome, Curso, Telefone, Email, Faculdade_ID) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await db.execute(sql, [Nome, Sobrenome, Curso, Telefone, Email, Faculdade_ID]);
        res.status(201).json({ message: 'Estudante criado com sucesso!', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// READ: Listar todos os cursos
exports.getAllCursos = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Curso');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// READ: Obter um curso por ID
exports.getCursoById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.execute('SELECT * FROM Curso WHERE ID = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Curso não encontrado!' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE: Atualizar um curso
exports.updateCurso = async (req, res) => {
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

// DELETE: Remover um curso
exports.deleteCurso = async (req, res) => {
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