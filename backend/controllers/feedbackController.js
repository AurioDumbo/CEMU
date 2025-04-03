const db = require('../config/db');

exports.createFeedback = async (req, res) => {
    const { Estagio_ID, Estudante_ID, Empresa_ID, Feedback, Comentario } = req.body;

    // Validações
    if (!Estagio_ID || !Estudante_ID || !Empresa_ID || !Feedback || !Comentario) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }

    try {
        const sql = `
            INSERT INTO FeedbackEstagio (Estagio_ID, Estudante_ID, Empresa_ID, Feedback, Comentario, DataFeedback)
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;
        const [result] = await db.execute(sql, [Estagio_ID, Estudante_ID, Empresa_ID, Feedback, Comentario]);
        res.status(201).json({ message: 'Feedback criado com sucesso!', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getAllFeedbacks = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Feedback');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getFeedbackById = async (req, res) => {
    const { id } = req.params;


    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'O ID deve ser um número válido!' });
    }

    try {
        const [rows] = await db.execute('SELECT * FROM Feedback WHERE ID = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Feedback não encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE: Atualizar um feedback
exports.updateFeedback = async (req, res) => {
    const { id } = req.params;
    const { Feedback, Comentario } = req.body;

    // Validações
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'O ID deve ser um número válido!' });
    }

    if (!Feedback || typeof Feedback !== 'string' || Feedback.trim() === '') {
        return res.status(400).json({ error: 'O campo Feedback deve ser uma string válida!' });
    }

    if (!Comentario || typeof Comentario !== 'string' || Comentario.trim() === '') {
        return res.status(400).json({ error: 'O campo Comentario deve ser uma string válida!' });
    }

    try {
        const sql = 'UPDATE Feedback SET Feedback = ?, Comentario = ? WHERE ID = ?';
        const [result] = await db.execute(sql, [Feedback, Comentario, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Feedback não encontrado' });
        }
        res.json({ message: 'Feedback atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Remover um feedback
exports.deleteFeedback = async (req, res) => {
    const { id } = req.params;

    // Validação
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'O ID deve ser um número válido!' });
    }

    try {
        const sql = 'DELETE FROM Feedback WHERE ID = ?';
        const [result] = await db.execute(sql, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Feedback não encontrado' });
        }
        res.json({ message: 'Feedback removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};