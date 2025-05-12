import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditIcon from '../assets/icons/edit.svg?react';
import DeleteIcon from '../assets/icons/delete.svg?react';
import { canEditContent } from '../utils/permissions';
import { toast } from 'react-hot-toast';
import { Dialog } from '@headlessui/react';

export default function ListarEstagios() {
  const navigate = useNavigate();
  const [estagios, setEstagios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtroProvincia, setFiltroProvincia] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [canEdit] = useState(canEditContent());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const itemsPerPage = 8;

  useEffect(() => {

    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    fetchEstagios();
    
 
    const interval = setInterval(fetchEstagios, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [navigate]);

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
  
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
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


  const capitalize = (str) => {
    if (!str) return '';
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const filteredEstagios = estagios.filter(estagio => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = 
      estagio.estudante_nome?.toLowerCase().includes(searchTermLower) ||
      estagio.empresa_nome?.toLowerCase().includes(searchTermLower) ||
      estagio.Provincia?.toLowerCase().includes(searchTermLower) ||
      estagio.Municipio?.toLowerCase().includes(searchTermLower);
    
    const matchesProvincia = !filtroProvincia || 
      estagio.Provincia?.toLowerCase() === filtroProvincia.toLowerCase();
    
    const matchesEstado = !filtroEstado || 
      estagio.estudante_estado?.toLowerCase() === filtroEstado.toLowerCase();
    
    return matchesSearch && matchesProvincia && matchesEstado;
  });

  const exportarCSV = () => {
    const headers = [
      'ID',
      'Estudante',
      'Empresa',
      'Província',
      'Município',
      'Tipo',
      'Modalidade',
      'Remunerado',
      'Início',
      'Término',
      'Estado'
    ];

    const csvContent = [
      headers.join(';'),
      ...filteredEstagios.map(estagio => [
        estagio.ID || '',
        estagio.estudante_nome || '',
        estagio.empresa_nome || '',
        estagio.Provincia || '',
        estagio.Municipio || '',
        getTipoEstagio(estagio.Tipo),
        getModalidade(estagio.Modalidade),
        getRemunerado(estagio.Remunerado),
        formatDate(estagio.Inicio),
        formatDate(estagio.Termino),
        estagio.estudante_estado || ''
      ].join(';'))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `estagios_filtrados_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calcular paginação
  const totalPages = Math.ceil(filteredEstagios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredEstagios.slice(startIndex, endIndex);

  const handleEdit = (id) => {
    navigate(`/estagios/${id}/edit`);
  };

  const handleDelete = async (ids) => {
    setSelectedIds(ids);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await Promise.all(selectedIds.map(id => 
        axios.delete(`http://localhost:5001/api/estagios/${id}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        })
      ));
      toast.success('Estágios excluídos com sucesso!');
      fetchEstagios();
    } catch (error) {
      console.error('Erro ao excluir estágios:', error);
      if (error.response) {
        if (error.response.status === 404) {
          toast.error('Estágio não encontrado');
        } else if (error.response.status === 401) {
          toast.error('Não autorizado. Faça login novamente.');
          navigate('/login');
        } else {
          toast.error('Erro ao excluir estágios. Tente novamente.');
        }
      } else {
        toast.error('Erro ao conectar com o servidor. Verifique sua conexão.');
      }
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedIds([]);
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
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filtroProvincia}
              onChange={(e) => setFiltroProvincia(e.target.value)}
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Província</option>
              {[...new Set(estagios.map(e => e.Provincia))].map(provincia => (
                <option key={provincia} value={provincia}>{capitalize(provincia)}</option>
              ))}
            </select>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Estado</option>
              <option value="Ativo">Ativo</option>
              <option value="Pendente">Pendente</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={exportarCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Exportar CSV
            </button>
          </div>
        </div>

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
                  {canEdit && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  )}
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
                      <div className="text-sm text-gray-900">{capitalize(estagio.Provincia)}</div>
                      <div className="text-sm text-gray-500">{capitalize(estagio.Municipio)}</div>
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
                    {canEdit && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleEdit(estagio.ID)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <EditIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete([estagio.ID])}
                            className="text-red-600 hover:text-red-900"
                          >
                            <DeleteIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    )}
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

      {/* Modal de Confirmação de Exclusão */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Confirmar Exclusão
            </Dialog.Title>
            
            <Dialog.Description className="mt-2 text-sm text-gray-500">
              Tem certeza que deseja excluir {selectedIds.length > 1 ? 'os estágios selecionados' : 'este estágio'}? Esta ação não pode ser desfeita.
            </Dialog.Description>

            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Excluir
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}