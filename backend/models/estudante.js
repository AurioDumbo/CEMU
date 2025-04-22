class Estudante {
    constructor(id, nome, sobrenome, cursoId, telefone, email, faculdadeId, estado, sexo) {
        this.id = id;
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.cursoId = cursoId;
        this.telefone = telefone;
        this.email = email;
        this.faculdadeId = faculdadeId;
        this.estado = estado;
        this.sexo = sexo;
    }

    static async create(estudante) {
        const db = require('../config/db');
        const [result] = await db.execute(
            'INSERT INTO Estudante (Nome, Sobrenome, Curso_ID, Telefone, Email, Faculdade_ID, Estado, Sexo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [estudante.nome, estudante.sobrenome, estudante.cursoId, estudante.telefone, estudante.email, estudante.faculdadeId, estudante.estado, estudante.sexo]
        );
        return result.insertId;
    }

    static async findById(id) {
        const db = require('../config/db');
        const [rows] = await db.execute('SELECT * FROM Estudante WHERE ID = ?', [id]);
        if (rows.length === 0) return null;
        const estudante = rows[0];
        return new Estudante(
            estudante.ID,
            estudante.Nome,
            estudante.Sobrenome,
            estudante.Curso_ID,
            estudante.Telefone,
            estudante.Email,
            estudante.Faculdade_ID,
            estudante.Estado,
            estudante.Sexo
        );
    }

    static async findAll() {
        const db = require('../config/db');
        const [rows] = await db.execute('SELECT * FROM Estudante');
        return rows.map(estudante => new Estudante(
            estudante.ID,
            estudante.Nome,
            estudante.Sobrenome,
            estudante.Curso_ID,
            estudante.Telefone,
            estudante.Email,
            estudante.Faculdade_ID,
            estudante.Estado,
            estudante.Sexo
        ));
    }

    static async update(id, estudante) {
        const db = require('../config/db');
        await db.execute(
            'UPDATE Estudante SET Nome = ?, Sobrenome = ?, Curso_ID = ?, Telefone = ?, Email = ?, Faculdade_ID = ?, Estado = ?, Sexo = ? WHERE ID = ?',
            [estudante.nome, estudante.sobrenome, estudante.cursoId, estudante.telefone, estudante.email, estudante.faculdadeId, estudante.estado, estudante.sexo, id]
        );
    }

    static async delete(id) {
        const db = require('../config/db');
        await db.execute('DELETE FROM Estudante WHERE ID = ?', [id]);
    }
}

const updateEstudanteEstado = async () => {
    const query = `
        UPDATE Estudante e
        JOIN Estagio es ON e.ID = es.Estudante_ID
        SET e.Estado = CASE
            WHEN CURDATE() < es.Inicio THEN 'Pendente'
            WHEN CURDATE() BETWEEN es.Inicio AND es.Termino THEN 'Ativo'
            WHEN CURDATE() > es.Termino THEN 'Inativo'
            ELSE e.Estado
        END
        WHERE es.Estudante_ID IS NOT NULL;
    `;
    
    try {
        await db.query(query);
        console.log('Estados dos estudantes atualizados com sucesso');
    } catch (error) {
        console.error('Erro ao atualizar estados dos estudantes:', error);
        throw error;
    }
};

module.exports = {
    Estudante,
    updateEstudanteEstado
}; 