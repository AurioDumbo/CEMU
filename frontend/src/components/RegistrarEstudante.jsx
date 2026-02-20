import React, { useState, useEffect } from 'react';
import api from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RegistrarEstudante = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [cursosFiltrados, setCursosFiltrados] = useState([]);
  const [faculdades, setFaculdades] = useState([]);
  const [formData, setFormData] = useState({
    Nome: '',
    Sobrenome: '',
    Curso_ID: '',
    Telefone: '',
    Email: '',
    Faculdade_ID: '',
    Sexo: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const [cursosResponse, faculdadesResponse] = await Promise.all([
          api.get('/api/curso'),
          api.get('/api/faculdade')
        ]);
        setCursos(cursosResponse.data);
        setFaculdades(faculdadesResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados. Por favor, tente novamente.');
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (formData.Faculdade_ID) {
      const cursosDaFaculdade = cursos.filter(curso =>
        curso.faculdade_id === parseInt(formData.Faculdade_ID)
      );
      setCursosFiltrados(cursosDaFaculdade);
      setFormData(prev => ({ ...prev, Curso_ID: '' }));
    } else {
      setCursosFiltrados([]);
    }
  }, [formData.Faculdade_ID, cursos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
   
    if (name === 'Nome' || name === 'Sobrenome') {
      newValue = newValue.replace(/\d/g, '');
    }
      
    if (name === 'Telefone') {
      newValue = newValue.replace(/\D/g, '').slice(0, 9);
    }
    setFormData(prevState => ({
      ...prevState,
      [name]: newValue
    }));
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.Nome.trim()) {
      newErrors.Nome = 'O nome é obrigatório.';
    } else if (/\d/.test(formData.Nome)) {
      newErrors.Nome = 'O nome não pode conter números.';
    }
    if (!formData.Sobrenome.trim()) {
      newErrors.Sobrenome = 'O sobrenome é obrigatório.';
    } else if (/\d/.test(formData.Sobrenome)) {
      newErrors.Sobrenome = 'O sobrenome não pode conter números.';
    }
    if (formData.Telefone && formData.Telefone.length !== 9) {
      newErrors.Telefone = 'Número de telemóvel inválido. Deve conter exatamente 9 dígitos.';
    }
    if (formData.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      toast.error('Email inválido. Por favor, insira um email válido.');
      return;
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        Estado: 'Pendente'
      };
      const response = await api.post('/api/estudantes', dataToSend);

      if (response.status === 201) {
        setFormData({
          Nome: '',
          Sobrenome: '',
          Curso_ID: '',
          Telefone: '',
          Email: '',
          Faculdade_ID: '',
          Sexo: ''
        });
        if (onSuccess) onSuccess();
        toast.success('Estudante registrado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao registrar estudante:', error);
      if (error.response) {
        if (error.response.status === 409) {
          if (error.response.data.error.includes('Email')) {
            toast.error('Este email já está registrado no sistema');
          } else if (error.response.data.error.includes('Telefone')) {
            toast.error('Este número de telefone já está registrado no sistema');
          }
        } else if (error.response.status === 400) {
          toast.error('Por favor, verifique se todos os campos obrigatórios foram preenchidos corretamente.');
        } else if (error.response.status === 401) {
          toast.error('Não autorizado. Faça login novamente.');
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
          <label htmlFor="Nome" className="block text-sm font-medium text-gray-700">
            Nome <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="Nome"
            id="nome"
            value={formData.Nome}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-red-500 sm:text-sm"
          />
          {errors.Nome && <p className="mt-1 text-sm text-red-600">{errors.Nome}</p>}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="Sobrenome" className="block text-sm font-medium text-gray-700">
            Sobrenome <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="Sobrenome"
            id="sobrenome"
            value={formData.Sobrenome}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
          />
          {errors.Sobrenome && <p className="mt-1 text-sm text-red-600">{errors.Sobrenome}</p>}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="Sexo" className="block text-sm font-medium text-gray-700">
            Sexo <span className="text-red-500">*</span>
          </label>
          <select
            id="sexo"
            name="Sexo"
            value={formData.Sexo}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
          >
            <option value="">Selecione o sexo</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="Email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="Email"
            id="email"
            value={formData.Email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="Telefone" className="block text-sm font-medium text-gray-700">
            Telefone
          </label>
          <input
            type="tel"
            name="Telefone"
            id="telefone"
            value={formData.Telefone}
            onChange={handleChange}
            maxLength={9}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.Telefone && <p className="mt-1 text-sm text-red-600">{errors.Telefone}</p>}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="Faculdade_ID" className="block text-sm font-medium text-gray-700">
            Faculdade <span className="text-red-500">*</span>
          </label>
          <select
            id="faculdade_id"
            name="Faculdade_ID"
            value={formData.Faculdade_ID}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option key="default-faculdade" value="">Selecione a faculdade</option>
            {faculdades.filter(faculdade => faculdade.ID).map((faculdade) => (
              <option key={`faculdade-${faculdade.ID}`} value={faculdade.ID}>
                {faculdade.Nome}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="Curso_ID" className="block text-sm font-medium text-gray-700">
            Curso <span className="text-red-500">*</span>
          </label>
          <select
            id="curso_id"
            name="Curso_ID"
            value={formData.Curso_ID}
            onChange={handleChange}
            required
            disabled={!formData.Faculdade_ID}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option key="default-curso" value="">Selecione o curso</option>
            {cursosFiltrados.map((curso) => (
              <option key={`curso-${curso.curso_id}`} value={curso.curso_id}>
                {curso.curso_nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
      
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Salvar
        </button>
      </div>
    </form>
  );
};

export default RegistrarEstudante;