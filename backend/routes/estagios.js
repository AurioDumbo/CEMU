const express = require('express');
const router = express.Router();
const estagiosController = require('../controllers/estagiosController');

// Rotas
router.post('/', estagiosController.createEstagio);
router.get('/', estagiosController.getAllEstagios);
router.get('/:id', estagiosController.getEstagioById);
router.put('/:id', estagiosController.updateEstagio);
router.delete('/:id', estagiosController.deleteEstagio);

module.exports = router;
