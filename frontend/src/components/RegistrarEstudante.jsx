import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RegistrarEstudante = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const [cursosResponse, faculdadesResponse] = await Promise.all([
          axios.get('http://localhost:5001/api/curso', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5001/api/faculdade', {
            headers: { Authorization: `Bearer ${token}` }
          })
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        Estado: 'Pendente'
      };
      const response = await axios.post('http://localhost:5001/api/estudantes', dataToSend, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });

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
        onSuccess();
        toast.success('Estudante registrado com sucesso!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erro ao registrar estudante:', error);
      toast.error('Erro ao registrar estudante. Por favor, tente novamente.');
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option key="default-curso" value="">Selecione o curso</option>
            {cursos.filter(curso => curso.curso_id).map((curso) => (
              <option key={`curso-${curso.curso_id}`} value={curso.curso_id}>
                {curso.curso_nome}
              </option>
            ))}
          </select>
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
};

export default RegistrarEstudante;