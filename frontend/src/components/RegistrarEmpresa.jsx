import { useState, useEffect } from 'react';
import api from '../utils/axiosInstance';
import axios from 'axios'; // para APIs externas
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function RegistrarEmpresa({ onSuccess }) {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [errors, setErrors] = useState({});
  const [cursosInteressados, setCursosInteressados] = useState([]);
  const [provincias, setProvincias] = useState([]);

  const [formData, setFormData] = useState({
    NIF: '',
    Nome: '',
    Provincia: '',
    Telefone: '',
    Email: '',
    Status: 'Pendente',
    Sede: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cursosResponse, provinciasResponse] = await Promise.all([
          api.get('http://localhost:5001/api/curso'),
          axios.get('https://angolaprovinciasapi.ggwp.com.br/api/v1/provincias')
        ]);
        setCursos(cursosResponse.data);
        setProvincias(Array.isArray(provinciasResponse.data) ? provinciasResponse.data : provinciasResponse.data.data || []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        if (error.response && error.response.status === 401) {
          toast.error('Sessão expirada. Por favor, faça login novamente.');
          navigate('/login');
        } else {
          toast.error('Erro ao carregar dados. Por favor, tente novamente.');
        }
      }
    };

    fetchData();
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.NIF.trim()) {
      newErrors.NIF = 'O NIF é obrigatório';
    } else if (!/^\d{14}$/.test(formData.NIF)) {
      newErrors.NIF = 'NIF inválido (deve conter 14 dígitos)';
    }
    
    if (!formData.Nome.trim()) {
      newErrors.Nome = 'O nome é obrigatório';
    }
    
    if (!formData.Provincia.trim()) {
      newErrors.Provincia = 'A província é obrigatória';
    }
    
    if (!formData.Status) {
      newErrors.Status = 'O estado é obrigatório';
    }
    
    if (formData.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      newErrors.Email = 'Email inválido';
    }
    
    if (formData.Telefone && !/^\d{9}$/.test(formData.Telefone)) {
      newErrors.Telefone = 'Número de telemóvel inválido (deve conter 9 dígitos)';
    }

    if (cursosInteressados.length === 0) {
      newErrors.cursosInteressados = 'Selecione pelo menos um curso de interesse';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const empresaData = {
        NIF: formData.NIF,
        Nome: formData.Nome,
        Provincia: formData.Provincia,
        Telefone: formData.Telefone,
        Email: formData.Email,
        Status: formData.Status,
        Sede: formData.Sede
      };

      const response = await api.post('http://localhost:5001/api/empresas', empresaData);
      const empresaId = response.data.id;

      await api.post('http://localhost:5001/api/empresa_curso', {
        empresa_id: empresaId,
        cursos: cursosInteressados
      });

      setFormData({
        NIF: '',
        Nome: '',
        Provincia: '',
        Telefone: '',
        Email: '',
        Status: 'Pendente',
        Sede: false
      });
      setCursosInteressados([]);
      toast.success('Empresa registrada com sucesso!');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao registrar empresa:', error);
      if (error.response) {
        if (error.response.status === 401) {
          toast.error('Sessão expirada. Por favor, faça login novamente.');
          navigate('/login');
        } else if (error.response.status === 409) {
          if (error.response.data.error.includes('NIF')) {
            toast.error('Este NIF já está registrado no sistema');
          } else if (error.response.data.error.includes('Email')) {
            toast.error('Este email já está registrado no sistema');
          } else if (error.response.data.error.includes('Telefone')) {
            toast.error('Este número de telefone já está registrado no sistema');
          }
        } else if (error.response.status === 400) {
          toast.error('Por favor, verifique se todos os campos obrigatórios foram preenchidos corretamente.');
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="NIF" className="block text-sm font-medium text-gray-700">
            NIF <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="NIF"
            id="NIF"
            value={formData.NIF}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
          />
          {errors.NIF && <p className="mt-1 text-sm text-red-600">{errors.NIF}</p>}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="Denominação Social" className="block text-sm font-medium text-gray-700">
            Denominação Social  <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="Nome"
            id="Nome"
            value={formData.Nome}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
          />
          {errors.Nome && <p className="mt-1 text-sm text-red-600">{errors.Nome}</p>}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="Provincia" className="block text-sm font-medium text-gray-700">
            Província <span className="text-red-500">*</span>
          </label>
          <select
            id="Provincia"
            name="Provincia"
            value={formData.Provincia}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
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
          <label htmlFor="Telefone" className="block text-sm font-medium text-gray-700">
            Telefone
          </label>
          <input
            type="text"
            name="Telefone"
            id="Telefone"
            value={formData.Telefone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
          />
          {errors.Telefone && <p className="mt-1 text-sm text-red-600">{errors.Telefone}</p>}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="Email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="Email"
            id="Email"
            value={formData.Email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
          />
          {errors.Email && <p className="mt-1 text-sm text-red-600">{errors.Email}</p>}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="Status" className="block text-sm font-medium text-gray-700">
            Estado <span className="text-red-500">*</span>
          </label>
          <select
            id="Status"
            name="Status"
            value={formData.Status}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
          >
            <option value="Pendente">Pendente</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
          {errors.Status && <p className="mt-1 text-sm text-red-600">{errors.Status}</p>}
        </div>

        <div className="sm:col-span-3 flex items-center mt-6">
          <input
            type="checkbox"
            name="Sede"
            id="Sede"
            checked={formData.Sede}
            onChange={handleChange}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mr-2"
          />
          <label htmlFor="Sede" className="block text-sm font-medium text-gray-700 select-none cursor-pointer">
            Sede
          </label>
        </div>

        <div className="sm:col-span-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cursos de Interesse <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            {cursos.map((curso) => (
              <div key={curso.curso_id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`curso-${curso.curso_id}`}
                  value={curso.curso_id}
                  checked={cursosInteressados.includes(curso.curso_id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCursosInteressados([...cursosInteressados, curso.curso_id]);
                    } else {
                      setCursosInteressados(cursosInteressados.filter(id => id !== curso.curso_id));
                    }
                  }}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor={`curso-${curso.curso_id}`} className="ml-2 block text-sm text-gray-900">
                  {curso.curso_nome}
                </label>
              </div>
            ))}
          </div>
          {errors.cursosInteressados && (
            <p className="mt-1 text-sm text-red-600">{errors.cursosInteressados}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
       
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}