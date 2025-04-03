const db = require('../config/db');

// CREATE: Inserir uma nova empresa
exports.createEmpresa = async (req, res) => {
    const { NIF, Nome, Provincia, Telefone, Email, Status } = req.body;

    // Validações
    if (!NIF || !Nome || !Provincia || !Telefone || !Email || !Status) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }

    try {
        const sql = 'INSERT INTO Empresa (NIF, Nome, Provincia, Telefone, Email, Status) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await db.execute(sql, [NIF, Nome, Provincia, Telefone, Email, Status]);
        res.status(201).json({ message: 'Empresa criada com sucesso!', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// READ: Listar todas as empresas
exports.getAllEmpresas = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Empresa');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// READ: Obter uma empresa por ID
exports.getEmpresaById = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Empresa WHERE ID = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Empresa não encontrada' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE: Atualizar uma empresa
exports.updateEmpresa = async (req, res) => {
    const { NIF, Nome, Provincia, Telefone, Email, Status } = req.body;

    // Validações
    if (!NIF || !Nome || !Provincia || !Telefone || !Email || !Status) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }

    try {
        const sql = 'UPDATE Empresa SET NIF = ?, Nome = ?, Provincia = ?, Telefone = ?, Email = ?, Status = ? WHERE ID = ?';
        const [result] = await db.execute(sql, [NIF, Nome, Provincia, Telefone, Email, Status, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Empresa não encontrada!' });
        }

        res.json({ message: 'Empresa atualizada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Remover uma empresa
exports.deleteEmpresa = async (req, res) => {
    try {
        const sql = 'DELETE FROM Empresa WHERE ID = ?';
        const [result] = await db.execute(sql, [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Empresa não encontrada!' });
        }

        res.json({ message: 'Empresa removida com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};