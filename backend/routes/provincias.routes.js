const express = require("express");
const router = express.Router();
const controller = require("../controllers/provincias.controller");

router.get("/", controller.listarTodas);
router.get("/:slug", controller.buscarPorSlug);
router.get("/:slug/capital", controller.buscarCapital);
router.get("/:slug/municipios", controller.buscarMunicipios);

module.exports = router; 