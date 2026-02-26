const db = require('../config/db');
    
async function createEstudante(req, res) {
    const { Nome, Sobrenome, Curso_ID, Telefone, Email, Faculdade_ID, Estado, Sexo } = req.body;

    if (!Nome || !Sobrenome || !Curso_ID || !Sexo || !Faculdade_ID) {
        return res.status(400).json({ error: 'Os campos Nome, Sobrenome, Curso_ID, Sexo e Faculdade_ID são obrigatórios!' });
    }

    try {
        // Verificar se já existe um estudante com o mesmo email ou telefone
        if (Email) {
            const [existingEmail] = await db.execute('SELECT ID FROM Estudante WHERE Email = ?', [Email]);
            if (existingEmail.length > 0) {
                return res.status(409).json({ error: 'Email já registrado' });
            }
        }
        if (Telefone) {
            const [existingTelefone] = await db.execute('SELECT ID FROM Estudante WHERE Telefone = ?', [Telefone]);
            if (existingTelefone.length > 0) {
                return res.status(409).json({ error: 'Telefone já registrado' });
            }
        }

        const sql = `
             INSERT INTO Estudante (Nome, Sobrenome, Curso_ID, Telefone, Email, Faculdade_ID, Estado, Sexo) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            const [result] = await db.execute(sql, [
                Nome,
                Sobrenome,
                Curso_ID,
                Telefone || null,
                Email || null,
                Faculdade_ID,
                Estado || 'Pendente',
                Sexo
            ]);
        
        res.status(201).json({ message: 'Estudante criado com sucesso!', id: result.insertId });
    } catch (error) {
        console.error('Erro SQL:', error);
        res.status(500).json({ error: error.message });
    }
}

async function getAllEstudantes(req, res) {
    try {
        const [rows] = await db.execute(`
            SELECT 
                e.ID as id,
                CONCAT(e.Nome, ' ', e.Sobrenome) as nome_completo,
                e.Sobrenome as sobrenome,
                e.nome as nome,
                e.Telefone as telefone,
                e.Email as email,
                e.Estado as status,
                e.Sexo as sexo,
                c.Nome as curso_nome,
                c.ID as curso_id,
                f.Nome as faculdade_nome,
                f.ID as faculdade_id
            FROM Estudante e
            LEFT JOIN Curso c ON e.Curso_ID = c.ID
            LEFT JOIN Faculdade f ON e.Faculdade_ID = f.ID
            ORDER BY e.Nome, e.Sobrenome
        `);
        
        const estudantesFormatados = rows.map(row => ({
            id: row.id,
            nome: row.nome,
            sobrenome: row.sobrenome,
            nome_completo: row.nome_completo,
            telefone: row.telefone || 'Não informado',
            email: row.email || 'Não informado',
            status: row.status,
            sexo: row.sexo,
            curso: {
                id: row.curso_id,
                nome: row.curso_nome
            },
            faculdade: {
                id: row.faculdade_id,
                nome: row.faculdade_nome
            }
        }));

        res.json(estudantesFormatados);
    } catch (error) {
        console.error('Erro ao buscar estudantes:', error);
        res.status(500).json({ error: error.message });
    }
}

async function getEstudanteById(req, res) {
    try {
        const [rows] = await db.execute(`
            SELECT 
                e.ID as id,
                e.Nome as nome,
                e.Sobrenome as sobrenome,
                e.Telefone as telefone,
                e.Email as email,
                e.Estado as status,
                e.Sexo as sexo,
                c.Nome as curso_nome,
                c.ID as curso_id,
                f.Nome as faculdade_nome,
                f.ID as faculdade_id
            FROM Estudante e
            LEFT JOIN Curso c ON e.Curso_ID = c.ID
            LEFT JOIN Faculdade f ON e.Faculdade_ID = f.ID
            WHERE e.ID = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Estudante não encontrado' });
        }

        const estudante = {
            id: rows[0].id,
            nome: rows[0].nome,
            sobrenome: rows[0].sobrenome,
            telefone: rows[0].telefone || 'Não informado',
            email: rows[0].email || 'Não informado',
            status: rows[0].status,
            sexo: rows[0].sexo,
            curso: {
                id: rows[0].curso_id,
                nome: rows[0].curso_nome
            },
            faculdade: {
                id: rows[0].faculdade_id,
                nome: rows[0].faculdade_nome
            }
        };

        res.json(estudante);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateEstudante(req, res) {
    const { Nome, Sobrenome, Curso_ID, Telefone, Email, Faculdade_ID, Estado, Sexo } = req.body;

    try {
        const [result] = await db.execute(
            `UPDATE Estudante 
            SET Nome = ?, Sobrenome = ?, Curso_ID = ?, Telefone = ?, Email = ?, Faculdade_ID = ?, Estado = ?, Sexo = ? 
            WHERE ID = ?`,
            [Nome, Sobrenome, Curso_ID, Telefone, Email, Faculdade_ID, Estado, Sexo, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Estudante não encontrado' });
        }
        res.json({ message: 'Estudante atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteEstudante(req, res) {
    try {
        const [result] = await db.execute('DELETE FROM Estudante WHERE ID = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Estudante não encontrado' });
        }
        res.json({ message: 'Estudante removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createEstudante,
    getAllEstudantes,
    getEstudanteById,
    updateEstudante,
    deleteEstudante,
};
