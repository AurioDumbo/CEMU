import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ListarRegistros = () => {
  const [activeTab, setActiveTab] = useState('estudantes');
  const [estudantes, setEstudantes] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('ListarRegistros montado - Iniciando carregamento de dados');
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        console.log('Token encontrado:', !!token);
        
        if (!token) {
          console.log('Token não encontrado - Redirecionando para login');
          navigate('/login');
          return;
        }

        console.log('Iniciando requisições para API');
        const [estudantesRes, empresasRes] = await Promise.all([
          axios.get('http://localhost:5001/api/estudantes', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5001/api/empresas', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        console.log('Dados recebidos:', {
          estudantes: estudantesRes.data.length,
          empresas: empresasRes.data.length
        });

        setEstudantes(estudantesRes.data);
        setEmpresas(empresasRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados');
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const fetchEstudantes = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/estudantes');
      setEstudantes(response.data);
    } catch (error) {
      console.error('Erro ao buscar estudantes:', error);
      toast.error('Erro ao carregar lista de estudantes');
    }
  };

  const fetchEmpresas = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/empresas');
      setEmpresas(response.data);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      toast.error('Erro ao carregar lista de empresas');
    }
  };

  const handleDeleteEmpresa = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
        try {
            await axios.delete(`http://localhost:5001/api/empresas/${id}`);
            toast.success('Empresa excluída com sucesso');
            fetchEmpresas(); // Atualiza a lista após excluir
        } catch (error) {
            console.error('Erro ao excluir empresa:', error);
            toast.error('Erro ao excluir empresa');
        }
    }
  };

  const handleDeleteEstudante = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este estudante?')) {
        try {
            await axios.delete(`http://localhost:5001/api/estudantes/${id}`);
            toast.success('Estudante excluído com sucesso');
            fetchEstudantes(); // Atualiza a lista após excluir
        } catch (error) {
            console.error('Erro ao excluir estudante:', error);
            toast.error('Erro ao excluir estudante');
        }
    }
  };

  useEffect(() => {
    fetchEstudantes();
    fetchEmpresas();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = activeTab === 'empresas' 
        ? empresas.filter(empresa => 
            empresa.nome.toLowerCase().includes(value.toLowerCase()) ||
            empresa.nif.toLowerCase().includes(value.toLowerCase()) ||
            empresa.email.toLowerCase().includes(value.toLowerCase())
          )
        : estudantes.filter(estudante => 
            estudante.nome.toLowerCase().includes(value.toLowerCase()) ||
            estudante.email.toLowerCase().includes(value.toLowerCase())
          );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const filteredData = activeTab === 'empresas' 
    ? empresas.filter(empresa => 
        empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empresa.nif.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empresa.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : estudantes.filter(estudante => 
        estudante.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        estudante.email.toLowerCase().includes(searchTerm.toLowerCase())
      );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-100 ml-20">
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Relatórios</h1>
          </div>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
                  <ul className="py-1">
                    {suggestions.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => {
                          setSearchTerm(activeTab === 'empresas' ? item.nome : item.nome);
                          setShowSuggestions(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {activeTab === 'empresas' ? item.nome : item.nome}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button
              onClick={() => setActiveTab('estudantes')}
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                activeTab === 'estudantes'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Estudantes
            </button>
            <button
              onClick={() => setActiveTab('empresas')}
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                activeTab === 'empresas'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Empresas
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto w-full">
            {activeTab === 'estudantes' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculdade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.map((estudante) => (
                      <tr key={estudante.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{estudante.nome}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{estudante.curso.nome}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{estudante.faculdade.nome}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{estudante.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{estudante.telefone}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${estudante.status === 'Ativo' ? 'bg-green-100 text-green-800' : 
                            estudante.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                            {estudante.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => navigate(`/register-student/${estudante.id}`)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4">
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteEstudante(estudante.id)}
                            className="text-red-600 hover:text-red-900">
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIF</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Província</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.map((empresa) => (
                      <tr key={empresa.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{empresa.nome}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{empresa.nif}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{empresa.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{empresa.telefone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{empresa.provincia}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${empresa.status === 'Ativo' ? 'bg-green-100 text-green-800' : 
                            empresa.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                            {empresa.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => navigate(`/register-company/${empresa.id}`)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4">
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteEmpresa(empresa.id)}
                            className="text-red-600 hover:text-red-900">
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListarRegistros; 