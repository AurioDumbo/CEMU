const express = require('express');
const {
  createEmpresaCurso,
  getAllEmpresaCurso,
  getEmpresaCursoById,
  updateEmpresaCurso,
  deleteEmpresaCurso,
  updateCursosInteresseEmpresa,
  getCursosInteresseEmpresa,
} = require('../controllers/empresaCursoController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Rotas protegidas por autenticação
router.post('/', authMiddleware, createEmpresaCurso);
router.get('/', authMiddleware, getAllEmpresaCurso);
router.get('/:empresaId/:curso', authMiddleware, getEmpresaCursoById);
router.put('/:empresaId/:curso', authMiddleware, updateEmpresaCurso);
router.delete('/:empresaId/:curso', authMiddleware, deleteEmpresaCurso);
router.put('/empresa/:empresaId', authMiddleware, updateCursosInteresseEmpresa);
router.get('/empresa/:empresaId', authMiddleware, getCursosInteresseEmpresa);

module.exports = router;
