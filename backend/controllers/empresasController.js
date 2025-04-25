const db = require('../config/db');


async function createEmpresa(req, res) {
    const { NIF, Nome, Provincia, Telefone, Email, Status = 'Pendente' } = req.body;


    if (!NIF || !Nome || !Provincia) {
        return res.status(400).json({ error: 'Os campos NIF, Nome e Provincia são obrigatórios!' });
    }

    try {
        const sql = 'INSERT INTO Empresa (NIF, Nome, Provincia, Telefone, Email, Status) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await db.execute(sql, [NIF, Nome, Provincia, Telefone || null, Email || null, Status]);
        res.status(201).json({ message: 'Empresa criada com sucesso!', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


async function getAllEmpresas(req, res) {
    try {
        const [rows] = await db.execute(`
            SELECT 
                ID,
                Nome as nome,
                NIF as nif,
                Provincia as provincia,
                Telefone as telefone,
                Email as email,
                Status as status
            FROM Empresa
        `);
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar empresas:', error);
        res.status(500).json({ error: error.message });
    }
}


async function getEmpresaById(req, res) {
    try {
        const [rows] = await db.execute(`
            SELECT 
                ID,
                NIF,
                Nome,
                Provincia,
                Telefone,
                Email,
                Status
            FROM Empresa 
            WHERE ID = ?
        `, [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Empresa não encontrada' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


async function updateEmpresa(req, res) {
    const { NIF, Nome, Provincia, Telefone, Email, Status } = req.body;

 
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
}

// DELETE: Remover uma empresa
async function deleteEmpresa(req, res) {
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
}

module.exports = {
    createEmpresa,
    getAllEmpresas,
    getEmpresaById,
    updateEmpresa,
    deleteEmpresa,
};