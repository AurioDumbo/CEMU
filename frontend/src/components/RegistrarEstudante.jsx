import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RegistrarEstudante = () => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [faculdades, setFaculdades] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    curso_id: '',
    telefone: '',
    email: '',
    estado: 'Pendente',
    faculdade_id: '',
    sexo: ''
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
          axios.get('http://localhost:5001/api/cursos', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5001/api/faculdades', {
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
      await axios.post('http://localhost:5001/api/estudantes', formData);
      toast.success('Estudante registrado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao registrar estudante:', error);
      toast.error('Erro ao registrar estudante. Por favor, tente novamente.');
    }
  };

  const InputField = ({ label, name, type = 'text', required = false, options = null, placeholder = '' }) => (
    <div className="relative">
      <label 
        htmlFor={name}
        className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {options ? (
        <select
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          required={required}
          className="mt-1 block w-full rounded-md border-0 py-3 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.ID} value={option.ID}>
              {option.Nome}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          required={required}
          placeholder={placeholder}
          className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">Novo Estudante</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
            {/* Informações Pessoais */}
            <div className="space-y-6 pt-8 first:pt-0">
              <div>
                <h3 className="text-base font-semibold leading-7 text-gray-900">Informações Pessoais</h3>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Preencha os dados pessoais do estudante.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <InputField
                    label="Nome"
                    name="nome"
                    required
                    placeholder="Digite o nome"
                  />
                </div>

                <div className="sm:col-span-2">
                  <InputField
                    label="Sobrenome"
                    name="sobrenome"
                    required
                    placeholder="Digite o sobrenome"
                  />
                </div>

                <div className="sm:col-span-2">
                  <div className="relative">
                    <label 
                      htmlFor="sexo"
                      className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Sexo <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="sexo"
                      name="sexo"
                      value={formData.sexo}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-0 py-3 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                    >
                      <option value="">Selecione o sexo</option>
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações de Contato */}
            <div className="space-y-6 pt-8">
              <div>
                <h3 className="text-base font-semibold leading-7 text-gray-900">Informações de Contato</h3>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Dados para contato com o estudante.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="exemplo@email.com"
                  />
                </div>

                <div className="sm:col-span-3">
                  <InputField
                    label="Telefone"
                    name="telefone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </div>

            {/* Informações Acadêmicas */}
            <div className="space-y-6 pt-8">
              <div>
                <h3 className="text-base font-semibold leading-7 text-gray-900">Informações Acadêmicas</h3>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Dados acadêmicos do estudante.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <InputField
                    label="Faculdade"
                    name="faculdade_id"
                    required
                    options={faculdades}
                    placeholder="Selecione a faculdade"
                  />
                </div>

                <div className="sm:col-span-2">
                  <InputField
                    label="Curso"
                    name="curso_id"
                    required
                    options={cursos}
                    placeholder="Selecione o curso"
                  />
                </div>

                <div className="sm:col-span-2">
                  <div className="relative">
                    <label 
                      htmlFor="estado"
                      className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Estado <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="estado"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-0 py-3 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                    >
                      <option value="">Selecione o estado</option>
                      <option value="Pendente">Pendente</option>
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="pt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors duration-200"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrarEstudante; 