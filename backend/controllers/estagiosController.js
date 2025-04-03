const db = require('../config/db');

exports.createEstagio = async (req, res) => {
    const { Estudante_ID, Empresa_ID, DataInicio, DataFim, Descricao, Tipo, Modalidade, Remunerado, Provincia, Municipio, Rua } = req.body;

    // Validações
    if (!Estudante_ID || !Empresa_ID || !DataInicio || !DataFim || !Descricao) {
        return res.status(400).json({ error: 'Os campos Estudante_ID, Empresa_ID, DataInicio, DataFim e Descricao são obrigatórios!' });
    }

    if (Tipo !== 0 && Tipo !== 1) {
        return res.status(400).json({ error: 'O campo Tipo deve ser 0 (Voluntário) ou 1 (Acadêmico).' });
    }

    if (Modalidade !== 0 && Modalidade !== 1) {
        return res.status(400).json({ error: 'O campo Modalidade deve ser 0 (Atribuído) ou 1 (Adquirido).' });
    }

    if (Remunerado !== 0 && Remunerado !== 1) {
        return res.status(400).json({ error: 'O campo Remunerado deve ser 0 (Não) ou 1 (Sim).' });
    }

    try {
        const sql = `
            INSERT INTO Estagio (Estudante_ID, Empresa_ID, DataInicio, DataFim, Descricao, Tipo, Modalidade, Remunerado, Provincia, Municipio, Rua)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(sql, [Estudante_ID, Empresa_ID, DataInicio, DataFim, Descricao, Tipo, Modalidade, Remunerado, Provincia, Municipio, Rua]);
        res.status(201).json({ message: 'Estágio criado com sucesso!', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getAllEstagios = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Estagios');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getEstagioById = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Estagios WHERE ID = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Estágio não encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateEstagio = async (req, res) => {
    const { Estudante_ID, Empresa_ID, DataInicio, DataFim, Descricao } = req.body;
    try {
        const sql = 'UPDATE Estagios SET Estudante_ID = ?, Empresa_ID = ?, DataInicio = ?, DataFim = ?, Descricao = ? WHERE ID = ?';
        const [result] = await db.execute(sql, [Estudante_ID, Empresa_ID, DataInicio, DataFim, Descricao, req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Estágio não encontrado' });
        }
        res.json({ message: 'Estágio atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteEstagio = async (req, res) => {
    try {
        const sql = 'DELETE FROM Estagios WHERE ID = ?';
        const [result] = await db.execute(sql, [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Estágio não encontrado' });
        }
        res.json({ message: 'Estágio removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};