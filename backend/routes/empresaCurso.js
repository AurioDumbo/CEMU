const express = require('express');
const {
    createEmpresaCurso,
    getAllEmpresaCurso,
    getEmpresaCursoById,
    updateEmpresaCurso,
    deleteEmpresaCurso,
    updateCursosInteresseEmpresa,
    getCursosInteresseEmpresa
} = require('../controllers/empresaCursoController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Add logging middleware
router.use((req, res, next) => {
    console.log('Route accessed:', req.method, req.originalUrl);
    next();
});

// Protect ALL routes with authMiddleware
router.use(authMiddleware);

// Routes - Order matters! More specific routes first
router.get('/empresa/:empresaId', getCursosInteresseEmpresa); // Move this up
router.put('/empresa/:empresaId', updateCursosInteresseEmpresa);

// Generic routes after
router.post('/', createEmpresaCurso);
router.get('/', getAllEmpresaCurso);
router.get('/:empresaId/:curso', getEmpresaCursoById);
router.put('/:empresaId/:curso', updateEmpresaCurso);
router.delete('/:empresaId/:curso', deleteEmpresaCurso);

module.exports = router;
