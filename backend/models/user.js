const db = require('../config/db');

class User {
    static async create({ email, password, role = 3 }) {
        const [result] = await db.execute(
            'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
            [email, password, role]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0] || null;
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0] || null;
    }
}

module.exports = User;