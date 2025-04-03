const express = require('express');
const router = express.Router();
const empresaCursoController = require('../controllers/empresaCursoController');

// Rotas
router.post('/', empresaCursoController.createEmpresaCurso);
router.get('/', empresaCursoController.getAllEmpresaCurso);
router.get('/:empresaId/:curso', empresaCursoController.getEmpresaCursoById);
router.put('/:empresaId/:curso', empresaCursoController.updateEmpresaCurso);
router.delete('/:empresaId/:curso', empresaCursoController.deleteEmpresaCurso);

module.exports = router;
