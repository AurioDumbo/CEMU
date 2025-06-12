import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function EditarEstagio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Estudante_ID: '',
    Empresa_ID: '',
    Provincia: '',
    Municipio: '',
    Rua: '',
    Tipo: '',
    Modalidade: '',
    Remunerado: '',
    Responsavel_Nome: '',
    Responsavel_Telefone: '',
    Data_Inicio: '',
    Data_Fim: ''
  });
  const [estudantes, setEstudantes] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEstagio();
    fetchEstudantes();
    fetchEmpresas();
    fetchProvincias();
        
  }, []);

  const fetchEstagio = async () => {
    try {
      const res = await api.get(`http://localhost:5001/api/estagios/${id}`);
      const estagio = res.data;
      setFormData({
        Estudante_ID: estagio.Estudante_ID || '',
        Empresa_ID: estagio.Empresa_ID || '',
        Provincia: estagio.Provincia || '',
        Municipio: estagio.Municipio || '',
        Rua: estagio.Rua || '',
        Tipo: estagio.Tipo?.toString() ?? '',
        Modalidade: estagio.Modalidade?.toString() ?? '',
        Remunerado: estagio.Remunerado?.toString() ?? '',
        Responsavel_Nome: estagio.Responsavel_Nome || '',
        Responsavel_Telefone: estagio.Responsavel_Telefone || '',
        Data_Inicio: estagio.Inicio ? estagio.Inicio.slice(0, 10) : '',
        Data_Fim: estagio.Termino ? estagio.Termino.slice(0, 10) : ''
      });
      if (estagio.Provincia) fetchMunicipios(estagio.Provincia);
    } catch {
      toast.error('Erro ao carregar dados do estágio.');
      navigate('/estagios');
    } finally {
      setLoading(false);
    }
  };

  const fetchEstudantes = async () => {
    const res = await api.get('http://localhost:5001/api/estudantes');
    setEstudantes(res.data);
  };

  const fetchEmpresas = async () => {
    const res = await api.get('http://localhost:5001/api/empresas');
    setEmpresas(res.data);
  };

  const fetchProvincias = async () => {
    const res = await axios.get('https://angolaprovinciasapi.ggwp.com.br/api/v1/provincias');
    setProvincias(res.data.data || res.data);
  };

  const fetchMunicipios = async (provincia) => {
    const res = await axios.get(`https://angolaprovinciasapi.ggwp.com.br/api/v1/provincias/${provincia}/municipios`);
    setMunicipios(res.data.data || res.data);
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'Provincia') {
      setFormData(prev => ({ ...prev, Municipio: '' }));
      fetchMunicipios(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`http://localhost:5001/api/estagios/${id}`, {
        Estudante_ID: parseInt(formData.Estudante_ID),
        Empresa_ID: parseInt(formData.Empresa_ID),
        Provincia: formData.Provincia,
        Municipio: formData.Municipio,
        Rua: formData.Rua,
        Tipo: parseInt(formData.Tipo),
        Modalidade: parseInt(formData.Modalidade),
        Remunerado: parseInt(formData.Remunerado),
        Responsavel_Nome: formData.Responsavel_Nome || null,
        Responsavel_Telefone: formData.Responsavel_Telefone || null,
        Inicio: formData.Data_Inicio,
        Termino: formData.Data_Fim
      });
      toast.success('Estágio atualizado com sucesso!');
      navigate('/estagios');
    } catch {
      toast.error('Erro ao atualizar estágio.');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Carregando dados...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <h2 className="text-xl font-bold mb-6">Editar Estágio</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Estudante</label>
            <select
              name="Estudante_ID"
              value={formData.Estudante_ID}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Selecione o estudante</option>
              {estudantes.map(est => (
                <option key={est.id || est.ID} value={est.id || est.ID}>
                  {est.nome || `${est.Nome} ${est.Sobrenome}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Empresa</label>
            <select
              name="Empresa_ID"
              value={formData.Empresa_ID}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Selecione a empresa</option>
              {empresas.map(emp => (
                <option key={emp.id || emp.ID} value={emp.id || emp.ID}>
                  {emp.nome || emp.Nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Província</label>
            <select
              name="Provincia"
              value={formData.Provincia}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Selecione a província</option>
              {provincias.map(prov => (
                <option key={prov.slug} value={prov.slug}>{prov.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Município</label>
            <select
              name="Municipio"
              value={formData.Municipio}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              disabled={!formData.Provincia}
            >
              <option value="">Selecione o município</option>
              {municipios.map(mun => (
                <option key={mun.slug} value={mun.slug}>{mun.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rua</label>
            <input
              type="text"
              name="Rua"
              value={formData.Rua}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <select
              name="Tipo"
              value={formData.Tipo}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Selecione o tipo</option>
              <option value="1">Acadêmico</option>
              <option value="0">Voluntário</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Modalidade</label>
            <select
              name="Modalidade"
              value={formData.Modalidade}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Selecione a modalidade</option>
              <option value="0">Atribuído</option>
              <option value="1">Adquirido</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Remunerado</label>
            <select
              name="Remunerado"
              value={formData.Remunerado}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Selecione</option>
              <option value="1">Sim</option>
              <option value="0">Não</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Responsável</label>
            <input
              type="text"
              name="Responsavel_Nome"
              value={formData.Responsavel_Nome}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Telefone do Responsável</label>
            <input
              type="text"
              name="Responsavel_Telefone"
              value={formData.Responsavel_Telefone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Início</label>
            <input
              type="date"
              name="Data_Inicio"
              value={formData.Data_Inicio}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Fim</label>
            <input
              type="date"
              name="Data_Fim"
              value={formData.Data_Fim}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/estagios')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}