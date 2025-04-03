const express = require('express');
const { register, login } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Alterado de '/registrar' para '/register'
router.post('/register', register);

router.post('/login', login);

router.get('/perfil', authenticateToken, (req, res) => {
    res.json({ message: 'Bem-vindo ao perfil!', user: req.user });
});

module.exports = router;