import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function EditarEmpresa() {
  const { id } = useParams();
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
  const [cursos, setCursos] = useState([]);
  const [cursosInteresse, setCursosInteresse] = useState([]);

  useEffect(() => {
    console.log('EditarEmpresa montado');
    console.log('ID recebido:', id);
    console.log('Tipo do ID:', typeof id);
    
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
  
    }, []);
  
  useEffect(() => {
    fetchEmpresa();
    fetchProvincias();
    fetchCursos().then(fetchCursosInteresse);
  }, [id, navigate]);

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

  const fetchCursos = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error('Token não encontrado');
        navigate('/login');
        return;
      }

      const res = await axios.get('http://localhost:5001/api/curso', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCursos(res.data);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
      toast.error('Erro ao carregar lista de cursos');
    }
  };

  const fetchCursosInteresse = async () => {
    try {
      if (!id) {
        console.error('ID da empresa não encontrado');
        return;
      }

      // Verifica se o id é um número válido
      const empresaId = parseInt(id);
      if (isNaN(empresaId)) {
        console.error('ID da empresa inválido:', id);
        return;
      }

      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error('Token não encontrado');
        navigate('/login');
        return;
      }

      const res = await axios.get(`http://localhost:5001/api/empresa_curso/empresa/${empresaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Cursos de interesse recebidos:', res.data); // <-- Adicione isso
      setCursosInteresse(res.data);
    } catch (error) {
      console.error('Erro ao carregar cursos de interesse:', error);
      toast.error('Erro ao carregar cursos de interesse da empresa');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Ajuste o handleCursoChange para aceitar tanto id quanto curso_id
  const handleCursoChange = (cursoId) => {
    setCursosInteresse(prev => {
      if (prev.some(c => Number(c.id) === Number(cursoId))) {
        return prev.filter(c => Number(c.id) !== Number(cursoId));
      } else {
        const curso = cursos.find(c => Number(c.curso_id) === Number(cursoId));
        return [...prev, { id: cursoId, nome: curso.curso_nome }];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação do número de telemóvel
    if (formData.Telefone && formData.Telefone.length !== 9) {
      toast.error('Número de telemóvel inválido. Deve conter exatamente 9 dígitos.');
      return;
    }

    // Validação do email
    if (formData.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      toast.error('Email inválido. Por favor, insira um email válido.');
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const dataToSend = {
        NIF: formData.NIF,
        Nome: formData.Nome,
        Provincia: formData.Provincia,
        Telefone: formData.Telefone,
        Email: formData.Email,
        Status: formData.Status
      };

      await axios.put(`http://localhost:5001/api/empresas/${id}`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await axios.put(
        `http://localhost:5001/api/empresa_curso/empresa/${id}`,
        { cursos: cursosInteresse.map(c => Number(c.id)) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Empresa atualizada com sucesso!');
      navigate('/registros');
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      if (error.response) {
        if (error.response.status === 400) {
          toast.error('Dados inválidos. Verifique se todos os campos foram preenchidos corretamente.');
        } else if (error.response.status === 409) {
          if (error.response.data.error.includes('Email')) {
            toast.error('Este email já está registrado no sistema');
          } else if (error.response.data.error.includes('Telefone')) {
            toast.error('Este número de telefone já está registrado no sistema');
          } else if (error.response.data.error.includes('NIF')) {
            toast.error('Este NIF já está registrado no sistema');
          }
        } else if (error.response.status === 401) {
          toast.error('Não autorizado. Faça login novamente.');
          navigate('/login');
        } else {
          toast.error(`Erro inesperado do servidor (código ${error.response.status}). Tente novamente.`);
        }
      } else if (error.request) {
        toast.error('Não foi possível conectar ao servidor. Verifique sua conexão com a internet ou se o backend está rodando.');
      } else {
        toast.error('Ocorreu um erro inesperado. Tente novamente.');
      }
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
      <div className="mt-6">
        <h3 className="font-bold mb-2">Cursos de Interesse da Empresa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cursos.map(curso => (
            <div 
              key={curso.curso_id} 
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                cursosInteresse.some(c => (c.id || c.curso_id) === curso.curso_id) 
                  ? 'bg-blue-100 border-blue-500' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => handleCursoChange(curso.curso_id)}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={cursosInteresse.some(c => Number(c.id) === Number(curso.curso_id))}
                  onChange={() => handleCursoChange(curso.curso_id)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">{curso.curso_nome}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}