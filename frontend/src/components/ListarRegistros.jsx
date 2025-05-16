import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import EditIcon from '../assets/icons/edit.svg?react';
import DeleteIcon from '../assets/icons/delete.svg?react';
import { canEditContent } from '../utils/permissions';

const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const ListarRegistros = () => {
  const [activeTab, setActiveTab] = useState('estudantes');
  const [estudantes, setEstudantes] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtroFaculdade, setFiltroFaculdade] = useState('');
  const [filtroCurso, setFiltroCurso] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroEmpresaEstado, setFiltroEmpresaEstado] = useState('');
  const [filtroEmpresaProvincia, setFiltroEmpresaProvincia] = useState('');
  const [cursosFiltrados, setCursosFiltrados] = useState([]);
  const [canEdit] = useState(canEditContent());
  const itemsPerPage = 8;
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(''); // 'empresa' ou 'estudante'

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
          api.get('http://localhost:5001/api/estudantes'),
          api.get('http://localhost:5001/api/empresas')
        ]);

        // Processar os dados dos estudantes para garantir que faculdade e curso estejam corretos
        const estudantesProcessados = estudantesRes.data.map(estudante => ({
          ...estudante,
          faculdade: {
            ...estudante.faculdade,
            nome: estudante.faculdade?.nome || estudante.faculdade_nome || 'Não informado'
          },
          curso: {
            ...estudante.curso,
            nome: estudante.curso?.nome || estudante.curso_nome || 'Não informado'
          }
        }));

        console.log('Dados recebidos:', {
          estudantes: estudantesProcessados.length,
          empresas: empresasRes.data.length
        });

        setEstudantes(estudantesProcessados);
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

  // Atualizar os dados após operações de exclusão
  const atualizarDados = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const [estudantesRes, empresasRes] = await Promise.all([
        api.get('http://localhost:5001/api/estudantes'),
        api.get('http://localhost:5001/api/empresas')
      ]);

      const estudantesProcessados = estudantesRes.data.map(estudante => ({
        ...estudante,
        faculdade: {
          ...estudante.faculdade,
          nome: estudante.faculdade?.nome || estudante.faculdade_nome || 'Não informado'
        },
        curso: {
          ...estudante.curso,
          nome: estudante.curso?.nome || estudante.curso_nome || 'Não informado'
        }
      }));

      setEstudantes(estudantesProcessados);
      setEmpresas(empresasRes.data);
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      toast.error('Erro ao atualizar dados');
    }
  };

  const handleDeleteEmpresa = async (id, askConfirm = true) => {
    if (askConfirm) {
      openConfirmModal('empresa', { id: id || id });
      return;
    }
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await api.delete(`http://localhost:5001/api/empresas/${id}`);
      toast.success('Empresa excluída com sucesso');
      await atualizarDados();
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      // Tenta pegar a mensagem do backend
      const mensagem = error.response?.data?.message || 'Erro ao excluir empresa';
      toast.error(mensagem);
    }
  };

  const handleDeleteEstudante = async (id, askConfirm = true) => {
    if (askConfirm) {
      openConfirmModal('estudante', { id });
      return;
    }
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await api.delete(`http://localhost:5001/api/estudantes/${id}`);
      toast.success('Estudante excluído com sucesso');
      await atualizarDados();
    } catch (error) {
      console.error('Erro ao excluir estudante:', error);
      toast.error('Erro ao excluir estudante');
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = activeTab === 'empresas' 
        ? empresas.filter(empresa => 
            empresa.nome.toLowerCase().includes(value.toLowerCase()) ||
            empresa.nif.toLowerCase().includes(value.toLowerCase()) ||
            empresa.email.toLowerCase().includes(value.toLowerCase())
          )
        : estudantes.filter(estudante => {
            const matchesSearch = 
            estudante.nome.toLowerCase().includes(value.toLowerCase()) ||
              estudante.email.toLowerCase().includes(value.toLowerCase());
            
            const matchesFaculdade = !filtroFaculdade || 
              (estudante.faculdade?.nome || estudante.faculdade_nome || '').toLowerCase() === filtroFaculdade.toLowerCase();
            
            const matchesCurso = !filtroCurso || 
              (estudante.curso?.nome || estudante.curso_nome || '').toLowerCase() === filtroCurso.toLowerCase();
            
            const matchesEstado = !filtroEstado || 
              estudante.status.toLowerCase() === filtroEstado.toLowerCase();
            
            return matchesSearch && matchesFaculdade && matchesCurso && matchesEstado;
          });
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const filteredData = activeTab === 'empresas' 
    ? empresas.filter(empresa => {
        const matchesSearch =
        empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empresa.nif.toLowerCase().includes(searchTerm.toLowerCase()) ||
          empresa.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesProvincia = !filtroEmpresaProvincia ||
          (empresa.provincia || empresa.Provincia || '').toLowerCase() === filtroEmpresaProvincia.toLowerCase();
        const matchesEstado = !filtroEmpresaEstado ||
          (empresa.status || empresa.Status || '').toLowerCase() === filtroEmpresaEstado.toLowerCase();
        return matchesSearch && matchesProvincia && matchesEstado;
      })
    : estudantes.filter(estudante => {
        const matchesSearch = 
        estudante.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          estudante.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFaculdade = !filtroFaculdade || 
          (estudante.faculdade?.nome || estudante.faculdade_nome || '').toLowerCase() === filtroFaculdade.toLowerCase();
        
        const matchesCurso = !filtroCurso || 
          (estudante.curso?.nome || estudante.curso_nome || '').toLowerCase() === filtroCurso.toLowerCase();
        
        const matchesEstado = !filtroEstado || 
          estudante.status.toLowerCase() === filtroEstado.toLowerCase();
        
        return matchesSearch && matchesFaculdade && matchesCurso && matchesEstado;
      });

  // Obter lista única de faculdades e cursos para os filtros
  const faculdadesUnicas = [...new Set(estudantes.map(e => e.faculdade?.nome || e.faculdade_nome).filter(Boolean))];
  
  // Atualizar cursos filtrados quando a faculdade mudar
  useEffect(() => {
    if (filtroFaculdade) {
      const cursosDaFaculdade = estudantes
        .filter(e => (e.faculdade?.nome || e.faculdade_nome) === filtroFaculdade)
        .map(e => e.curso?.nome || e.curso_nome)
        .filter(Boolean);
      setCursosFiltrados([...new Set(cursosDaFaculdade)]);
      setFiltroCurso(''); // Resetar o filtro de curso quando a faculdade muda
    } else {
      setCursosFiltrados([]);
      setFiltroCurso('');
    }
  }, [filtroFaculdade, estudantes]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const exportarCSV = () => {
    const dados = activeTab === 'empresas' ? filteredData : filteredData;
    
    if (activeTab === 'empresas') {

      const empresaHeaders = [
        'ID',
        'Nome',
        'NIF',
        'Província',
        'Email',
        'Telefone',
        'Status'
      ];


      const empresaCsvContent = [
        empresaHeaders.join(';'),
        ...dados.map(item => [
          item.id || item.ID || '',
          item.nome || item.Nome || '',
          item.nif || item.NIF || '',
          item.provincia || item.Provincia || '',
          item.email || item.Email || '',
          item.telefone || item.Telefone || '',
          item.status || item.Status || ''
        ].join(';'))
      ].join('\n');

      const empresaBlob = new Blob(['\ufeff' + empresaCsvContent], { type: 'text/csv;charset=utf-8;' });
      const empresaLink = document.createElement('a');
      const empresaUrl = URL.createObjectURL(empresaBlob);
      empresaLink.setAttribute('href', empresaUrl);
      empresaLink.setAttribute('download', `empresas_filtradas_${new Date().toISOString().split('T')[0]}.csv`);
      empresaLink.style.visibility = 'hidden';
      document.body.appendChild(empresaLink);
      empresaLink.click();
      document.body.removeChild(empresaLink);
    } else {

      const estudanteHeaders = [
        'ID',
        'Nome',
        'Sobrenome',
        'Faculdade',
        'Curso',
        'Email',
        'Telefone',
        'Status'
      ];

  
      const estudanteCsvContent = [
        estudanteHeaders.join(';'),
        ...dados.map(item => {
          const nomeCompleto = item.nome || `${item.Nome || ''} ${item.Sobrenome || ''}`;
          const [nome, ...sobrenomeArr] = nomeCompleto.split(' ');
          const sobrenome = sobrenomeArr.join(' ');

          return [
            item.id || item.ID || '',
            nome || '',
            sobrenome || '',
            item.faculdade?.nome || item.faculdade_nome || '',
            item.curso?.nome || item.curso_nome || '',
            item.email || item.Email || '',
            item.telefone || item.Telefone || '',
            item.status || item.Estado || ''
          ].join(';');
        })
      ].join('\n');

      const estudanteBlob = new Blob(['\ufeff' + estudanteCsvContent], { type: 'text/csv;charset=utf-8;' });
      const estudanteLink = document.createElement('a');
      const estudanteUrl = URL.createObjectURL(estudanteBlob);
      estudanteLink.setAttribute('href', estudanteUrl);
      estudanteLink.setAttribute('download', `estudantes_filtrados_${new Date().toISOString().split('T')[0]}.csv`);
      estudanteLink.style.visibility = 'hidden';
      document.body.appendChild(estudanteLink);
      estudanteLink.click();
      document.body.removeChild(estudanteLink);
    }
  };

  const openConfirmModal = (type, item) => {
    setDeleteType(type);
    setItemToDelete(item);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    if (deleteType === 'empresa') {
      await handleDeleteEmpresa(itemToDelete.id, false); // false para não pedir confirmação de novo
    } else {
      await handleDeleteEstudante(itemToDelete.id, false);
    }
    setShowConfirmModal(false);
    setItemToDelete(null);
  };

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
            {activeTab === 'estudantes' && (
              <>
                <select
                  value={filtroFaculdade}
                  onChange={(e) => setFiltroFaculdade(e.target.value)}
                  className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Faculdade</option>
                  {faculdadesUnicas.map(faculdade => (
                    <option key={faculdade} value={faculdade}>{faculdade}</option>
                  ))}
                </select>

                <select
                  value={filtroCurso}
                  onChange={(e) => setFiltroCurso(e.target.value)}
                  className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!filtroFaculdade}
                >
                  <option value="">Curso</option>
                  {cursosFiltrados.map(curso => (
                    <option key={curso} value={curso}>{curso}</option>
                  ))}
                </select>

                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos os Estados</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </>
            )}
            {activeTab === 'empresas' && (
              <>
                <select
                  value={filtroEmpresaProvincia}
                  onChange={(e) => setFiltroEmpresaProvincia(e.target.value)}
                  className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Província</option>
                  {[...new Set(empresas.map(e => e.provincia || e.Provincia || ''))].filter(Boolean).map(provincia => (
                    <option key={provincia} value={provincia}>{provincia}</option>
                  ))}
                </select>
                <select
                  value={filtroEmpresaEstado}
                  onChange={(e) => setFiltroEmpresaEstado(e.target.value)}
                  className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Estado</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </>
            )}
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('estudantes')}
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                activeTab === 'estudantes'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Estudantes
            </button>
            <button
              onClick={() => setActiveTab('empresas')}
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                activeTab === 'empresas'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Empresas
            </button>
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
          <div className="overflow-x-auto w-full">
            {activeTab === 'estudantes' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculdade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      {canEdit && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentData.map((estudante) => (
                      <tr key={estudante.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{estudante.nome}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{estudante.faculdade.nome}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{estudante.curso.nome}</td>
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
                        {canEdit && (
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => navigate(`/estudante/${estudante.id}/edit`)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <EditIcon className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteEstudante(estudante.id)}
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
                      {canEdit && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentData.map((empresa) => (
                      <tr key={empresa.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{empresa.nome}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{empresa.nif}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{empresa.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{empresa.telefone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {capitalize(empresa.provincia || empresa.Provincia)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${empresa.status === 'Ativo' ? 'bg-green-100 text-green-800' : 
                            empresa.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                            {empresa.status}
                          </span>
                        </td>
                        {canEdit && (
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => {
                                  const empresaId = empresa?.ID || empresa?.id;
                                  console.log('Dados da empresa:', empresa);
                                  console.log('ID da empresa:', empresaId);
                                  if (!empresaId) {
                                    toast.error('ID da empresa não encontrado');
                                    return;
                                  }
                                  navigate(`/empresas/${empresaId}/edit`);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <EditIcon className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteEmpresa(empresa.id || empresa.ID)}
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
              </div>
            )}
          </div>
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

      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Confirmação</h2>
            <p className="mb-6 text-gray-600">
              Tem certeza que deseja excluir este {deleteType === 'empresa' ? 'empresa' : 'estudante'}?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListarRegistros;