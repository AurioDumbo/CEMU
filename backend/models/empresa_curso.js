const db = require('../config/db');

class EmpresaCurso {
    static async getCursosInteresseEmpresa(empresaId) {
        try {

            const id = parseInt(empresaId);
            if (isNaN(id)) throw new Error('ID inválido');

            const [rows] = await db.execute(`
                SELECT 
                    ec.Curso_ID,
                    c.Nome as curso_nome
                FROM Empresa_Curso ec
                INNER JOIN Curso c ON ec.Curso_ID = c.ID
                WHERE ec.Empresa_ID = ?
            `, [id]);
            
            return rows;
        } catch (error) {
            console.error('Erro ao buscar cursos:', error);
            throw error;
        }
    }
}

module.exports = EmpresaCurso;