import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RegistrarEmpresa() {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [errors, setErrors] = useState({});
  const [cursosInteressados, setCursosInteressados] = useState([]);
  const [provincias] = useState([
    'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango',
    'Cuanza Norte', 'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla',
    'Luanda', 'Lunda Norte', 'Lunda Sul', 'Malanje', 'Moxico',
    'Namibe', 'Uíge', 'Zaire'
  ]);

  const [formData, setFormData] = useState({
    NIF: '',
    Nome: '',
    Provincia: '',
    Telefone: '',
    Email: '',
    Status: 'Pendente'
  });

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/curso');
        setCursos(response.data);
      } catch (error) {
        console.error('Erro ao carregar cursos:', error);
        alert('Erro ao carregar a lista de cursos. Por favor, tente novamente.');
      }
    };

    fetchCursos();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.NIF.trim()) {
      newErrors.NIF = 'O NIF é obrigatório';
    } else if (!/^\d{9}$/.test(formData.NIF)) {
      newErrors.NIF = 'NIF inválido (deve conter 9 dígitos)';
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
    
    if (formData.Telefone && !/^[0-9+\s-()]{9,}$/.test(formData.Telefone)) {
      newErrors.Telefone = 'Telefone inválido';
    }

    if (formData.cursosInteressados.length === 0) {
      newErrors.cursosInteressados = 'Selecione pelo menos um curso de interesse';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

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
        Status: formData.Status
      };

      const response = await axios.post('http://localhost:5001/api/empresas', empresaData);
      const empresaId = response.data.id;


      for (const cursoId of formData.cursosInteressados) {
        try {
          await axios.post('http://localhost:5001/api/empresas/cursos', {
            Empresa_ID: empresaId,
            Curso_ID: cursoId
          });
        } catch (error) {
          console.error('Erro ao registrar curso de interesse:', error);
          alert('Erro ao registrar alguns cursos de interesse. Por favor, verifique os cursos selecionados.');
        }
      }

      alert('Empresa registrada com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao registrar empresa:', error);
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else if (error.response?.status === 400) {
        alert('Por favor, verifique se todos os campos obrigatórios foram preenchidos corretamente.');
      } else {
        alert('Ocorreu um erro ao registrar a empresa. Por favor, tente novamente.');
      }
    }
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
            <h2 className="text-xl font-bold text-gray-800">Registrar Empresa</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NIF <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
          <input
            type="text"
            name="NIF"
            value={formData.NIF}
            onChange={handleChange}
                  className={`w-full pl-10 border ${errors.NIF ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base`}
                  placeholder="Digite o NIF"
                />
              </div>
              {errors.NIF && <p className="text-red-500 text-sm mt-1">{errors.NIF}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
          <input
            type="text"
            name="Nome"
            value={formData.Nome}
            onChange={handleChange}
                  className={`w-full pl-10 border ${errors.Nome ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base`}
                  placeholder="Digite o nome da empresa"
                />
              </div>
              {errors.Nome && <p className="text-red-500 text-sm mt-1">{errors.Nome}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Província <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <select
            name="Provincia"
            value={formData.Provincia}
            onChange={handleChange}
                  className={`w-full pl-10 border ${errors.Provincia ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white text-base`}
                >
                  <option value="">Selecione a província</option>
                  {provincias.map((provincia) => (
                    <option key={provincia} value={provincia}>
                      {provincia}
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
                Telefone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
          <input
            type="text"
            name="Telefone"
            value={formData.Telefone}
            onChange={handleChange}
                  className={`w-full pl-10 border ${errors.Telefone ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base`}
                  placeholder="Digite o telefone"
                />
              </div>
              {errors.Telefone && <p className="text-red-500 text-sm mt-1">{errors.Telefone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
          <input
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
                  className={`w-full pl-10 border ${errors.Email ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base`}
                  placeholder="Digite o email"
          />
        </div>
              {errors.Email && <p className="text-red-500 text-sm mt-1">{errors.Email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <select
                  name="Status"
                  value={formData.Status}
                  onChange={handleChange}
                  className={`w-full pl-10 border ${errors.Status ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white text-base`}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.Status && <p className="text-red-500 text-sm mt-1">{errors.Status}</p>}
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cursos de Interesse <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
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
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`curso-${curso.curso_id}`} className="ml-2 block text-sm text-gray-900">
                    {curso.curso_nome}
                  </label>
                </div>
              ))}
            </div>
            {errors.cursosInteressados && (
              <p className="text-red-500 text-sm mt-2">{errors.cursosInteressados}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Selecione os cursos de interesse da empresa
            </p>
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