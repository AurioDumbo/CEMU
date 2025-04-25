const provinciasService = require("../services/provincias.service");

const listarTodas = async (req, res) => {
  try {
    const data = await provinciasService.getTodasProvincias();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar províncias" });
  }
};

const buscarPorSlug = async (req, res) => {
  try {
    const data = await provinciasService.getProvinciaPorSlug(req.params.slug);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: "Província não encontrada" });
  }
};

const buscarCapital = async (req, res) => {
  try {
    const data = await provinciasService.getCapital(req.params.slug);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: "Capital não encontrada" });
  }
};

const buscarMunicipios = async (req, res) => {
  try {
    const data = await provinciasService.getMunicipios(req.params.slug);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: "Municípios não encontrados" });
  }
};

module.exports = {
  listarTodas,
  buscarPorSlug,
  buscarCapital,
  buscarMunicipios,
}; 