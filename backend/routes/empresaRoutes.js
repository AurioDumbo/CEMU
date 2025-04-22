const express = require('express');
const router = express.Router();
const { getAllEmpresas } = require('../controllers/empresaController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, getAllEmpresas);

module.exports = router; 