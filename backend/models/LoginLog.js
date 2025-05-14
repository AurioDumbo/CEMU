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
            const offset = Math.max(0, (parseInt(page) - 1) * parseInt(limit));
            const lim = Math.max(1, parseInt(limit));
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
                query += ' AND l.login_at >= ?';
                params.push(startDate + ' 00:00:00');
            }

            if (endDate) {
                query += ' AND l.login_at <= ?';
                params.push(endDate + ' 23:59:59');
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
