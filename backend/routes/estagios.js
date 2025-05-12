const express = require('express');
const router = express.Router();
const { createEstagio, getAllEstagios, getEstagioById, updateEstagio, deleteEstagio, getEstagiosProximos } = require('../controllers/estagiosController');

// Rotas
router.post('/', createEstagio);
router.get('/', getAllEstagios);
router.get('/:id', getEstagioById);
router.put('/:id', updateEstagio);
router.delete('/:id', deleteEstagio);
router.get('/notificacoes/proximos', getEstagiosProximos);

module.exports = router;
