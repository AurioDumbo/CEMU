const db = require('../config/db'); // Certifique-se de que o módulo de conexão com o banco de dados está configurado

// CREATE: Inserir um novo estágio
async function createEstagio(req, res) {
    const {
        Estudante_ID,
        Empresa_ID,
        Provincia,
        Municipio,
        Rua,
        Tipo,
        Modalidade,
        Remunerado,
        Responsavel_Nome,
        Responsavel_Telefone,
        Inicio,
        Termino
    } = req.body;

    // Log para debug
    console.log('Dados recebidos:', req.body);

    // Validação dos campos obrigatórios
    const camposObrigatorios = {
        Estudante_ID: 'Estudante',
        Empresa_ID: 'Empresa',
        Provincia: 'Província',
        Municipio: 'Município',
        Rua: 'Rua',
        Tipo: 'Tipo',
        Modalidade: 'Modalidade',
        Remunerado: 'Remunerado',
        Inicio: 'Data de início',
        Termino: 'Data de término'
    };

    const camposFaltantes = Object.entries(camposObrigatorios)
        .filter(([campo]) => typeof req.body[campo] === 'undefined' || req.body[campo] === '')
        .map(([_, nome]) => nome);

    if (camposFaltantes.length > 0) {
        return res.status(400).json({ 
            error: `Campos obrigatórios faltando: ${camposFaltantes.join(', ')}` 
        });
    }

    // Validação dos campos numéricos
    if (isNaN(Tipo) || Tipo === null) {
        return res.status(400).json({ error: 'Tipo de estágio inválido' });
    }
    if (isNaN(Modalidade) || Modalidade === null) {
        return res.status(400).json({ error: 'Modalidade inválida' });
    }
    if (isNaN(Remunerado) || Remunerado === null) {
        return res.status(400).json({ error: 'Valor inválido para remunerado' });
    }

    try {
        // Verifica se a empresa existe e está ativa
        const [empresaRows] = await db.execute(
            'SELECT Status FROM Empresa WHERE ID = ?',
            [Empresa_ID]
        );

        if (empresaRows.length === 0) {
            return res.status(404).json({ error: 'Empresa não encontrada!' });
        }

        if (empresaRows[0].Status !== 'Ativo') {
            return res.status(400).json({ error: 'A empresa não está ativa. Não é possível registrar estágio.' });
        }

        // Verifica se o estudante existe
        const [estudanteRows] = await db.execute(
            'SELECT ID FROM Estudante WHERE ID = ?',
            [Estudante_ID]
        );

        if (estudanteRows.length === 0) {
            return res.status(404).json({ error: 'Estudante não encontrado!' });
        }

        const sql = `
            INSERT INTO Estagio (
                Estudante_ID, Empresa_ID, Provincia, Municipio, Rua,
                Tipo, Modalidade, Remunerado,
                Responsavel_Nome, Responsavel_Telefone,
                Inicio, Termino
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const [result] = await db.execute(sql, [
            Estudante_ID, Empresa_ID, Provincia, Municipio, Rua,
            Tipo, Modalidade, Remunerado,
            Responsavel_Nome || null, Responsavel_Telefone || null,
            Inicio, Termino
        ]);

        res.status(201).json({ message: 'Estágio criado com sucesso!', id: result.insertId });
    } catch (error) {
        console.error('Erro ao criar estágio:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao criar estágio' });
    }
}

// READ: Obter todos os estágios
async function getAllEstagios(req, res) {
    try {
        // Primeiro, atualiza o estado dos estudantes com base nas datas de início
        await updateEstudantesStatus();

        const [rows] = await db.execute(`
            SELECT 
                e.*,
                CONCAT(est.Nome, ' ', est.Sobrenome) as estudante_nome,
                emp.Nome as empresa_nome,
                est.Estado as estudante_estado
            FROM Estagio e
            INNER JOIN Estudante est ON e.Estudante_ID = est.ID
            INNER JOIN Empresa emp ON e.Empresa_ID = emp.ID
            ORDER BY e.Inicio DESC
        `);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Função para atualizar o estado dos estudantes
async function updateEstudantesStatus() {
    try {
        const hoje = new Date().toISOString().split('T')[0];
        
        // Atualiza estudantes com estágios que começaram
        await db.execute(`
            UPDATE Estudante est
            INNER JOIN Estagio e ON est.ID = e.Estudante_ID
            SET est.Estado = 'Ativo'
            WHERE e.Inicio <= ? AND est.Estado != 'Ativo'
        `, [hoje]);

        // Atualiza estudantes com estágios que terminaram
        await db.execute(`
            UPDATE Estudante est
            INNER JOIN Estagio e ON est.ID = e.Estudante_ID
            SET est.Estado = 'Inativo'
            WHERE e.Termino < ? AND est.Estado != 'Inativo'
        `, [hoje]);
    } catch (error) {
        console.error('Erro ao atualizar estados dos estudantes:', error);
    }
}

// READ: Obter um estágio por ID
async function getEstagioById(req, res) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'ID do estágio é obrigatório!' });
    }

    try {
        const [rows] = await db.execute(`
            SELECT 
                e.*,
                CONCAT(est.Nome, ' ', est.Sobrenome) as estudante_nome,
                c.Nome as estudante_curso,
                f.Nome as estudante_faculdade,
                emp.Nome as empresa_nome,
                emp.NIF as empresa_nif,
                est.Estado as estudante_estado
            FROM Estagio e
            INNER JOIN Estudante est ON e.Estudante_ID = est.ID
            INNER JOIN Curso c ON est.Curso_ID = c.ID
            INNER JOIN Faculdade f ON est.Faculdade_ID = f.ID
            INNER JOIN Empresa emp ON e.Empresa_ID = emp.ID
            WHERE e.ID = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Estágio não encontrado!' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erro ao buscar estágio:', error);
        res.status(500).json({ error: error.message });
    }
}

// UPDATE: Atualizar um estágio
async function updateEstagio(req, res) {
    const { id } = req.params;
    const {
        Estudante_ID,
        Empresa_ID,
        Provincia,
        Municipio,
        Rua,
        Tipo,
        Modalidade,
        Remunerado,
        Responsavel_Nome,
        Responsavel_Telefone,
        Inicio,
        Termino
    } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'ID do estágio é obrigatório!' });
    }

    if (
        !Estudante_ID || !Empresa_ID || !Provincia || !Municipio || !Rua ||
        Tipo === undefined || Modalidade === undefined || Remunerado === undefined ||
        !Inicio || !Termino
    ) {
        return res.status(400).json({ error: 'Campos obrigatórios estão faltando!' });
    }

    try {
        const [result] = await db.execute(
            `UPDATE Estagio SET 
                Estudante_ID = ?, Empresa_ID = ?, Provincia = ?, Municipio = ?, Rua = ?,
                Tipo = ?, Modalidade = ?, Remunerado = ?, 
                Responsavel_Nome = ?, Responsavel_Telefone = ?, 
                Inicio = ?, Termino = ?
            WHERE ID = ?`,
            [
                Estudante_ID, Empresa_ID, Provincia, Municipio, Rua,
                Tipo, Modalidade, Remunerado,
                Responsavel_Nome || null, Responsavel_Telefone || null,
                Inicio, Termino, id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Estágio não encontrado!' });
        }

        res.status(200).json({ message: 'Estágio atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// DELETE: Remover um estágio
async function deleteEstagio(req, res) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'ID do estágio é obrigatório!' });
    }

    try {
        const [result] = await db.execute('DELETE FROM Estagio WHERE ID = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Estágio não encontrado!' });
        }

        res.status(200).json({ message: 'Estágio removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createEstagio,
    getAllEstagios,
    getEstagioById,
    updateEstagio,
    deleteEstagio
};