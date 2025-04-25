import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function EditarEmpresa() {
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    NIF: '',
    Nome: '',
    Provincia: '',
    Telefone: '',
    Email: '',
    Status: ''
  });
  const [provincias, setProvincias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('EditarEmpresa montado');
    console.log('ID recebido:', id);
    console.log('URL atual:', window.location.href);
    console.log('Params:', params);
    
    if (!id) {
      console.error('ID não encontrado na URL');
      toast.error('ID da empresa não encontrado');
      navigate('/registros');
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado');
      navigate('/login');
      return;
    }

    fetchEmpresa();
    fetchProvincias();
    // eslint-disable-next-line
  }, [id, navigate, params]);

  const fetchEmpresa = async () => {
    try {
      console.log('Buscando empresa com ID:', id);
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error('Token não encontrado');
        navigate('/login');
        return;
      }

      const res = await axios.get(`http://localhost:5001/api/empresas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Dados da empresa recebidos:', res.data);
      
      if (!res.data) {
        console.error('Dados da empresa não encontrados');
        toast.error('Empresa não encontrada');
        navigate('/registros');
        return;
      }

      setFormData({
        NIF: res.data.NIF || res.data.nif || '',
        Nome: res.data.Nome || res.data.nome || '',
        Provincia: res.data.Provincia || res.data.provincia || '',
        Telefone: res.data.Telefone || res.data.telefone || '',
        Email: res.data.Email || res.data.email || '',
        Status: res.data.Status || res.data.status || ''
      });
    } catch (error) {
      console.error('Erro ao carregar empresa:', error);
      toast.error('Erro ao carregar empresa. Verifique se o ID é válido.');
      navigate('/registros');
    } finally {
      setLoading(false);
    }
  };

  const fetchProvincias = async () => {
    try {
      const res = await axios.get('https://angolaprovinciasapi.ggwp.com.br/api/v1/provincias');
      setProvincias(res.data.data || res.data);
    } catch (error) {
      console.error('Erro ao carregar províncias:', error);
      toast.error('Erro ao carregar lista de províncias');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.put(`http://localhost:5001/api/empresas/${id}`, {
        nif: formData.NIF,
        nome: formData.Nome,
        provincia: formData.Provincia,
        telefone: formData.Telefone,
        email: formData.Email,
        status: formData.Status
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Empresa atualizada com sucesso!');
      navigate('/registros');
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      toast.error('Erro ao atualizar empresa. Tente novamente.');
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <h2 className="text-xl font-bold mb-6">Editar Empresa</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">NIF *</label>
            <input
              type="text"
              name="NIF"
              value={formData.NIF}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome *</label>
            <input
              type="text"
              name="Nome"
              value={formData.Nome}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Província *</label>
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
            <label className="block text-sm font-medium text-gray-700">Telefone *</label>
            <input
              type="text"
              name="Telefone"
              value={formData.Telefone}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status *</label>
            <select
              name="Status"
              value={formData.Status}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Selecione</option>
              <option value="Ativo">Ativo</option>
              <option value="Pendente">Pendente</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/registros')}
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