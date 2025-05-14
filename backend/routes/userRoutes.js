const express = require('express');
const { register, login, updateUser, deleteUser } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');
const User = require('../models/user');
const LoginLog = require('../models/LoginLog');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/perfil', authenticateToken, (req, res) => {
    res.json({ message: 'Bem-vindo ao perfil!', user: req.user });
});
// backend/routes/userRoutes.js
router.post('/bootstrap-admin', async (req, res) => {
    const { email, password } = req.body;
    const { hash } = require('bcrypt');
    const hashedPassword = await hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, role: 1 });
    res.json({ message: 'Admin criado', user });
  });

router.get('/', authenticateToken, userController.listarUsuarios);

router.get('/login-logs', authenticateToken, async (req, res) => {
  try {
    const logs = await LoginLog.findAll({ order: [['loginAt', 'DESC']] });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar logs de login' });
  }
});

router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

module.exports = router;