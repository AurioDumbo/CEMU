const db = require('../config/database');

const getAllEstudantes = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, c.nome as curso, f.nome as faculdade 
      FROM Estudante e
      LEFT JOIN Curso c ON e.curso_id = c.id
      LEFT JOIN Faculdade f ON e.faculdade_id = f.id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar estudantes:', error);
    res.status(500).json({ error: 'Erro ao buscar estudantes' });
  }
};

module.exports = {
  getAllEstudantes
}; 