const db = require('../config/db');

class LoginLog {
    static async create({ email, loginAt = new Date() }) {
        await db.execute(
            'INSERT INTO login_logs (email, loginAt) VALUES (?, ?)',
            [email, loginAt]
        );
    }

    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM login_logs');
        return rows;
    }
}

module.exports = LoginLog;
