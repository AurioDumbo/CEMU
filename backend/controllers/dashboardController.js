const db = require('../config/db');

const getEstagiariosPorProvincia = async (req, res) => {
    try {
        const [results] = await db.execute(`
            SELECT 
                e.Provincia,
                COUNT(*) as total,
                ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM Estagio est INNER JOIN Estudante es ON est.Estudante_ID = es.ID WHERE es.Estado = 'Ativo')), 1) as percentagem
            FROM Estagio e
            INNER JOIN Estudante est ON e.Estudante_ID = est.ID
            WHERE est.Estado = 'Ativo'
            GROUP BY e.Provincia
            ORDER BY total DESC
        `);
        
        res.status(200).json(results);
    } catch (error) {
        console.error('Erro ao obter dados por província:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

const getEmpresasTopEstagios = async (req, res) => {
    try {
        const [results] = await db.execute(`
            SELECT 
                e.Nome as empresa,
                COUNT(est.ID) as total
            FROM Empresa e
            LEFT JOIN Estagio est ON e.ID = est.Empresa_ID
            LEFT JOIN Estudante s ON est.Estudante_ID = s.ID
            WHERE e.Status = 'Ativo' AND s.Estado = 'Ativo'
            GROUP BY e.ID, e.Nome
            ORDER BY total DESC
            LIMIT 3
        `);
        
        res.status(200).json(results);
    } catch (error) {
        console.error('Erro ao obter dados de empresas:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

const getDashboardData = async (req, res) => {
    try {

        const [estagiariosAtivos] = await db.execute(`
            SELECT COUNT(*) as total FROM Estudante WHERE Estado = 'Ativo'
        `);


        const [empresasAtivas] = await db.execute(`
            SELECT COUNT(*) as total FROM Empresa WHERE Status = 'Ativo'
        `);

        const [estudantesPendentes] = await db.execute(`
            SELECT COUNT(*) as total FROM Estudante WHERE Estado = 'Pendente'
        `);

        const [empresasPendentes] = await db.execute(`
            SELECT COUNT(*) as total FROM Empresa WHERE Status = 'Pendente'
        `);

        res.status(200).json({
            estagiariosAtivos: estagiariosAtivos[0].total,
            empresasAtivas: empresasAtivas[0].total,
            estudantesPendentes: estudantesPendentes[0].total,
            empresasPendentes: empresasPendentes[0].total
        });
    } catch (error) {
        console.error('Erro ao obter dados do dashboard:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

module.exports = { 
    getDashboardData,
    getEstagiariosPorProvincia,
    getEmpresasTopEstagios
};