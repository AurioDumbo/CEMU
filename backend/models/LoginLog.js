const db = require('../config/db');

class LoginLog {
    static async create({ userId, loginAt = new Date() }) {
        try {
            await db.execute(
                'INSERT INTO login_logs (user_id, login_at) VALUES (?, ?)',
                [userId, loginAt]
            );
        } catch (error) {
            console.error('Erro ao criar log:', error);
            throw error;
        }
    }

    static async findAll({ role, startDate, endDate, page = 1, limit = 10 }) {
        try {
            // Validação e conversão de page e limit
            const pageNumber = Number(page);
            const limitNumber = Number(limit);

            const offset = Math.max(0, (pageNumber - 1) * limitNumber);
            const lim = Math.max(1, limitNumber);

            let query = `
                SELECT l.*, u.email, u.role 
                FROM login_logs l
                JOIN users u ON l.user_id = u.id
                WHERE 1=1
            `;
            
            const params = [];

            if (role) {
                query += ' AND u.role = ?';
                params.push(role);
            }

            if (startDate) {
                // Validar e formatar startDate
                const start = new Date(startDate);
                if (isNaN(start.getTime())) {
                    throw new Error('Data de início inválida');
                }
                const formattedStartDate = start.toISOString().slice(0, 19).replace('T', ' ');
                query += ' AND l.login_at >= ?';
                params.push(formattedStartDate);
            }

            if (endDate) {
                // Validar e formatar endDate
                const end = new Date(endDate);
                if (isNaN(end.getTime())) {
                    throw new Error('Data de fim inválida');
                }
                const formattedEndDate = end.toISOString().slice(0, 19).replace('T', ' ');
                query += ' AND l.login_at <= ?';
                params.push(formattedEndDate);
            }

            // Get total first
            const countQuery = query.replace('l.*, u.email, u.role', 'COUNT(*) as total');
            const [countResult] = await db.execute(countQuery, params);

            // Add pagination (NUNCA use LIMIT ? OFFSET ? se der erro, interpolar é seguro aqui pois são números)
            const paginatedQuery = `${query} ORDER BY l.login_at DESC LIMIT ${lim} OFFSET ${offset}`;
            const [rows] = await db.execute(paginatedQuery, params);

            return {
                logs: rows,
                total: countResult[0].total
            };
        } catch (error) {
            console.error('Erro ao buscar logs:', error);
            throw error;
        }
    }
}

module.exports = LoginLog;
