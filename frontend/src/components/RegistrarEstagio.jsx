import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';

export default function RegistrarEstagio() {
  const navigate = useNavigate();
  const [estudantes, setEstudantes] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [errors, setErrors] = useState({});
  const [provincias, setProvincias] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(false);

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
    Inicio: '',
    Termino: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [estudantesRes, empresasRes, provinciasRes] = await Promise.all([
          axios.get('http://localhost:5001/api/estudantes'),
          axios.get('http://localhost:5001/api/empresas'),
          axios.get('http://localhost:5001/api/provincias')
        ]);
        setEstudantes(estudantesRes.data);
        setEmpresas(empresasRes.data);
        
        // A API retorna um array de províncias
        if (Array.isArray(provinciasRes.data)) {
          const provinciasFormatadas = provinciasRes.data.map(provincia => ({
            id: provincia.slug,
            nome: provincia.nome
          }));
          setProvincias(provinciasFormatadas);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar dados. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchMunicipios = async () => {
      if (formData.Provincia) {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:5001/api/provincias/${formData.Provincia}/municipios`);
          
          // A API retorna um array de municípios
          if (Array.isArray(response.data)) {
            const municipiosFormatados = response.data.map(municipio => ({
              id: municipio.slug,
              nome: municipio.nome
            }));
            setMunicipios(municipiosFormatados);
          }
        } catch (error) {
          console.error('Erro ao carregar municípios:', error);
          alert('Erro ao carregar municípios. Por favor, tente novamente.');
        } finally {
          setLoading(false);
        }
      } else {
        setMunicipios([]);
      }
    };

    fetchMunicipios();
  }, [formData.Provincia]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value || '',
      ...(name === 'Provincia' && { Municipio: '' }) // Limpa o município quando a província muda
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEstudanteChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      Estudante_ID: selectedOption ? selectedOption.value : ''
    }));
    if (errors.Estudante_ID) {
      setErrors(prev => ({ ...prev, Estudante_ID: '' }));
    }
  };

  const handleEmpresaChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      Empresa_ID: selectedOption ? selectedOption.value : ''
    }));
    if (errors.Empresa_ID) {
      setErrors(prev => ({ ...prev, Empresa_ID: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Converte os valores para números e remove strings vazias
      const dataToSend = {
        ...formData,
        Tipo: formData.Tipo ? parseInt(formData.Tipo) : null,
        Modalidade: formData.Modalidade ? parseInt(formData.Modalidade) : null,
        Remunerado: formData.Remunerado ? parseInt(formData.Remunerado) : null,
        Estudante_ID: formData.Estudante_ID || null,
        Empresa_ID: formData.Empresa_ID || null
      };

      // Log para debug
      console.log('Dados sendo enviados:', dataToSend);

      const response = await axios.post('http://localhost:5001/api/estagios', dataToSend);
      if (response.status === 201) {
        alert('Estágio registrado com sucesso!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erro ao registrar estágio:', error);
      console.error('Resposta do servidor:', error.response?.data);
      if (error.response?.status === 400) {
        alert(`Erro: ${error.response.data.error || 'Por favor, preencha todos os campos obrigatórios corretamente.'}`);
      } else {
        alert('Ocorreu um erro ao registrar o estágio. Por favor, tente novamente.');
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validação dos campos obrigatórios
    if (!formData.Estudante_ID) newErrors.Estudante_ID = 'Selecione um estudante';
    if (!formData.Empresa_ID) newErrors.Empresa_ID = 'Selecione uma empresa';
    if (!formData.Provincia) newErrors.Provincia = 'Digite a província';
    if (!formData.Municipio) newErrors.Municipio = 'Digite o município';
    if (!formData.Rua) newErrors.Rua = 'Digite a rua';
    if (!formData.Tipo) newErrors.Tipo = 'Selecione o tipo';
    if (!formData.Modalidade) newErrors.Modalidade = 'Selecione a modalidade';
    if (!formData.Remunerado) newErrors.Remunerado = 'Selecione se é remunerado';
    if (!formData.Inicio) newErrors.Inicio = 'Selecione a data de início';
    if (!formData.Termino) newErrors.Termino = 'Selecione a data de término';

    // Validação de datas
    if (formData.Inicio && formData.Termino) {
      const dataInicio = new Date(formData.Inicio);
      const dataTermino = new Date(formData.Termino);
      
      if (dataTermino < dataInicio) {
        newErrors.Termino = 'A data de término deve ser posterior à data de início';
      }
    }

    // Validação dos campos numéricos
    if (formData.Tipo && isNaN(parseInt(formData.Tipo))) {
      newErrors.Tipo = 'Tipo inválido';
    }
    if (formData.Modalidade && isNaN(parseInt(formData.Modalidade))) {
      newErrors.Modalidade = 'Modalidade inválida';
    }
    if (formData.Remunerado && isNaN(parseInt(formData.Remunerado))) {
      newErrors.Remunerado = 'Valor inválido para remunerado';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getSelectedEstudante = () => {
    if (!formData.Estudante_ID) return '';
    const estudante = estudantes.find(e => e.ID === formData.Estudante_ID);
    return estudante ? estudante.ID : '';
  };

  const getSelectedEmpresa = () => {
    if (!formData.Empresa_ID) return '';
    const empresa = empresas.find(e => e.ID === formData.Empresa_ID);
    return empresa ? empresa.ID : '';
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col p-2 font-['PT_Sans']">
      <div className="w-full bg-white rounded-lg shadow-lg p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-gray-800">Registrar Estágio</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estudante <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <select
                  name="Estudante_ID"
                  value={getSelectedEstudante()}
                  onChange={handleEstudanteChange}
                  className={`w-full pl-10 border ${errors.Estudante_ID ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white text-base`}
                >
                  <option value="">Selecione o estudante</option>
                  {estudantes.map((estudante) => (
                    <option key={estudante.ID} value={estudante.ID}>
                      {`${estudante.Nome} ${estudante.Sobrenome}`}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.Estudante_ID && <p className="text-red-500 text-sm mt-1">{errors.Estudante_ID}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empresa <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <select
                  name="Empresa_ID"
                  value={getSelectedEmpresa()}
                  onChange={handleEmpresaChange}
                  className={`w-full pl-10 border ${errors.Empresa_ID ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white text-base`}
                >
                  <option value="">Selecione a empresa</option>
                  {empresas.map((empresa) => (
                    <option key={empresa.ID} value={empresa.ID}>
                      {empresa.Nome}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.Empresa_ID && <p className="text-red-500 text-sm mt-1">{errors.Empresa_ID}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Província <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <select
                  name="Provincia"
                  value={formData.Provincia}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full pl-10 border ${errors.Provincia ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none bg-white`}
                >
                  <option value="">Selecione a província</option>
                  {Array.isArray(provincias) && provincias.map(provincia => (
                    <option key={provincia.id} value={provincia.id}>
                      {provincia.nome}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.Provincia && <p className="text-red-500 text-sm mt-1">{errors.Provincia}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Município <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <select
                  name="Municipio"
                  value={formData.Municipio}
                  onChange={handleChange}
                  disabled={loading || !formData.Provincia}
                  className={`w-full pl-10 border ${errors.Municipio ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none bg-white`}
                >
                  <option value="">Selecione o município</option>
                  {Array.isArray(municipios) && municipios.map(municipio => (
                    <option key={municipio.id} value={municipio.id}>
                      {municipio.nome}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.Municipio && <p className="text-red-500 text-sm mt-1">{errors.Municipio}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rua <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="Rua"
                  value={formData.Rua}
                  onChange={handleChange}
                  className={`w-full pl-10 border ${errors.Rua ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150`}
                  placeholder="Digite a rua"
                />
              </div>
              {errors.Rua && <p className="text-red-500 text-sm mt-1">{errors.Rua}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <select
                  name="Tipo"
                  value={formData.Tipo}
                  onChange={handleChange}
                  className={`w-full pl-10 border ${errors.Tipo ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none bg-white`}
                >
                  <option value="">Selecione o tipo</option>
                  <option value="1">Acadêmico</option>
                  <option value="0">Voluntário</option>
                </select>
              </div>
              {errors.Tipo && <p className="text-red-500 text-sm mt-1">{errors.Tipo}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modalidade <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <select
                  name="Modalidade"
                  value={formData.Modalidade}
                  onChange={handleChange}
                  className={`w-full pl-10 border ${errors.Modalidade ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none bg-white`}
                >
                  <option value="">Modalidade</option>
                  <option value="0">Atribuído</option>
                  <option value="1">Adquirido</option>
                </select>
              </div>
              {errors.Modalidade && <p className="text-red-500 text-sm mt-1">{errors.Modalidade}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remunerado <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <select
                  name="Remunerado"
                  value={formData.Remunerado}
                  onChange={handleChange}
                  className={`w-full pl-10 border ${errors.Remunerado ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none bg-white`}
                >
                  <option value="">Remunerado</option>
                  <option value="1">Sim</option>
                  <option value="0">Não</option>
                </select>
              </div>
              {errors.Remunerado && <p className="text-red-500 text-sm mt-1">{errors.Remunerado}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Responsável
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="Responsavel_Nome"
                  value={formData.Responsavel_Nome}
                  onChange={handleChange}
                  className={`w-full pl-10 border ${errors.Responsavel_Nome ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150`}
                  placeholder="Nome do responsável"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone do Responsável
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="Responsavel_Telefone"
                  value={formData.Responsavel_Telefone}
                  onChange={handleChange}
                  className={`w-full pl-10 border ${errors.Responsavel_Telefone ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150`}
                  placeholder="Telefone do responsável"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Início <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="date"
                  name="Inicio"
                  value={formData.Inicio}
                  onChange={handleChange}
                  className={`w-full pl-10 border ${errors.Inicio ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150`}
                />
              </div>
              {errors.Inicio && <p className="text-red-500 text-sm mt-1">{errors.Inicio}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Término <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="date"
                  name="Termino"
                  value={formData.Termino}
                  onChange={handleChange}
                  className={`w-full pl-10 border ${errors.Termino ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150`}
                />
              </div>
              {errors.Termino && <p className="text-red-500 text-sm mt-1">{errors.Termino}</p>}
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cursos de Interesse <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              {/* Cursos de interesse content will be populated here */}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 