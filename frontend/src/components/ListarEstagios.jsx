import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import filtroIcon from '../assets/icons/filtro.svg';
import globoIcon from '../assets/icons/globo.svg';
import calendarIcon from '../assets/icons/Calendar.svg';
import EditIcon from '../assets/icons/edit.svg?react';
import DeleteIcon from '../assets/icons/delete.svg?react';

export default function ListarEstagios() {
  const navigate = useNavigate();
  const [estagios, setEstagios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchEstagios();
    
    // Atualiza os estágios a cada 5 minutos
    const interval = setInterval(fetchEstagios, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchEstagios = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/estagios');
      setEstagios(response.data);
    } catch (error) {
      console.error('Erro ao carregar estágios:', error);
      alert('Erro ao carregar a lista de estágios');
    } finally {
      setLoading(false);
    }
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getTipoEstagio = (tipo) => {
    return tipo === 1 ? 'Acadêmico' : 'Voluntário';
  };

  const getModalidade = (modalidade) => {
    return modalidade === 0 ? 'Atribuído' : 'Adquirido';
  };

  const getRemunerado = (remunerado) => {
    return remunerado === 1 ? 'Sim' : 'Não';
  };

  const filteredEstagios = estagios.filter(estagio => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      estagio.estudante_nome?.toLowerCase().includes(searchTermLower) ||
      estagio.empresa_nome?.toLowerCase().includes(searchTermLower) ||
      estagio.Provincia?.toLowerCase().includes(searchTermLower) ||
      estagio.Municipio?.toLowerCase().includes(searchTermLower)
    );
  });

  // Calcular paginação
  const totalPages = Math.ceil(filteredEstagios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredEstagios.slice(startIndex, endIndex);

  const handleEdit = (id) => {
    navigate(`/estagios/${id}/edit`);
  };

  const handleDelete = async (ids) => {
    if (window.confirm('Tem certeza de que deseja excluir os estágios selecionados?')) {
      try {
        await axios.delete('http://localhost:5001/api/estagios', { data: { ids } });
        fetchEstagios();
      } catch (error) {
        console.error('Erro ao excluir estágios:', error);
        alert('Erro ao excluir os estágios');
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
            <h1 className="text-2xl font-bold text-gray-800">Estágios</h1>
          </div>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <img src={filtroIcon} alt="Filtrar" className="w-4 h-4" />
              Filtrar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <img src={globoIcon} alt="Exportar" className="w-4 h-4" />
              Exportar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <img src={calendarIcon} alt="Calendário" className="w-4 h-4" />
              Calendário
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select className="w-full border border-gray-300 rounded-md p-2">
                  <option value="">Todos</option>
                  <option value="1">Acadêmico</option>
                  <option value="0">Voluntário</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modalidade</label>
                <select className="w-full border border-gray-300 rounded-md p-2">
                  <option value="">Todas</option>
                  <option value="0">Atribuído</option>
                  <option value="1">Adquirido</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remunerado</label>
                <select className="w-full border border-gray-300 rounded-md p-2">
                  <option value="">Todos</option>
                  <option value="1">Sim</option>
                  <option value="0">Não</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-4 text-center text-gray-600">Carregando estágios...</div>
          ) : filteredEstagios.length === 0 ? (
            <div className="p-4 text-center text-gray-600">Nenhum estágio encontrado</div>
          ) : (
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Local
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Período
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((estagio) => (
                  <tr 
                    key={estagio.ID} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/estagios/${estagio.ID}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {estagio.estudante_nome}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getModalidade(estagio.Modalidade)} • {getRemunerado(estagio.Remunerado) === 'Sim' ? 'Remunerado' : 'Não Remunerado'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{estagio.empresa_nome}</div>
                      <div className="text-sm text-gray-500">
                        {estagio.Responsavel_Nome && `Resp: ${estagio.Responsavel_Nome}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{estagio.Provincia}</div>
                      <div className="text-sm text-gray-500">{estagio.Municipio}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getTipoEstagio(estagio.Tipo)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(estagio.Inicio)} - {formatDate(estagio.Termino)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${estagio.estudante_estado === 'Ativo'
                          ? 'bg-green-100 text-green-800'
                          : estagio.estudante_estado === 'Pendente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                        {estagio.estudante_estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(estagio.ID);
                          }}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <EditIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete([estagio.ID]);
                          }}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <DeleteIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Paginação */}
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="px-4 py-2 text-sm font-medium text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}