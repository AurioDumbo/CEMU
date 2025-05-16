const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ACCESS_SECRET = process.env.JWT_SECRET || 'access_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh_secret';

// Em produção, armazene refresh tokens no banco!
let refreshTokens = [];

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

    // Verifique a senha aqui (ex: bcrypt)...

    const payload = { id: user.id, role: user.role };
    const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '8h' });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

    refreshTokens.push(refreshToken);

    res.json({ accessToken, refreshToken, role: user.role });
};

exports.refresh = (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken || !refreshTokens.includes(refreshToken)) {
        return res.status(403).json({ error: 'Refresh token inválido' });
    }
    try {
        const payload = jwt.verify(refreshToken, REFRESH_SECRET);
        const accessToken = jwt.sign({ id: payload.id, role: payload.role }, ACCESS_SECRET, { expiresIn: '1h' });
        res.json({ accessToken });
    } catch (err) {
        return res.status(403).json({ error: 'Refresh token inválido' });
    }
};

exports.logout = (req, res) => {
    const { refreshToken } = req.body;
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    res.json({ message: 'Logout realizado' });
};