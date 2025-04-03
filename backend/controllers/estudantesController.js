const db = require('../config/db');

// CREATE: Inserir um novo estudante
exports.createEstudante = async (req, res) => {
    const { Nome, Sobrenome, Curso, Telefone, Email, Faculdade_ID, Responsavel_Nome, Responsavel_Telefone } = req.body;

    if (!Nome || !Sobrenome || !Curso || Responsavel_Nome || Responsavel_Telefone) {
        return res.status(400).json({ error: 'Os campos Nome, Sobrenome, Cursosão obrigatórios!' });
    }

    try {
        const sql = `
            INSERT INTO Estudante (Nome, Sobrenome, Curso, Telefone, Email, Faculdade_ID, Responsavel_Nome, Responsavel_Telefone) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [Nome, Sobrenome, Curso, Telefone, Email, Faculdade_ID, Responsavel_Nome, Responsavel_Telefone]);
        
        res.status(201).json({ message: 'Estudante criado com sucesso!', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// READ: Listar todos os estudantes
exports.getAllEstudantes = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Estudante');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// READ: Obter um estudante por ID
exports.getEstudanteById = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Estudante WHERE ID = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Estudante não encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE: Atualizar um estudante
exports.updateEstudante = async (req, res) => {
    const { Nome, Sobrenome, Curso, Telefone, Email, Responsavel_Nome, Responsavel_Telefone } = req.body;

    try {
        const [result] = await db.execute(
            `UPDATE Estudante 
            SET Nome = ?, Sobrenome = ?, Curso = ?, Telefone = ?, Email = ?, Responsavel_Nome = ?, Responsavel_Telefone = ? 
            WHERE ID = ?`,
            [Nome, Sobrenome, Curso, Telefone, Email, Responsavel_Nome, Responsavel_Telefone, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Estudante não encontrado' });
        }
        res.json({ message: 'Estudante atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Remover um estudante
exports.deleteEstudante = async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM Estudante WHERE ID = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Estudante não encontrado' });
        }
        res.json({ message: 'Estudante removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
