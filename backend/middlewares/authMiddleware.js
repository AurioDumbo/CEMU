const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        console.log('Token não fornecido');
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    try {
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET não definido!');
            return res.status(500).json({ error: 'Erro interno de autenticação' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        return res.status(401).json({ error: 'Token inválido' });
    }
};

module.exports = authMiddleware;