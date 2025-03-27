// backend/routes/estagios.js
const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Criar um estágio
router.post('/', async (req, res) => {
    try {
        const { Estudante_ID, Empresa_ID, Provincia, Municipio, Rua, Tipo, Modalidade, Remunerado, Inicio, Termino } = req.body;
        const [result] = await db.execute(
            `INSERT INTO Estagio (Estudante_ID, Empresa_ID, Provincia, Municipio, Rua, Tipo, Modalidade, Remunerado, Inicio, Termino) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [Estudante_ID, Empresa_ID, Provincia, Municipio, Rua, Tipo, Modalidade, Remunerado, Inicio, Termino]
        );
        res.status(201).json({ message: 'Estágio criado com sucesso', ID: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obter todos os estágios
router.get('/', async (req, res) => {
    try {
        const [estagios] = await db.execute('SELECT * FROM Estagio');
        res.status(200).json(estagios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obter um estágio por ID
router.get('/:id', async (req, res) => {
    try {
        const [estagio] = await db.execute('SELECT * FROM Estagio WHERE ID = ?', [req.params.id]);
        if (estagio.length === 0) {
            return res.status(404).json({ error: 'Estágio não encontrado' });
        }
        res.status(200).json(estagio[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Atualizar um estágio
router.put('/:id', async (req, res) => {
    try {
        const { Estudante_ID, Empresa_ID, Provincia, Municipio, Rua, Tipo, Modalidade, Remunerado, Inicio, Termino } = req.body;
        await db.execute(
            `UPDATE Estagio SET Estudante_ID = ?, Empresa_ID = ?, Provincia = ?, Municipio = ?, Rua = ?, Tipo = ?, Modalidade = ?, Remunerado = ?, Inicio = ?, Termino = ? 
            WHERE ID = ?`,
            [Estudante_ID, Empresa_ID, Provincia, Municipio, Rua, Tipo, Modalidade, Remunerado, Inicio, Termino, req.params.id]
        );
        res.status(200).json({ message: 'Estágio atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Excluir um estágio
router.delete('/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM Estagio WHERE ID = ?', [req.params.id]);
        res.status(200).json({ message: 'Estágio removido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
