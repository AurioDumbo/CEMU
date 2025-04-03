const express = require('express');
const router = express.Router();
const estudantesController = require('../controllers/estudantesController');

// Rotas
router.post('/', estudantesController.createEstudante);
router.get('/', estudantesController.getAllEstudantes);
router.get('/:id', estudantesController.getEstudanteById);
router.put('/:id', estudantesController.updateEstudante);
router.delete('/:id', estudantesController.deleteEstudante);

module.exports = router;
