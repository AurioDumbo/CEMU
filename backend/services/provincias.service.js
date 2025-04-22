const axios = require("axios");

const API_BASE = "https://angolaprovinciasapi.ggwp.com.br/api/v1";

async function getTodasProvincias() {
  const res = await axios.get(`${API_BASE}/provincias`);
  return res.data.data;
}

async function getProvinciaPorSlug(slug) {
  const res = await axios.get(`${API_BASE}/provincias/${slug}`);
  return res.data.data;
}

async function getCapital(slug) {
  const res = await axios.get(`${API_BASE}/provincias/${slug}/capital`);
  return res.data.data;
}

async function getMunicipios(slug) {
  const res = await axios.get(`${API_BASE}/provincias/${slug}/municipios`);
  return res.data.data;
}

module.exports = {
  getTodasProvincias,
  getProvinciaPorSlug,
  getCapital,
  getMunicipios,
}; 