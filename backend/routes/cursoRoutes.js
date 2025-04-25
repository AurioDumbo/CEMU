const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas para cursos
router.get('/', authMiddleware, cursoController.getAllCursos);
router.post('/', authMiddleware, cursoController.criarCurso);
router.get('/:id', authMiddleware, cursoController.getCursoById);
router.put('/:id', authMiddleware, cursoController.atualizarCurso);
router.delete('/:id', authMiddleware, cursoController.deletarCurso);

module.exports = router; 