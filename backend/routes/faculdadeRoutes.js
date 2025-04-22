const express = require('express');
const router = express.Router();
const faculdadeController = require('../controllers/faculdadeController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas protegidas por autenticação
router.get('/', authMiddleware, faculdadeController.getAllFaculdades);
router.post('/', authMiddleware, faculdadeController.criarFaculdade);
router.get('/:id', authMiddleware, faculdadeController.getFaculdadeById);
router.put('/:id', authMiddleware, faculdadeController.atualizarFaculdade);
router.delete('/:id', authMiddleware, faculdadeController.deletarFaculdade);

module.exports = router; 