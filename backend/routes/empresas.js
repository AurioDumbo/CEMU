const express = require('express');
const router = express.Router();
const empresasController = require('../controllers/empresasController');

// Rotas
router.post('/', empresasController.createEmpresa);
router.get('/', empresasController.getAllEmpresas);
router.get('/:id', empresasController.getEmpresaById);
router.put('/:id', empresasController.updateEmpresa);
router.delete('/:id', empresasController.deleteEmpresa);
router.get('/por-curso/:cursoId', empresasController.getEmpresasPorCurso);

module.exports = router;
