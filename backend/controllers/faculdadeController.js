const db = require('../config/db');

const createFaculdade = async (req, res) => {
    const { Nome } = req.body;
    if (!Nome) {
        return res.status(400).json({ error: 'O campo Nome é obrigatório!' });
    }
    try {
        const sql = 'INSERT INTO Faculdade (Nome) VALUES (?)';
        const [result] = await db.execute(sql, [Nome]); 
        res.status(201).json({ message: 'Faculdade criada com sucesso!', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllFaculdades = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Faculdade'); 
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getFaculdadeById = async (req, res) => {
    const { id } = req.params;
    try {
        const sql = 'SELECT * FROM Faculdade WHERE ID = ?';
        const [rows] = await db.execute(sql, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Faculdade não encontrada!' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateFaculdade = async (req, res) => {
    const { id } = req.params;
    const { Nome } = req.body;
    
    if (!Nome) {
        return res.status(400).json({ error: 'O campo Nome é obrigatório!' });
    }

    try {
        const sql = 'UPDATE Faculdade SET Nome = ? WHERE ID = ?';
        const [result] = await db.execute(sql, [Nome, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Faculdade não encontrada!' });
        }
        
        res.json({ message: 'Faculdade atualizada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteFaculdade = async (req, res) => {
    const { id } = req.params;
    try {
        const sql = 'DELETE FROM Faculdade WHERE ID = ?';
        const [result] = await db.execute(sql, [id]); 
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Faculdade não encontrada!' });
        }
        res.json({ message: 'Faculdade removida com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { 
    createFaculdade, 
    getAllFaculdades, 
    getFaculdadeById, 
    updateFaculdade, 
    deleteFaculdade 
};