const express = require('express');
const router = express.Router();
const faculdadeController = require('../controllers/faculdadeController');

// Rotas
router.post('/', faculdadeController.createFaculdade); // Criar uma nova faculdade
router.get('/', faculdadeController.getAllFaculdades); // Listar todas as faculdades
router.delete('/:id', faculdadeController.deleteFaculdade); // Remover uma faculdade por ID

module.exports = router;