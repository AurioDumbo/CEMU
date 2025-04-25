const express = require('express');
const router = express.Router();
const estudanteController = require('../controllers/estudanteController');
const { getAllEstudantes } = require('../controllers/estudanteController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas para estudantes
router.post('/', estudanteController.criarEstudante);
router.get('/', authMiddleware, getAllEstudantes);
router.get('/:id', estudanteController.obterEstudante);
router.put('/:id', estudanteController.atualizarEstudante);
router.delete('/:id', estudanteController.deletarEstudante);

module.exports = router; 