const express = require('express');
const {
  createEmpresaCurso,
  getAllEmpresaCurso,
  getEmpresaCursoById,
  updateEmpresaCurso,
  deleteEmpresaCurso,
} = require('../controllers/empresaCursoController');

const router = express.Router();

// Rotas
router.post('/', createEmpresaCurso);
router.get('/', getAllEmpresaCurso);
router.get('/:empresaId/:curso', getEmpresaCursoById);
router.put('/:empresaId/:curso', updateEmpresaCurso);
router.delete('/:empresaId/:curso', deleteEmpresaCurso);

module.exports = router;
