const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas protegidas por autenticação
router.post('/', authMiddleware, cursoController.createCurso); 
router.get('/', authMiddleware, cursoController.getAllCursos); 
router.get('/:id', authMiddleware, cursoController.getCursoById); 
router.put('/:id', authMiddleware, cursoController.updateCurso); 
router.delete('/:id', authMiddleware, cursoController.deleteCurso); 

module.exports = router;