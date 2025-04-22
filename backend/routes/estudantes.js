const express = require('express');
const router = express.Router();
const { createEstudante, getAllEstudantes, getEstudanteById, updateEstudante, deleteEstudante } = require('../controllers/estudantesController');

// Rotas
router.post('/', createEstudante);
router.get('/', getAllEstudantes);
router.get('/:id', getEstudanteById);
router.put('/:id', updateEstudante);
router.delete('/:id', deleteEstudante);

module.exports = router;
