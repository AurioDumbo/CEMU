import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function RegistrarEstagio() {
  const navigate = useNavigate();
  const [estudantes, setEstudantes] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [errors, setErrors] = useState({});
  const [provincias, setProvincias] = useState([]);
  const [municipios, setMunicipios] = useState([]);

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
    Data_Fim: '',
    Status: 'Pendente',
    Observacoes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [estRes, empRes, provRes] = await Promise.all([
          axios.get('http://localhost:5001/api/estudantes'),
          axios.get('http://localhost:5001/api/empresas'),
          axios.get('https://angolaprovinciasapi.ggwp.com.br/api/v1/provincias')
        ]);
        
        // Log para debug
        console.log('Dados dos estudantes:', estRes.data);
        console.log('Dados das empresas:', empRes.data);
        
        if (Array.isArray(estRes.data)) {
          setEstudantes(estRes.data);
        } else {
          console.error('Dados de estudantes não é um array:', estRes.data);
          setEstudantes([]);
        }
        
        if (Array.isArray(empRes.data)) {
          setEmpresas(empRes.data);
        } else {
          console.error('Dados de empresas não é um array:', empRes.data);
          setEmpresas([]);
        }
        
        setProvincias(Array.isArray(provRes.data) ? provRes.data : provRes.data.data || []);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        toast.error('Erro ao carregar dados. Por favor, tente novamente.');
      }
    };
    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    // Validação dos campos obrigatórios
    if (!formData.Estudante_ID || formData.Estudante_ID === '') {
      newErrors.Estudante_ID = 'O estudante é obrigatório';
    }
    
    if (!formData.Empresa_ID || formData.Empresa_ID === '') {
      newErrors.Empresa_ID = 'A empresa é obrigatória';
    }
    
    if (!formData.Provincia || formData.Provincia.trim() === '') {
      newErrors.Provincia = 'A província é obrigatória';
    }
    
    if (!formData.Municipio || formData.Municipio.trim() === '') {
      newErrors.Municipio = 'O município é obrigatório';
    }
    
    if (!formData.Rua || formData.Rua.trim() === '') {
      newErrors.Rua = 'A rua é obrigatória';
    }
    
    if (formData.Tipo === undefined || formData.Tipo === '') {
      newErrors.Tipo = 'O tipo é obrigatório';
    }
    
    if (formData.Modalidade === undefined || formData.Modalidade === '') {
      newErrors.Modalidade = 'A modalidade é obrigatória';
    }
    
    if (formData.Remunerado === undefined || formData.Remunerado === '') {
      newErrors.Remunerado = 'O campo remunerado é obrigatório';
    }
    
    if (!formData.Data_Inicio) {
      newErrors.Data_Inicio = 'A data de início é obrigatória';
    }
    
    if (!formData.Data_Fim) {
      newErrors.Data_Fim = 'A data de fim é obrigatória';
    } else if (new Date(formData.Data_Fim) < new Date(formData.Data_Inicio)) {
      newErrors.Data_Fim = 'A data de fim deve ser posterior à data de início';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'Provincia') {
      try {
        const resp = await axios.get(
          `https://angolaprovinciasapi.ggwp.com.br/api/v1/provincias/${value}/municipios`
        );
        setMunicipios(Array.isArray(resp.data) ? resp.data : resp.data.data || []);
        setFormData(prev => ({ ...prev, Municipio: '' }));
      } catch (err) {
        console.error('Erro ao carregar municípios:', err);
        toast.error('Erro ao carregar municípios. Por favor, tente novamente.');
      }
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
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
    };

    // Log para debug
    console.log('Payload a ser enviado:', payload);
    console.log('Valores originais:', {
      Modalidade: formData.Modalidade,
      Remunerado: formData.Remunerado
    });

    try {
      await axios.post('http://localhost:5001/api/estagios', payload);
      toast.success('Estágio registrado com sucesso!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro ao registrar estágio:', err.response?.data || err.message);
      const msg = err.response?.data?.error ||
        'Por favor, verifique se todos os campos obrigatórios foram preenchidos corretamente.';
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="estudante" className="block text-sm font-medium text-gray-700">
            Estudante <span className="text-red-500">*</span>
          </label>
          <select
            id="estudante"
            name="Estudante_ID"
            value={formData.Estudante_ID}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Selecione o estudante</option>
            {estudantes && estudantes.map((estudante, index) => (
              <option key={`estudante-${estudante.id || index}`} value={estudante.id}>
                {estudante.nome || `${estudante.Nome} ${estudante.Sobrenome}`}
              </option>
            ))}
          </select>
          {errors.Estudante_ID && <p className="mt-1 text-sm text-red-600">{errors.Estudante_ID}</p>}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="empresa" className="block text-sm font-medium text-gray-700">
            Empresa <span className="text-red-500">*</span>
          </label>
          <select
            id="empresa"
            name="Empresa_ID"
            value={formData.Empresa_ID}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Selecione a empresa</option>
            {empresas && empresas.map((empresa, index) => (
              <option key={`empresa-${empresa.id || empresa.ID || index}`} value={empresa.id || empresa.ID}>
                {empresa.nome || empresa.Nome}
              </option>
            ))}
          </select>
          {errors.Empresa_ID && <p className="mt-1 text-sm text-red-600">{errors.Empresa_ID}</p>}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="provincia" className="block text-sm font-medium text-gray-700">
            Província <span className="text-red-500">*</span>
          </label>
          <select
            id="provincia"
            name="Provincia"
            value={formData.Provincia}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Selecione a província</option>
            {provincias.map((provincia) => (
              <option key={provincia.slug} value={provincia.slug}>
                {provincia.nome}
              </option>
            ))}
          </select>
          {errors.Provincia && <p className="mt-1 text-sm text-red-600">{errors.Provincia}</p>}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="municipio" className="block text-sm font-medium text-gray-700">
            Município <span className="text-red-500">*</span>
          </label>
          <select
            id="municipio"
            name="Municipio"
            value={formData.Municipio}
            onChange={handleChange}
            required
            disabled={!formData.Provincia}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Selecione o município</option>
            {municipios.map((municipio) => (
              <option key={municipio.slug} value={municipio.slug}>
                {municipio.nome}
              </option>
            ))}
          </select>
          {errors.Municipio && <p className="mt-1 text-sm text-red-600">{errors.Municipio}</p>}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="rua" className="block text-sm font-medium text-gray-700">
            Rua <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="rua"
            name="Rua"
            value={formData.Rua}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.Rua && <p className="mt-1 text-sm text-red-600">{errors.Rua}</p>}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
            Tipo <span className="text-red-500">*</span>
          </label>
          <select
            id="tipo"
            name="Tipo"
            value={formData.Tipo}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Selecione o tipo</option>
            <option value="1">Acadêmico</option>
            <option value="0">Voluntário</option>
          </select>
          {errors.Tipo && <p className="mt-1 text-sm text-red-600">{errors.Tipo}</p>}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="modalidade" className="block text-sm font-medium text-gray-700">
            Modalidade <span className="text-red-500">*</span>
          </label>
          <select
            id="modalidade"
            name="Modalidade"
            value={formData.Modalidade}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Selecione a modalidade</option>
            <option value="0">Atribuído</option>
            <option value="1">Adquirido</option>
          </select>
          {errors.Modalidade && <p className="mt-1 text-sm text-red-600">{errors.Modalidade}</p>}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="remunerado" className="block text-sm font-medium text-gray-700">
            Remunerado <span className="text-red-500">*</span>
          </label>
          <select
            id="remunerado"
            name="Remunerado"
            value={formData.Remunerado}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Selecione</option>
            <option value="1">Sim</option>
            <option value="0">Não</option>
          </select>
          {errors.Remunerado && <p className="mt-1 text-sm text-red-600">{errors.Remunerado}</p>}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="responsavel_nome" className="block text-sm font-medium text-gray-700">
            Nome do Responsável
          </label>
          <input
            type="text"
            id="responsavel_nome"
            name="Responsavel_Nome"
            value={formData.Responsavel_Nome}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="responsavel_telefone" className="block text-sm font-medium text-gray-700">
            Telefone do Responsável
          </label>
          <input
            type="text"
            id="responsavel_telefone"
            name="Responsavel_Telefone"
            value={formData.Responsavel_Telefone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="data_inicio" className="block text-sm font-medium text-gray-700">
            Data de Início <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="data_inicio"
            name="Data_Inicio"
            value={formData.Data_Inicio}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.Data_Inicio && <p className="mt-1 text-sm text-red-600">{errors.Data_Inicio}</p>}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="data_fim" className="block text-sm font-medium text-gray-700">
            Data de Fim <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="data_fim"
            name="Data_Fim"
            value={formData.Data_Fim}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.Data_Fim && <p className="mt-1 text-sm text-red-600">{errors.Data_Fim}</p>}
        </div>

       

        
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Salvar
        </button>
      </div>
    </form>
  );
} 