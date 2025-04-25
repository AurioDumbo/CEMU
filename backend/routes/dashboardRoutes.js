const express = require('express');
const router = express.Router();
const { getDashboardData, getEstagiariosPorProvincia, getEmpresasTopEstagios } = require('../controllers/dashboardController');

// Rota para obter os dados do Dashboard
router.get('/data', getDashboardData);
router.get('/provincias', getEstagiariosPorProvincia);
router.get('/empresas', getEmpresasTopEstagios);

module.exports = router;